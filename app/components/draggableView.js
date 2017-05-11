'use strict';
import React, { Component, PropTypes } from 'react';
import {
  AppRegistry, StyleSheet, Text, View, TouchableHighlight,
  PanResponder, // we want to bring in the PanResponder system
  Animated // we wil be using animated value
} from 'react-native';

export default class DraggableView extends Component { 

  _listeners = [];
  _currentDroppable = undefined;
  _taskStates = undefined;

  _initX = 0;
  _initY = 0;

  constructor(props) {
    super(props);
    
    this.state = {
      _pan: new Animated.ValueXY(),
      _baseX: 0,
      _baseY: 0,
      _width: 0,
      _height: 0,
      _halfWidth: 0,
      _halfHeight: 0,
      _onDropState: false,
      _okDrop: [],
      _wrongDrop: [],
    };
  }

  componentWillMount() {
    this._animatedValueX = 0;
    this._animatedValueY = 0;
    this._registerPanResponder();
  }

  componentDidMount() {    
    setTimeout(() => {
      if (this.refs["draggableElement"] !== undefined) {
        this.refs["draggableElement"].measure( (fx, fy, width, height, px, py) => {
          this.setState({
            _baseX: px,
            _baseY: py,
            _width: width,
            _height: height,
            _halfWidth: width / 2,
            _halfHeight: height / 2
          })
        });
      }
    }, 0);
  }

  componentWillUnmount() {
    this._unregisterPanResponder();
  }

  getStyle() {
    return [
      {
        transform: this.state._pan.getTranslateTransform()
      }
    ];
  }

  render() {
    return (
      <Animated.View style={[this.props.style, this.getStyle()]} {...this._panResponder.panHandlers}>
        <View ref="draggableElement" collapsable={false}>
          {this.props.children}
        </View>
      </Animated.View>
    )
  }

  _initOKDroppables(okDroppables) {
    this.setState({ _okDrop: okDroppables });
  }

  _initWrongDroppables(wrongDroppables) {
    this.setState({ _wrongDrop: wrongDroppables });
  }

  _getPosition() {
    return {
      pan: this.state._pan,
      baseX: this.state._baseX,
      baseY: this.state._baseY,
      width: this.state._width,
      height: this.state._height,
      halfWidth: this.state._halfWidth,
      halfHeight: this.state._halfHeight
    }
  }

  _addListener(listener) {
    this._listeners.push(listener);
  }

  _removeListener(listener) {
    let index = this._listeners.indexOf(listener);
    if (index > -1) {
      this._listeners.splice(index, 1);
    }
  }

  _getState() {
    return this.state._onDropState;
  }

  _getPan() {
    return this.state._pan;
  }

  _moveToPosition(xPos, yPos) {
    Animated.spring(
      this.state._pan,
      { toValue: {x:xPos, y:yPos}}
    ).start();
  }

  _moveToBasePosition() {
    Animated.spring(
      this.state._pan,
      { toValue: {x: this._initX, y: this._initY} }
    ).start();
  }
  
  _isOnDroppable(x, y, droppable) {
    return (
      x >= droppable._getPosition().x &&
      x <= droppable._getPosition().x + droppable._getPosition().width &&
      y >= droppable._getPosition().y &&
      y <= droppable._getPosition().y + droppable._getPosition().height
    );
  }

  _centerToDroppable(droppable) {
    if (droppable.props.autocenter !== undefined && droppable.props.autocenter === false) {
      return;
    }

    var xToCenter = this._getXToCenter(droppable) - this.state._baseX;
    var yToCenter = this._getYToCenter(droppable) - this.state._baseY;
    // var yToCenter = droppable._getPosition().centerY - this.state._baseY - this.state._halfHeight;

    Animated.timing(
      this.state._pan,
      { toValue: {x: xToCenter, y: yToCenter}, duration: 100 }
    ).start();
  }

  _getXToCenter(droppable) {
    if (this.props.centerTo === "left") {
      return droppable._getPosition().x;
    } else if (this.props.centerTo === "right") {
      return droppable._getPosition().x +  droppable._getPosition().width - this.state._width;
    } else {
      return droppable._getPosition().centerX - this.state._halfWidth;
    }
  }

  _getYToCenter(droppable) {
    if (this.props.centerTo === "top") {
      return droppable._getPosition().y;
    } else if (this.props.centerTo === "bottom") {
      return droppable._getPosition().y +  droppable._getPosition().height - this.state._height;
    } else {
      return droppable._getPosition().centerY - this.state._halfHeight;
    }
  }

  _setDisabled(isDisabled) {
    if (isDisabled) {
      this._unregisterPanResponder();
    } else {
      this._registerPanResponder();
    }
  }

  _setInitPosition(x, y) {
    this._initX = x;
    this._initY = y;
  }

  _registerPanResponder() {
    this.state._pan.x.addListener((value) => this._animatedValueX = value.value);
    this.state._pan.y.addListener((value) => this._animatedValueY = value.value);

    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: (e, gestureState) => {
        if (this._taskStates !== undefined) {
          this._taskStates.setScrollEnabled(false);
        }

        if (this._currentDroppable !== undefined) {
          this._currentDroppable._setOccupied(false);
          this._currentDroppable = undefined;
        }

        this.state._pan.setOffset({ x: this._animatedValueX, y: this._animatedValueY })
        this.state._pan.setValue({ x: 0, y: 0 });
      },

      onPanResponderMove: Animated.event([null, { dx: this.state._pan.x, dy: this.state._pan.y }]),

      onPanResponderRelease: () => {
        if (this._taskStates !== undefined) {
          this._taskStates.setScrollEnabled(true);
        }
        
        this.state._pan.flattenOffset(); // Flatten the offset so it resets the default positioning
        
        var centerX = this.state._pan.x._value + this.state._halfWidth;
        var centerY = this.state._pan.y._value + this.state._halfHeight;
        var posX = this.state._baseX + centerX;
        var posY = this.state._baseY + centerY;
        var taskState = false;

        for(var i=0; i<this.state._okDrop.length; i++) {
          if (this._isOnDroppable(posX, posY, this.state._okDrop[i])) {
            this._centerToDroppable(this.state._okDrop[i]);
            taskState = true;

            this._currentDroppable = this.state._okDrop[i];
            this._currentDroppable._setOccupied(true);
            
            break;
          }
        }

        this._notifyListeners(taskState);
        
        if (!taskState) {
          for(var i=0; i<this.state._wrongDrop.length; i++) {
            if (this._isOnDroppable(posX, posY, this.state._wrongDrop[i])) {
              this._centerToDroppable(this.state._wrongDrop[i]);

              this._currentDroppable = this.state._wrongDrop[i];
              this._currentDroppable._setOccupied(true);

              break;
            }
          }
        }

        this.setState({ _onDropState: taskState });
      }
    });
  }
  
  _unregisterPanResponder() {
    this.state._pan.x.removeAllListeners();
    this.state._pan.y.removeAllListeners();

    this._panResponder = PanResponder.create({
      onPanResponderGrant: (e, gestureState) => {},
      onPanResponderMove:  (e, gestureState) => {},
      onPanResponderRelease: () => {}
    });
  }

  /**
   * Method notifies all listeners. Note that the listener class
   * has to implement method 'update(obj, state)'.
   * 
   * @param {*} state State of the draggable.
   */
  _notifyListeners(state) {
    for (var i=0; i<this._listeners.length; i++) {
      this._listeners[i].update(this, state);
    }
  }
}

DraggableView.PropTypes = {
  /**
   * left, right, center, top, bottom
   */
  centerTo: PropTypes.string
}

const styles = StyleSheet.create({
  text: {
    color: 'white',
  }
})