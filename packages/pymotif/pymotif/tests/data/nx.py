import networkx as nx
from ..constants import NODE_0, NODE_1

# manually create a networkx test object
def create_nx_test_graph() -> nx.Graph:
    graph = nx.Graph()
    graph.add_edges_from([(NODE_0, NODE_1)])

    return graph
