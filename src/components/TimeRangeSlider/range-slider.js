import React, { Component, createRef } from 'react';
import { createSelector } from 'reselect';
import styled from 'styled-components';
import { Input } from './styled-components';

import { roundValToStep } from './data-utils';
import Slider from './slider/slider';
import RangePlot from './range-plot';

const SliderInput = styled(Input)`
  width: ${props => props.theme.sliderInputWidth}px;
  margin-left: ${props =>
    props.flush ? 0 : props.size === 'tiny' ? 12 : 18}px;
`;

const SliderWrapper = styled.div`
  display: flex;
  position: relative;
  align-items: center;
`;

const RangeInputWrapper = styled.div`
  margin-top: 6px;
  display: flex;
  justify-content: space-between;
`;

// RangeSliderFactory.deps = [RangePlotFactory];

export default class RangeSlider extends Component {
  static defaultProps = {
    isEnlarged: false,
    isRanged: true,
    showInput: true,
    sliderHandleWidth: 12,
    inputTheme: '',
    inputSize: 'small',
    onChange: () => {},
  };

  static getDerivedStateFromProps(props, state) {
    let update = null;
    const { value0, value1 } = props;
    if (props.value0 !== state.prevValue0 && !isNaN(value0)) {
      update = { ...(update || {}), value0, prevValue0: value0 };
    }
    if (props.value1 !== state.prevValue1 && !isNaN(value1)) {
      update = { ...(update || {}), value1, prevValue1: value1 };
    }
    return update;
  }

  state = {
    value0: 0,
    value1: 1,
    prevValue0: 0,
    prevValue1: 1,
    width: 288,
  };

  componentDidMount() {
    this._resize();
  }

  componentDidUpdate(prevProps, prevState) {
    this._resize();
  }

  sliderContainer = createRef();

  inputValue0 = createRef();

  inputValue1 = createRef();

  value0Selector = props => props.value0;

  value1Selector = props => props.value1;

  filterValueSelector = createSelector(
    this.value0Selector,
    this.value1Selector,
    (value0, value1) => [value0, value1]
  );

  _isVal0InRange = val => {
    const { value1, range } = this.props;

    return Boolean(val >= range[0] && val <= value1);
  };

  _isVal1InRange = val => {
    const { range, value0 } = this.props;

    return Boolean(val <= range[1] && val >= value0);
  };

  _roundValToStep = val => {
    const { range, step } = this.props;

    return roundValToStep(range[0], step, val);
  };

  _setRangeVal1 = val => {
    const { value0, onChange } = this.props;
    const val1 = Number(val);
    if (this._isVal1InRange(val1)) {
      onChange([value0, this._roundValToStep(val1)]);
      return true;
    }
    return false;
  };

  _setRangeVal0 = val => {
    const { value1, onChange } = this.props;
    const val0 = Number(val);

    if (this._isVal0InRange(val0)) {
      onChange([this._roundValToStep(val0), value1]);
      return true;
    }
    return false;
  };

  _resize() {
    const width = this.sliderContainer.current.offsetWidth;
    if (width !== this.state.width) {
      this.setState({ width });
    }
  }

  _onChangeInput = (key, e) => {
    this.setState({ [key]: e.target.value });
  };

  _renderInput(key) {
    const setRange = key === 'value0' ? this._setRangeVal0 : this._setRangeVal1;
    const ref = key === 'value0' ? this.inputValue0 : this.inputValue1;
    const update = e => {
      if (!setRange(e.target.value)) {
        this.setState({ [key]: this.state[key] });
      }
    };

    const onChange = this._onChangeInput.bind(this, key);

    return (
      <SliderInput
        className="kg-range-slider__input"
        type="number"
        ref={ref}
        id={`slider-input-${key}`}
        key={key}
        value={this.state[key]}
        onChange={onChange}
        onKeyPress={e => {
          if (e.key === 'Enter') {
            update(e);
            ref.current.blur();
          }
        }}
        onBlur={update}
        flush={key === 'value0'}
        size={this.props.inputSize}
        secondary={this.props.inputTheme === 'secondary'}
      />
    );
  }

  render() {
    const {
      isRanged,
      showInput,
      histogram,
      range,
      onChange,
      sliderHandleWidth,
      step,
    } = this.props;

    const height = isRanged && showInput ? '16px' : '24px';
    const { width } = this.state;
    const plotWidth = Math.max(width - sliderHandleWidth, 0);

    return (
      <div
        className="kg-range-slider"
        style={{ width: '100%', padding: `0 ${sliderHandleWidth / 2}px` }}
        ref={this.sliderContainer}
      >
        {histogram && histogram.length ? (
          <RangePlot
            histogram={histogram}
            lineChart={this.props.lineChart}
            plotType={this.props.plotType}
            isEnlarged={this.props.isEnlarged}
            onBrush={(val0, val1) => onChange([val0, val1])}
            marks={this.props.marks}
            range={range}
            value={this.filterValueSelector(this.props)}
            width={plotWidth}
            isRanged={isRanged}
            step={step}
          />
        ) : null}
        <SliderWrapper style={{ height }} className="kg-range-slider__slider">
          {this.props.xAxis ? (
            <this.props.xAxis width={plotWidth} domain={range} />
          ) : null}
          <Slider
            marks={this.props.marks}
            showValues={false}
            isRanged={isRanged}
            minValue={range[0]}
            maxValue={range[1]}
            value0={this.props.value0}
            value1={this.props.value1}
            step={step}
            handleWidth={sliderHandleWidth}
            onSlider0Change={this._setRangeVal0}
            onSlider1Change={this._setRangeVal1}
            onSliderBarChange={(val0, val1) => {
              onChange([val0, val1]);
            }}
            enableBarDrag
          />

          {!isRanged && showInput ? this._renderInput('value1') : null}
        </SliderWrapper>
        {isRanged && showInput ? (
          <RangeInputWrapper className="range-slider__input-group">
            {this._renderInput('value0')}
            {this._renderInput('value1')}
          </RangeInputWrapper>
        ) : null}
      </div>
    );
  }
}
