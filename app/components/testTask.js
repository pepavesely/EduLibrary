'use strict';
import React, { Component } from 'react';

/**
 * Test task
 * 
 * Date: 17-04-26
 * @author Josef Vesely
 */
export default class TestTask {

  /** */
  _jsonData = undefined;

  /**  */
  _component = undefined;

  /**  */
  _props = undefined;  

  /** */
  _taskIndex = 0;

  /**
   * 
   * @param {*} jsonData 
   * @param {*} component 
   * @constructor
   */
  constructor(jsonData, component, props) {
    this._jsonData = jsonData;
    this._component = component;
    this._props = props;
  }

  /**
   * 
   * @param {*} taskIndex 
   */
  _renderView(taskIndex) {
    this._taskIndex = taskIndex;
    let jsonData = this._jsonData[this._taskIndex];
    
    let taskInfo = {
      data: jsonData,
      evaluateFunction: this._evaluate.bind(this)
    };
    let globalProps = this._props;

    let underlineColorAndroid = this._props.underlineColorAndroid;
    let selectionColor  = this._props.selectionColor;
    let textcolor       = this._props.textcolor;
    let borderColor     = this._props.borderColor;
    let textOk          = this._props.textOk;
    let textWrong       = this._props.textWrong;
    let textTryAgain    = this._props.textTryAgain;
    let icoAnswerOk1    = this._props.icoAnswerOk1;
    let icoAnswerWrong  = this._props.icoAnswerWrong;

    return React.createElement(this._component, { globalProps, taskInfo, underlineColorAndroid,
      selectionColor, textcolor, borderColor, textOk, textWrong, textTryAgain, icoAnswerOk1, icoAnswerWrong });
  }

  /**
   * 
   * @param {*} answer 
   * @returns
   */
  _evaluate(key, answer) {
    let answerArray = this._jsonData[this._taskIndex][key].answers;
    let state = false;

    for (var i=0; i<answerArray.length; i++) {
      if (answer !== undefined) {
        answer = answer.trim();
        answer = answer.toLowerCase();
      }
      if (answerArray[i] === answer) {
        state = true;
        break;
      }
    }

    return state;
  }
}