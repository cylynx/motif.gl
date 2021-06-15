import neo4j
import networkx as nx

from ipywidgets import Layout

# determines how the widget is displayed in the cell
DISPLAY = Layout(width='100%', height='600px')

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