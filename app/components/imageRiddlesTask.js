'use strict';
import React, { Component } from 'react';

/**
 * Image Riddles task
 * 
 * Date: 17-04-24
 * @author Josef Vesely
 */
export default class ImageRiddlesTask {

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
    let globalProps     = this._props;
    let backgroundColor = this._props.backgroundColor;
    let borderColor     = this._props.borderColor;
    let icoAnswerOk1    = this._props.icoAnswerOk1;
    let icoAnswerOk2    = this._props.icoAnswerOk2;
    let icoAnswerWrong  = this._props.icoAnswerWrong;
    let textOk          = this._props.textOk;
    let textWrong       = this._props.textWrong;
    let textTryAgain    = this._props.textTryAgain;

    return React.createElement(this._component, { globalProps, taskInfo, backgroundColor,
      borderColor, icoAnswerOk1, icoAnswerOk2, icoAnswerWrong,  textOk, textWrong, textTryAgain });
  }

  /**
   * 
   * @param {*} answerIndex 
   * @returns
   */
  _evaluate(answerIndex) {
    return (answerIndex === this._jsonData[this._taskIndex].okIndex);
  }
}