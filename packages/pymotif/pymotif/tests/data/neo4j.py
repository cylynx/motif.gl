import neo4j
from ..constants import NODE_0, NODE_1

# manually create a neo4j test object that is similar in structure to neo4j.graph.Graph
# https://neo4j.com/docs/api/python-driver/current/api.html#graph
# https://github.com/neo4j/neo4j-python-driver/blob/4.3/neo4j/graph/__init__.py
def create_neo4j_test_graph() -> neo4j.graph.Graph:
    # create graph
    graph = neo4j.graph.Graph()

    # create nodes
    node_0 = neo4j.graph.Node(graph, 0)
    node_1 = neo4j.graph.Node(graph, 1)

    # create edge
    edge_0 = neo4j.graph.Relationship(graph, 0, {})
    edge_0._start_node = node_0
    edge_0._end_node = node_1

    # add nodes and edge to graph
    graph._nodes = { 0: node_0, 1: node_1 }
    graph._relationships = { 0: edge_0 }

    return graph