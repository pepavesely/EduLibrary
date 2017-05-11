'use strict';
import React, { Component } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';

@observer
export default class DragDropTask extends Component {

  _draggables = [];
  _droppables = [];

  constructor(props) {
    super(props);

    this.state = {
      style: View.propTypes.style,
    };
  }
   
  render() {
    return (
      <View style={this.props.style}>{this.props.children}</View>
    );
  }

  _initDraggables(draggables, droppables) {
    this._draggables = draggables;
    this._droppables = droppables;

    this.props.taskStore.loadStates().then((state) => {
      if (state && this.props.taskStore.getState(0) !== undefined) {
        let i = 0;
        for (var draggableKey in this._draggables) {
          var draggable = this._draggables[draggableKey];

          draggable._moveToPosition(this.props.taskStore.getState(i).x, this.props.taskStore.getState(i).y);
          draggable._setDisabled(true);
          i++;
        }
      }
    }).catch(function(error) {
      console.log("Error: " + error.message);
    });
  }

  _evaluate() {
    var taskState = true;

    // kontrola, zda jsou vsechny draggables na spravnem miste
    for (var draggableKey in this._draggables) {
      var draggable = this._draggables[draggableKey];

      if (!draggable._getState()) {
        taskState = false;
        draggable._moveToBasePosition();
      }
    }

    // kontrola, zda jsou obsazeny vsechny droppables, ktere maji byt
    if (taskState) {
      for (var droppableKey in this._droppables) {
        var droppable = this._droppables[droppableKey];
        if (droppable._isOccupied() <= 0 && !droppable._isDeceptive()) {
          taskState = false;
          break;
        }
      }
    }

    if (taskState) {
      this._savePositions();
    }

    return taskState;
  }

  _savePositions() {
    let i = 0;
    for (var draggableKey in this._draggables) {
      var draggable = this._draggables[draggableKey];
      var pos = draggable._getPosition().pan;

      this.props.taskStore.setState(i++, {x: pos.x._value, y: pos.y._value});
    }
  }
}