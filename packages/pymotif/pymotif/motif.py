#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Cylynx.
# Distributed under the terms of the Modified BSD License.

import json
import neo4j
import networkx as nx
import pandas as pd

from ipywidgets import DOMWidget, ValueWidget, register
from traitlets import Dict, Unicode

from . import constants as C
from ._frontend import module_name, module_version


@register
class Motif(DOMWidget, ValueWidget):
    """
    Motif class that wraps a Jupyter widget

    ------------
     Attributes 
    ------------
    state: dict
        There are 2 possible keys: data, style.
        Data is a list of graph data describing what will be rendered in the widget.
        Style is a dict describing how the graphs will be rendered.

        Follows the TLoadFormat interface defined in Motif's types.ts:
        https://github.com/cylynx/motif.gl/blob/master/packages/motif/src/redux/graph/types.ts#L283 
    """

    # widget boilerplate: specify which front-end model / view to associate with
    _model_name = Unicode('MotifModel').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)

    _view_name = Unicode('MotifView').tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)

    # variable with defaults that sync with JS side.
    state = Dict({ C.DATA: [], C.STYLE: {} }).tag(sync=True)


    def __init__(self, **kwargs):
        """
        ------------
         Parameters
        ------------
        All parameters are optional.
        Only one graph import (json_path, nx_graph, neo4j_graph, or csv_path) can be passed each time.

        json_path: str
            Path to a local JSON file containing the graph data.
            If this is used, all other params will be ignored.

        nx_graph: nx.Graph
            A networkx graph to be rendered

        neo4j_graph: neo4j.graph.Graph
            A neo4j graph to be rendered, obtained from the neo4j.Result.graph() method.
            Ref: https://neo4j.com/docs/api/python-driver/current/api.html#graph

        csv_path: str
            Path to a local CSV edgelist file

        style: dict
            The rendered graph's style. Its format depends on Motif's StyleOptions interface:
            https://github.com/cylynx/motif.gl/blob/c79ba6549407979a4ec0214cc6c7c7d0f2a3be41/packages/motif/src/redux/graph/types.ts#L206

        title: str
            The rendered graph's title
        """
        super().__init__()

        if kwargs:
            self.state = self._prep_import(**kwargs)
            self._update_state()


    def add_graph(self, **kwargs):
        """
        Adds another graph to an existing Motif widget.
        Takes the same parameters as __init__.
        If provided, graph settings here will overwrite those set previously (e.g. style).
        """
        graph = self._prep_import(**kwargs)

        self.state[C.DATA] += graph[C.DATA]
        self.state[C.STYLE] = graph.get(C.STYLE, self.state[C.STYLE])

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
            self.state[C.STYLE] = style
        else:
            self.state[C.STYLE].update(style)

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
        IMPORTS = { C.JSON_PATH, C.NX_GRAPH, C.NEO4J_GRAPH, C.CSV_PATH }

        # if required, check that only 1 import type is passed
        if require_import and len(set(kwargs) & IMPORTS) != 1:
            raise KeyError(f'Pass 1 import type parameter: nx_graph, neo4j_graph, json_path, or csv_path.')

        for k, v in kwargs.items():
            # check for accepted params
            if k not in C.ALLOWED:
                raise KeyError(f'{k} is not an accepted parameter')

            # check types
            if not isinstance(v, C.ALLOWED[k]):
                raise TypeError(f'{k} must be of type {C.ALLOWED[k]}')
            
            # param-specific checks
            if k == C.JSON_PATH:
                if not v.endswith('.json'):
                    raise ValueError(f'{k} should end with .json')

            if k == C.CSV_PATH:
                if not v.endswith('.csv'):
                    raise ValueError(f'{k} should end with .csv')
            
            if k == C.TITLE and not v:
                raise ValueError(f'{k} should not be an empty string')


    def _prep_import(self, **kwargs) -> dict:
        """ 
        Based on kwargs passed, prepares graph data from various formats
        to be imported into the Motif widget.

        Actual import is done elsewhere by adding the returned dict
        to self.state.

        Returns a dict which contains the graph to import.
        """
        self._validate(require_import=True, **kwargs)

        # a JSON file will be directly set as the graph to import
        if C.JSON_PATH in kwargs:
            print('Reading JSON file, all other params will be ignored...')
            json_path = kwargs[C.JSON_PATH]
            
            with open(json_path, 'r') as json_data:
                graph = json.load(json_data)

        # other formats require pre-processing
        else:
            motif_graph = {}
            style = kwargs.get(C.STYLE, {})

            if C.NX_GRAPH in kwargs:
                nx_graph = kwargs[C.NX_GRAPH]
                motif_graph = self._nx_to_motif(nx_graph)  
            
            if C.NEO4J_GRAPH in kwargs:
                neo4j_graph = kwargs[C.NEO4J_GRAPH]
                motif_graph = self._neo4j_to_motif(neo4j_graph)
            
            if C.CSV_PATH in kwargs:
                csv_path = kwargs[C.CSV_PATH]
                motif_graph = self._csv_to_motif(csv_path)

            # add title to data if provided
            if C.TITLE in kwargs:
                metadata_title = { C.TITLE: kwargs[C.TITLE] }
                motif_graph[C.METADATA] = metadata_title

            graph = { C.DATA: [motif_graph], C.STYLE: style }
        
        return graph


    def _nx_to_motif(self, nx_graph: nx.Graph) -> dict:
        """
        Converts an nx_graph into a dict format suitable for plotting in Motif:
        { nodes: [...], edges: [...] }
        """
        self._validate(nx_graph=nx_graph)
        
        # convert nx_graph to cyjs format: (http://manual.graphspace.org/en/latest/GraphSpace_Network_Model.html#cyjs-format)
        try:
            cyjs = nx.readwrite.json_graph.cytoscape_data(nx_graph)
        except:
            raise Exception('Could not convert nx_graph to cyjs format')

        # take relevant parts from cyjs format and add to data
        motif_data = {
            C.NODES: [node[C.DATA] for node in cyjs['elements'][C.NODES]],
            C.EDGES: [edge[C.DATA] for edge in cyjs['elements'][C.EDGES]]
        }

        return motif_data
    

    def _neo4j_to_motif(self, neo4j_graph: neo4j.graph.Graph) -> dict:
        """
        Converts a neo4j_graph into a dict format 
        suitable for plotting in Motif: { nodes: [...], edges: [...] }

        From https://neo4j.com/docs/api/python-driver/current/api.html#graph:
            1) neo4j.graph.Graph only contains nodes and relationships, no paths
            2) neo4j.graph.Graph is still experimental. 
        """
        self._validate(neo4j_graph=neo4j_graph)
        
        def neo4j_to_motif_node(neo4j_node):
            """ Converts a neo4j node to motif node """
            main_properties = {
                'id': f'node-{neo4j_node.id}',
                'labels': next(iter(neo4j_node._labels))    # get only item in frozenset
            }
            
            # merge main props with remaining ones, main props will overwrite
            motif_node = {**neo4j_node._properties, **main_properties}

            return motif_node
        
        def neo4j_to_motif_edge(neo4j_edge):
            """ Converts a neo4j edge to motif edge """
            main_properties = {
                'id': f'edge-{neo4j_edge.id}',
                'source': f'node-{neo4j_edge.start_node.id}',
                'target': f'node-{neo4j_edge.end_node.id}',
                'relationship': neo4j_edge.type,
            }
            
            # merge main props with remaining ones, main props will overwrite
            motif_edge = {**neo4j_edge._properties, **main_properties}

            return motif_edge

        try:
            # https://stackoverflow.com/questions/59289134/constructing-networkx-graph-from-neo4j-query-result
            # https://github.com/neo4j/neo4j-python-driver/blob/4.3/neo4j/graph/__init__.py
            neo4j_nodes = neo4j_graph._nodes.values()
            neo4j_edges = neo4j_graph._relationships.values()
            
            motif_nodes = [neo4j_to_motif_node(n) for n in neo4j_nodes]
            motif_edges = [neo4j_to_motif_edge(e) for e in neo4j_edges]
        except:
            raise Exception('Could not convert neo4j graph')

        motif_data = { C.NODES: motif_nodes, C.EDGES: motif_edges }

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
