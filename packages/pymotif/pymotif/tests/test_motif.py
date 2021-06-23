#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Cylynx.
# Distributed under the terms of the Modified BSD License.

import json
import networkx as nx

from ..motif import Motif
from .. import constants as C

# test objects
TEST_JSON_PATH = 'objects/test.json'
TEST_CSV_PATH = 'objects/test.csv'
NODE_0 = 'node-0'
NODE_1 = 'node-1'


def p(obj):
    """ Function to print. Pytest only prints when an error is raised """
    print(obj)
    assert False


def test_initial_empty_state():
    """ Data and style should be empty when nothing is passed """
    m = Motif()
    assert m.state == { C.DATA: [], C.STYLE: {} }


def test_json_import():
    """ Motif state should match JSON test file """
    motif = Motif(json_path=TEST_JSON_PATH)

    with open(TEST_JSON_PATH, 'r') as f:
        test_json_graph = json.load(f)
    
    assert motif.state[C.DATA] == test_json_graph[C.DATA]


def test_csv_import():
    """ Motif state should match CSV test file """
    motif = Motif(csv_path=TEST_CSV_PATH)

    # expect 1 graph with 2 nodes and 1 edge
    motif_graph_list = motif.state[C.DATA]

    assert len(motif_graph_list) == 1

    nodes = motif_graph_list[0][C.NODES]
    edges = motif_graph_list[0][C.EDGES]

    assert len(nodes) == 2
    assert len(edges) == 1

    assert nodes[0]['id'] == NODE_0
    assert nodes[1]['id'] == NODE_1
    
    assert edges[0]['source'] == NODE_0
    assert edges[0]['target'] == NODE_1
    assert edges[0]['relation'] == 'points_to'


def test_nx_import():
    """ Motif state should match imported networkx graph """
    # build a simple networkx graph
    G = nx.Graph()
    G.add_edges_from([(NODE_0, NODE_1)])

    assert list(G.nodes) == [NODE_0, NODE_1]
    assert list(G.edges) == [(NODE_0, NODE_1)]

    # import into motif
    motif = Motif(nx_graph=G)

    # expect 1 graph with 2 nodes and 1 edge
    motif_graph_list = motif.state[C.DATA]

    assert len(motif_graph_list) == 1

    nodes = motif_graph_list[0][C.NODES]
    edges = motif_graph_list[0][C.EDGES]

    assert len(nodes) == 2
    assert len(edges) == 1

    assert nodes[0]['id'] == NODE_0
    assert nodes[1]['id'] == NODE_1
    
    assert edges[0]['source'] == NODE_0
    assert edges[0]['target'] == NODE_1




