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
    """ Data and style should be empty when nothing is passed """
    motif = Motif()

    assert motif.state == { C.DATA: [], C.STYLE: {} }


def test_json_import():
    """ JSON test file """
    motif = Motif(json_path=TC.TEST_JSON_PATH)

    with open(TC.TEST_JSON_PATH, 'r') as f:
        test_json_graph = json.load(f)
    
    assert motif.state[C.DATA] == test_json_graph[C.DATA]


def test_2_col_csv_import():
    """ CSV test file that only has 'source' and 'target' cols """
    motif = Motif(csv_path=TC.TEST_2_COLS_CSV_PATH)

    assert _motif_obj_has_expected_test_structure(motif)


def test_gt_2_col_csv_import():
    """ CSV test file that has cols other than 'source' and 'target' """
    motif = Motif(csv_path=TC.TEST_GT_2_COLS_CSV_PATH)

    assert _motif_obj_has_expected_test_structure(motif)


def test_nx_import():
    """ NetworkX test graph """
    motif = Motif(nx_graph=create_nx_test_graph())

    assert _motif_obj_has_expected_test_structure(motif)


def test_neo4j_import():
    """ Neo4j test graph """
    motif = Motif(neo4j_graph=create_neo4j_test_graph())

    assert _motif_obj_has_expected_test_structure(motif)


def test_import_style():
    """  """
    # TODO


def test_import_title():
    """  """
    # TODO


def test_add_graph():
    """  """
    # TODO


def test_set_style():
    """  """
    # TODO


def _motif_obj_has_expected_test_structure(motif_obj: Motif) -> bool:
    """ 
    Checks that a motif class instance has the expected test structure:
        - only 1 graph
        - graph has 2 nodes that have at least an 'id' key
        - graph has 1 edge that has at least a 'source' and 'target' col with the 2 nodes above
    """
    # extract list of graphs
    motif_graph_list = motif_obj.state[C.DATA]

    assert len(motif_graph_list) == 1

    nodes = motif_graph_list[0][C.NODES]
    edges = motif_graph_list[0][C.EDGES]

    assert len(nodes) == 2
    assert len(edges) == 1

    assert nodes[0]['id'] == TC.NODE_0
    assert nodes[1]['id'] == TC.NODE_1
    
    assert edges[0]['source'] == TC.NODE_0
    assert edges[0]['target'] == TC.NODE_1

    return True