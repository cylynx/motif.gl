
# motif

[![Build Status](https://travis-ci.org/Cylynx/motif.svg?branch=master)](https://travis-ci.org/Cylynx/motif)
[![codecov](https://codecov.io/gh/Cylynx/motif/branch/master/graph/badge.svg)](https://codecov.io/gh/Cylynx/motif)

Jupyter widget bindings for the motif library

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
python -m pip install -e .
```

If you are using JupyterLab:

```
# install the widget manager to display the widgets in JupyterLab
jupyter labextension install @jupyter-widgets/jupyterlab-manager --no-build

# install the local extension
jupyter labextension install .
```

If you are using the Classic Notebook:

```
jupyter nbextension install --sys-prefix --symlink --overwrite --py motif
jupyter nbextension enable --sys-prefix --py motif
```

Installing the js dependencies:

```
npm install
```

To continuously monitor the project for changes and automatically trigger a rebuild, start Jupyter in watch mode:

```
jupyter lab --watch
```

And in a separate session, begin watching the source directory for changes:

```
npm run start
```

After a change wait for the build to finish and then refresh your browser and the changes should take effect.  

If you make a change to the python code then you will need to restart the notebook kernel to have it take effect.

A demo notebook file can be found at `examples/introduction.ipynb`


## Installation

You can install using `pip`:

```
pip install motif
```

Or if you use jupyterlab:

```
pip install motif
jupyter labextension install @jupyter-widgets/jupyterlab-manager
```

If you are using Jupyter Notebook 5.2 or earlier, you may also need to enable
the nbextension:
```
jupyter nbextension enable --py [--sys-prefix|--user|--system] motif
```
