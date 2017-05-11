'use strict';
import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';

import Responsive from '../utils/responsive';

export default class ClickInfoTask extends Component {

  _states = {};
  _clickInfoViews = undefined;

  _bigImages = undefined;
  _texts = undefined;

  constructor(props) {
    super(props);

    this.state = {
      style: View.propTypes.style,
    };
  }

  render() {
    return (
      <View style={this.props.style}>
        {this.props.children}
      </View>
    );
  }

  _initViews(clickInfoViews, texts, bigImages, notCompleted) {
    this._clickInfoViews = clickInfoViews;
    this._texts = texts;
    this._bigImages = bigImages;

    var firstElemDone = false;
    for(var key in clickInfoViews) {
      this._states[key] = false;

      if (notCompleted && this.props.isProgressive && firstElemDone) {
        var clickInfo = clickInfoViews[key];
        clickInfo._setDisabled(true);
      }

      firstElemDone = true;
    }
  }

  _clickImage(key) {
    if (this.props.setCoverImage !== undefined) {
      this.props.setCoverImage(this._bigImages[key], true, this._texts[key]);
    }
    this._states[key] = true;
    this._evaluate();
  }

  _clickInfo(key) {
    this._states[key] = true;
    this._evaluate();
  }

  _evaluate() {
    var taskState = true;
    var enableNextElem = false;

    for (var key in this._states) {
      var clickInfo = this._clickInfoViews[key];
      var state = this._states[key];

      if (!state) {
        taskState = false;
        if(enableNextElem && clickInfo._isDisabled()) {
          clickInfo._setDisabled(false);
          break;
        }
        enableNextElem = false;
      } else {
        enableNextElem = this.props.isProgressive && state;
      }
    }

    if (taskState && this.props.taskDoneFunction !== undefined) {
      this.props.taskDoneFunction();
    }

  }
}

ClickInfoTask.PropTypes = {
  taskDoneFunction: PropTypes.func,
  setCoverImage: PropTypes.func,
  isProgressive: PropTypes.bool
};