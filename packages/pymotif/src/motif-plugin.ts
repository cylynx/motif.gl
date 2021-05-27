// Copyright (c) Cylynx
// Distributed under the terms of the Modified BSD License.

// Defines Python <-> JS interactions in Jupyter Notebook

import {
  DOMWidgetModel,
  DOMWidgetView,
  ISerializers,
} from '@jupyter-widgets/base';
import { EnhancedStore } from '@reduxjs/toolkit';

import {
  GraphThunks,
  WidgetSlices,
  UISlices,
  JsonImport,
  TLoadFormat,
  GraphSelectors,
} from '@cylynx/motif';
import renderRoot from './render-root';
import createStore from './redux-store';
import { MODULE_NAME, MODULE_VERSION } from './version';

// handles communication with Python
export class MotifModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: MotifModel.model_name,
      _model_module: MotifModel.model_module,
      _model_module_version: MotifModel.model_module_version,
      _view_name: MotifModel.view_name,
      _view_module: MotifModel.view_module,
      _view_module_version: MotifModel.view_module_version,

      state: {},
    };
  }

  static serializers: ISerializers = {
    ...DOMWidgetModel.serializers,
    // Add any extra serializers here
  };

  static model_name = 'MotifModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'MotifView'; // Set to null if no view
  static view_module = MODULE_NAME; // Set to null if no view
  static view_module_version = MODULE_VERSION;
}

const DOM_EL_ID = 'motif';
let counter = 0;

// handles widget rendering
export class MotifView extends DOMWidgetView {
  id: string;
  btn: HTMLElement;
  div: HTMLDivElement;
  graphRef: any;
  store: EnhancedStore;

  render() {
    // inits
    this.el.classList.add('jupyter-widgets');
    this.el.classList.add('motif-jupyter-widgets');

    this.div = this.createDiv();
    this.btn = this.createBtn();
    this.store = createStore();

    // render
    renderRoot(this.div, this.store, this.onRefChange);

    // update redux store based on data from Python model
    this.updateStore();

    // listener to save state to model once button is clicked
    this.btn.onclick = this.saveState.bind(this);
  }

  onRefChange(ref: any): void {
    this.graphRef = ref;
    const widget = { key: 'main', id: 'layers' };
    // quick fix solution to force graph to repaint correctly after ref is obtained and data is loaded
    setTimeout(() => {
      this.store.dispatch(WidgetSlices.updateWidget(widget));
      this.store.dispatch(WidgetSlices.updateWidget(widget));
      this.graphRef.graph.fitView(10);
    }, 0);
  }

  // div to hold the view
  private createDiv(): HTMLDivElement {
    this.id = `${DOM_EL_ID}-${counter}`;
    counter++;
    this.onRefChange = this.onRefChange.bind(this);

    const div = document.createElement('div');
    div.setAttribute('id', this.id);
    div.classList.add('motif');
    this.el.appendChild(div);

    return div;
  }

  // btn to save state and style from the view
  private createBtn(): HTMLElement {
    const btn = document.createElement('BUTTON');
    btn.innerHTML = 'SAVE DATA AND STYLE';
    btn.setAttribute(
      'style',
      'position: absolute; bottom: 0px; left: 40%; color: white; background-color: #252b35',
    );
    this.el.appendChild(btn);

    return btn;
  }

  // update redux store based on 'state' from Python model anytime 'state' changes
  private updateStore(): void {
    const state: TLoadFormat = this.model.get('state');
    const group_edges: boolean = this.model.get('group_edges');

    if (Array.isArray(state.data) && state.data.length) {
      const action: any = GraphThunks.importJsonData(
        [state as JsonImport],
        group_edges,
        null,
        true,
      );
      this.store.dispatch(action);
    }

    this.store.dispatch(WidgetSlices.setWidget([]));
    this.store.dispatch(UISlices.closeModal());
  }

  // gets current front-end store state and saves it to Python model
  private saveState(): void {
    const currState = this.store.getState();
    const graphList = GraphSelectors.getGraphList(currState);
    const styleOptions = GraphSelectors.getStyleOptions(currState);

    // save to Python model
    this.model.set('state', { data: graphList, style: styleOptions });
    this.model.save_changes();
  }
}
