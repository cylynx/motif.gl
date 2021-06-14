# motif

Jupyter widget bindings for the motif library

## Installation

You can install using `pip`:

```
pip install pymotif
```

Note: You might need to enable labextension first: `jupyter labextension install @jupyter-widgets/jupyterlab-manager`
If you are using Jupyter Lab <= 2, you might need to install the extension manually: `jupyter labextension install @cylynx/pymotif` or through the extension manager

If you are using Jupyter Notebook 5.2 or earlier, you may also need to enable
the nbextension:

```
jupyter nbextension enable --py [--sys-prefix|--user|--system] pymotif
```

## Try

Demo notebooks can be found in the `examples` folder.

Sample code:

```
from pymotif import Motif
import networkx as nx

gml1 = 'karate.gml'
g1 = nx.read_gml(gml1)
motif = Motif(nx_graph=g1, title='karate')
motif.plot()
```

More documentation coming soon...

## Development

For a more thorough walkthrough check out the official guide:  
https://ipywidgets.readthedocs.io/en/latest/examples/Widget%20Custom.html

### Create a new conda environment with the dependencies

To create the environment, execute the following command:

```
conda create -n motif -c conda-forge jupyterlab nodejs python
```

Then activate the environment with:

```
conda activate motif
```

### Build and install the widget for development

Since the widget contains a Python part, you need to install the package in editable mode:

```
npm run pymotif:build // In root directory to link it with monorepo setup
python -m pip install -e .
```

Install required Python packages:

```
python -m pip install -r requirements.txt
```

If you are using JupyterLab:

```
jupyter labextension develop --overwrite .
```

If you are using the Classic Notebook:

```
jupyter nbextension install --sys-prefix --symlink --overwrite --py pymotif
jupyter nbextension enable --sys-prefix --py pymotif
```

To continuously monitor the project for changes and automatically trigger a rebuild, start Jupyter in watch mode:

```
jupyter lab --watch
```

And in a separate session, begin watching the source directory for changes:

```
npm run pymotif  // In root directory to link it with monorepo setup
```

After a change wait for the build to finish and then refresh your browser and the changes should take effect.

If you make a change to the python code then you will need to restart the notebook kernel to have it take effect.

### Publishing

1. Update the version in package.json
2. Relase the `@cylynx/pymotif` packages:

```
npm login
npm run pymotif:publish
```

3. Bundle the python package: `python setup.py sdist bdist_wheel`
4. Update the version in `pymotif/_version.py`
5. If frontend version dependency has changed, update `pymotif/_frontend.py`
6. Publish the package to PyPI:

```
pip install twine
twine upload dist/pymotif*
```
