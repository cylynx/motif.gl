import neo4j
import networkx as nx

NX_GRAPH = 'nx_graph'
NEO4J_GRAPH = 'neo4j_graph'
JSON_PATH = 'json_path'
CSV_PATH = 'csv_path'
STYLE = 'style'
TITLE = 'title'

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
}