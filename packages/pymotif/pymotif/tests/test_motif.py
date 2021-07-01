#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Cylynx.
# Distributed under the terms of the Modified BSD License.

import json

from ..motif import Motif
from .. import constants as C
from . import constants as TC
from .data.neo4j import create_neo4j_test_graph
from .data.nx import create_nx_test_graph


def test_initial_empty_state():
    ''' Data and style should be empty when nothing is passed '''
    motif = Motif()

    assert motif.state == { C.DATA: [], C.STYLE: {} }


def test_json_import():
    ''' JSON test file '''
    motif = Motif(json_path=TC.TEST_JSON_PATH)

    with open(TC.TEST_JSON_PATH, 'r') as f:
        test_json_graph = json.load(f)
    
    assert motif.state[C.DATA] == test_json_graph[C.DATA]


def test_2_col_csv_import():
    ''' CSV test file that only has 'source' and 'target' cols '''
    motif = Motif(csv_path=TC.TEST_2_COLS_CSV_PATH)
    motif_graph_list = motif.state[C.DATA]

    # only 1 graph, which has expected test structure
    assert len(motif_graph_list) == 1
    assert _motif_graph_has_expected_test_structure(motif_graph_list[0])


def test_gt_2_col_csv_import():
    ''' CSV test file that has cols other than 'source' and 'target' '''
    motif = Motif(csv_path=TC.TEST_GT_2_COLS_CSV_PATH)
    motif_graph_list = motif.state[C.DATA]

    # only 1 graph, which has expected test structure
    assert len(motif_graph_list) == 1
    assert _motif_graph_has_expected_test_structure(motif_graph_list[0])


def test_nx_import():
    ''' NetworkX test graph '''
    motif = Motif(nx_graph=create_nx_test_graph())
    motif_graph_list = motif.state[C.DATA]

    # only 1 graph, which has expected test structure
    assert len(motif_graph_list) == 1
    assert _motif_graph_has_expected_test_structure(motif_graph_list[0])


def test_neo4j_import():
    ''' Neo4j test graph '''
    motif = Motif(neo4j_graph=create_neo4j_test_graph())
    motif_graph_list = motif.state[C.DATA]

    # only 1 graph, which has expected test structure
    assert len(motif_graph_list) == 1
    assert _motif_graph_has_expected_test_structure(motif_graph_list[0])


def test_import_style():
    ''' Set styles upon import  '''
    motif = Motif(csv_path=TC.TEST_2_COLS_CSV_PATH, style=TC.TEST_STYLE_0)

    assert motif.state[C.STYLE] == TC.TEST_STYLE_0


def test_import_title():
    ''' Set title upon import '''
    motif = Motif(csv_path=TC.TEST_2_COLS_CSV_PATH, title=TC.TEST_TITLE)
    motif_graph = motif.state[C.DATA][0]

    assert motif_graph['metadata']['title'] == TC.TEST_TITLE


def test_add_graph():
    ''' Adding a new graph to an existing one '''
    motif = Motif(csv_path=TC.TEST_GT_2_COLS_CSV_PATH)
    motif.add_graph(nx_graph=create_nx_test_graph())
    motif_graph_list = motif.state[C.DATA]

    # 2 graphs, both of which have expected test structure
    assert len(motif_graph_list) == 2

    for motif_graph in motif_graph_list:
        assert _motif_graph_has_expected_test_structure(motif_graph)


def test_add_graph_style_overwrites_old_style():
    ''' New style passed when adding graph overwrites old style '''
    motif = Motif(csv_path=TC.TEST_GT_2_COLS_CSV_PATH, style=TC.TEST_STYLE_0)
    motif.add_graph(nx_graph=create_nx_test_graph(), style=TC.TEST_STYLE_1)

    assert motif.state[C.STYLE] == TC.TEST_STYLE_1


def test_set_style_with_overwrite():
    ''' Set style of an existing graph, overwriting old style '''
    motif = Motif(csv_path=TC.TEST_GT_2_COLS_CSV_PATH, style=TC.TEST_STYLE_0)
    motif.set_style(style=TC.TEST_STYLE_1, overwrite=True)

    assert motif.state[C.STYLE] == TC.TEST_STYLE_1


def test_set_style_without_overwrite():
    ''' Set style of an existing graph, merging with old styles '''
    motif = Motif(csv_path=TC.TEST_GT_2_COLS_CSV_PATH, style=TC.TEST_STYLE_0)
    motif.set_style(style=TC.TEST_STYLE_1, overwrite=False)
    merged_style = {**TC.TEST_STYLE_0, **TC.TEST_STYLE_1}

    assert motif.state[C.STYLE] == merged_style


def _motif_graph_has_expected_test_structure(motif_graph: Motif) -> bool:
    ''' 
    Checks that a motif graph has the expected test structure:
        - 2 nodes that have at least an 'id' key
        - 1 edge that has at least a 'source' and 'target' col with the 2 nodes above
    '''

    nodes = motif_graph[C.NODES]
    edges = motif_graph[C.EDGES]

    assert len(nodes) == 2
    assert len(edges) == 1

    assert nodes[0]['id'] == TC.NODE_0
    assert nodes[1]['id'] == TC.NODE_1
    
    assert edges[0]['source'] == TC.NODE_0
    assert edges[0]['target'] == TC.NODE_1

    return True