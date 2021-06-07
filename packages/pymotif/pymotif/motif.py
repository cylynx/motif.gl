#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Cylynx.
# Distributed under the terms of the Modified BSD License.

import json
import neo4j
import networkx as nx
import pandas as pd

from ipywidgets import DOMWidget, ValueWidget, register, Layout
from traitlets import Dict, Unicode, Bool

from ._frontend import module_name, module_version

# determines how the widget is displayed in the cell
DISPLAY = Layout(width='100%', height='600px')

# minimise hard-coding elsewhere
NX_GRAPH = 'nx_graph'
NEO4J_GRAPH = 'neo4j_graph'
JSON_PATH = 'json_path'
CSV_PATH = 'csv_path'
STYLE = 'style'
TITLE = 'title'
GROUP_EDGES = 'group_edges'

DATA = 'data'
METADATA = 'metadata'
NODES = 'nodes'
EDGES = 'edges'

# allowed kwargs upon class instantiation
ALLOWED = {
    NX_GRAPH: nx.Graph,
    NEO4J_GRAPH: neo4j.graph.Graph,
    JSON_PATH: str,
    CSV_PATH: str,
    STYLE: dict,
    TITLE: str,
    GROUP_EDGES: bool
}


@register
class Motif(DOMWidget, ValueWidget):
    """
    Motif class that wraps a Jupyter widget

    ------------
     Attributes 
    ------------
    state: dict
        Follows the TLoadFormat interface defined in Motif's types.ts.
        
        There are 2 possible keys: data, style.
        Data is a list of graph data describing what will be rendered in the widget.
        Style is a dict describing how the graphs will be rendered.
    
    group_edges: bool = True
        Whether to group edges for the currently-rendered graph
    """

    # widget boilerplate: specify which front-end model / view to associate with
    _model_name = Unicode('MotifModel').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)

    _view_name = Unicode('MotifView').tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)

    # variables with defaults that sync with JS side.
    # group_edges will be overwritten if the setting is set in 'state'
    state = Dict({ DATA: [], STYLE: {} }).tag(sync=True)
    group_edges = Bool(True).tag(sync=True)


    def __init__(self, **kwargs):
        """
        ------------
         Parameters
        ------------
        All parameters are optional.
        Only one graph import (json_path, nx_graph, or csv_path) can be passed each time.

        json_path: str
            Path to a local JSON file containing the graph data.
            If this is used, all other params will be ignored.

        nx_graph: nx.Graph
            A networkx graph to be rendered

        neo4j_graph: neo4j.graph.Graph
            A neo4j graph to be rendered

        csv_path: str
            Path to a local CSV edgelist file

        style: dict
            The rendered graph's style

        title: str
            The rendered graph's title
        
        group_edges: bool = True
            Whether to group edges if there are multiple edges from the same
            source to same target. Overwrites previous setting, if any.
        """
        super().__init__(layout=DISPLAY)

        if kwargs:
            self.state, self.group_edges = self._prep_import(**kwargs)
            self._update_state()


    def add_graph(self, **kwargs):
        """
        Adds another graph to an existing Motif widget.
        Takes the same parameters as __init__.
        If provided, graph settings here will overwrite those set previously (e.g. style).
        """
        graph, self.group_edges = self._prep_import(**kwargs)

        self.state[DATA] += graph[DATA]
        self.state[STYLE] = graph.get(STYLE, self.state[STYLE])

        self._update_state()


    def set_style(self, style: dict, overwrite=False):
        """
        Allows updating the style of an existing widget.

        ------------
         Parameters
        ------------
        style: dict
            The rendered graph's style
        overwrite=False:
            If True, overwrites all existing styles with the passed 'style' param.
            If False, merges 'style' param with existing styles
        """
        self._validate(style=style)

        if overwrite:
            self.state[STYLE] = style
        else:
            self.state[STYLE].update(style)

        self._update_state()


    def plot(self):
        """ Plots the graphs' current state as a Jupyter widget """
        return self


    def _validate(self, require_import=False, **kwargs):
        """ 
        Basic validation for params used in other methods.
        Expects the same kwarg parameters as __init__.

        Checks that 
            1) Only vars defined in ALLOWED are passed
            2) Kwarg types match those defined in ALLOWED
            3) Other param-specific checks

        require_import=False:
            Whether it is required to pass a graph import.
        """
        IMPORTS = { JSON_PATH, NX_GRAPH, NEO4J_GRAPH, CSV_PATH }

        # if required, check that only 1 import type is passed
        if require_import and len(set(kwargs) & IMPORTS) != 1:
            raise KeyError(f'Pass 1 import type parameter: nx_graph, neo4j_graph, json_path, or csv_path.')

        for k, v in kwargs.items():
            # check for accepted params
            if k not in ALLOWED:
                raise KeyError(f'{k} is not an accepted parameter')

            # check types
            if not isinstance(v, ALLOWED[k]):
                raise TypeError(f'{k} must be of type {ALLOWED[k]}')
            
            # param-specific checks
            if k == JSON_PATH:
                if not v.endswith('.json'):
                    raise ValueError(f'{k} should end with .json')

            if k == CSV_PATH:
                if not v.endswith('.csv'):
                    raise ValueError(f'{k} should end with .csv')
            
            if k == TITLE and not v:
                raise ValueError(f'{k} should not be an empty string')


    def _prep_import(self, **kwargs) -> (dict, bool):
        """ 
        Based on kwargs passed, prepares graph data from various formats
        to be imported into the Motif widget.

        Actual import is done elsewhere by adding the returned dict
        to self.state.

        Returns a tuple of (graph: dict, group_edges: bool):
            graph - Graph to import
            group_edges - Whether to group edges, default True
        """
        self._validate(require_import=True, **kwargs)

        graph = {}
        group_edges = True

        # a JSON file will be directly set as the graph to import
        if JSON_PATH in kwargs:
            print('Reading JSON file, all other params will be ignored...')
            json_path = kwargs[JSON_PATH]
            
            with open(json_path, 'r') as json_data:
                graph = json.load(json_data)

        # other formats require pre-processing
        else:
            motif_graph = {}
            style = kwargs.get(STYLE, {})

            if NX_GRAPH in kwargs:
                nx_graph = kwargs[NX_GRAPH]
                motif_graph = self._nx_to_motif(nx_graph)  
            
            if NEO4J_GRAPH in kwargs:
                neo4j_graph = kwargs[NEO4J_GRAPH]
                motif_graph = self._neo4j_to_motif(neo4j_graph)
            
            if CSV_PATH in kwargs:
                csv_path = kwargs[CSV_PATH]
                motif_graph = self._csv_to_motif(csv_path)

            # add title to data if provided
            if TITLE in kwargs:
                metadata_title = { TITLE: kwargs[TITLE] }
                motif_graph[METADATA] = metadata_title

            graph = { DATA: [motif_graph], STYLE: style }
            group_edges: bool = kwargs.get(GROUP_EDGES, True)
        
        return graph, group_edges


    def _nx_to_motif(self, nx_graph: nx.Graph) -> dict:
        """
        Converts an nx_graph into a dict format suitable for plotting in Motif:
        { nodes: [...], edges: [...] }
        """
        self._validate(nx_graph=nx_graph)
        
        motif_data = {}

        # convert nx_graph to cyjs format: (http://manual.graphspace.org/en/latest/GraphSpace_Network_Model.html#cyjs-format)
        try:
            cyjs = nx.readwrite.json_graph.cytoscape_data(nx_graph)
        except:
            raise Exception('Could not convert nx_graph to cyjs format')

        # take relevant parts from cyjs format and add to data
        motif_data[NODES] = [node[DATA] for node in cyjs['elements'][NODES]]
        motif_data[EDGES] = [edge[DATA] for edge in cyjs['elements'][EDGES]]

        return motif_data
    

    def _neo4j_to_motif(self, neo4j_graph: neo4j.graph.Graph) -> dict:
        """
        Converts a neo4j_graph into a networkx graph, then into a dict format 
        suitable for plotting in Motif: { nodes: [...], edges: [...] }
        """
        self._validate(neo4j_graph=neo4j_graph)
        
        motif_data = {}

        # will hold the networkx graph that's converted from neo4j
        nx_graph = nx.MultiDiGraph()
        
        # try to construct the networkx graph
        try:
            # https://stackoverflow.com/questions/59289134/constructing-networkx-graph-from-neo4j-query-result
            # https://github.com/neo4j/neo4j-python-driver/blob/4.3/neo4j/graph/__init__.py
            nodes = list(neo4j_graph._nodes.values())
            edges = list(neo4j_graph._relationships.values())
            
            for node in nodes:
                # props are node attributes
                props = node._properties

                # somehow, 'name' is overwritten on the frontend to be set as id. replace with another key
                if 'name' in props:
                    props['_name'] = props.pop('name')

                # next(iter(node._labels)) to extract the only item from a frozenset
                nx_graph.add_node(node.id, entity=next(iter(node._labels)), **props)    
            
            for edge in edges:
                 nx_graph.add_edge(edge.start_node.id, edge.end_node.id, relationship=edge.type)
        except:
            raise Exception('Could not convert neo4j_graph to nx_graph')

        # pass to nx_graph converter
        motif_data = self._nx_to_motif(nx_graph)

        return motif_data


    def _csv_to_motif(self, csv_path: str) -> dict:
        """
        Reads a csv file at csv_path, then converts it into a dict format
        suitable for plotting in Motif: { nodes: [...], edges: [...] }
        """
        self._validate(csv_path=csv_path)
        
        motif_data = {}

        # read csv into df, then into nx_graph, then into motif format
        try:
            df = pd.read_csv(csv_path)
            nx_graph = nx.from_pandas_edgelist(
                df=df,
                create_using=nx.MultiDiGraph, 
                edge_attr=True
            )
        except:
            raise Exception('Could not convert CSV file') 

        motif_data = self._nx_to_motif(nx_graph)

        return motif_data


    def _update_state(self):
        """
        Empties self.state before reassigning state to it again. 

        This is needed to sync updates to mutable types with front-end:
        https://ipywidgets.readthedocs.io/en/latest/examples/Widget%20Custom.html#sync=True-traitlets
        """
        tmp: dict = self.state
        self.state = {}
        self.state = tmp
