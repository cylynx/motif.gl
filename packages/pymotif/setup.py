#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Jupyter Development Team.
# Distributed under the terms of the Modified BSD License.

from __future__ import print_function
from glob import glob
import os
from os.path import join as pjoin
from setuptools import setup, find_packages


from jupyter_packaging import (
    create_cmdclass,
    # install_npm,
    ensure_targets,
    combine_commands,
    get_version,
)

HERE = os.path.dirname(os.path.abspath(__file__))




# The name of the project
name = 'pymotif'

# Get the version
version = get_version(pjoin(name, '_version.py'))


# Representative files that should exist after a successful build
jstargets = [
    pjoin(HERE, name, 'nbextension', 'index.js'),
    pjoin(HERE, 'lib', 'plugin.js'),
]


package_data_spec = {
    name: [
        'nbextension/**js*',
        'labextension/**'
    ]
}


data_files_spec = [
    ('share/jupyter/nbextensions/pymotif', 'pymotif/nbextension', '**'),
    ('share/jupyter/labextensions/@cylynx/pymotif', 'pymotif/labextension', '**'),
    ('share/jupyter/labextensions/@cylynx/pymotif', '.', 'install.json'),
    ('etc/jupyter/nbconfig/notebook.d', '.', 'pymotif.json'),
]


cmdclass = create_cmdclass('jsdeps', package_data_spec=package_data_spec,
    data_files_spec=data_files_spec)
cmdclass['jsdeps'] = combine_commands(
    # Please build seperately at the root of the monorepo before running setup.py
    # install_npm(HERE, build_cmd='build:prod'),
    ensure_targets(jstargets),
)


setup_args = dict(
    name            = name,
    description     = 'jupyter widget bindings for the motif library',
    version         = version,
    scripts         = glob(pjoin('scripts', '*')),
    cmdclass        = cmdclass,
    packages        = find_packages(),
    author          = 'Cylynx',
    author_email    = 'hello@cylynx.io',
    url             = 'https://github.com/Cylynx/motif.gl',
    license         = 'BSD',
    platforms       = "Linux, Mac OS X, Windows",
    keywords        = ['Jupyter', 'Widgets', 'IPython'],
    classifiers     = [
        'Intended Audience :: Developers',
        'Intended Audience :: Science/Research',
        'License :: OSI Approved :: BSD License',
        'Programming Language :: Python',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: 3.7',
        'Framework :: Jupyter',
    ],
    include_package_data = True,
    python_requires=">=3.6",
    install_requires = [
        'ipywidgets>=7.0.0',
        'pandas>=1.2.4',
        'networkx>=2.5.1',
        'neo4j>=4.3.1'
    ],
    extras_require = {
        'test': [
            'pytest>=4.6',
            'pytest-cov',
            'nbval',
        ],
        'examples': [
            # Any requirements for the examples to run
        ],
        'docs': [
            'jupyter_sphinx',
            'nbsphinx',
            'nbsphinx-link',
            'pytest_check_links',
            'pypandoc',
            'recommonmark',
            'sphinx>=1.5',
            'sphinx_rtd_theme',
        ],
    },
    entry_points = {
    },
)

if __name__ == '__main__':
    setup(**setup_args)
