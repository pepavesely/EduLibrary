'use strict';
import React, { Component } from 'react';
import { PanResponder} from 'react-native';
import { observer } from 'mobx-react/native';

@observer
export default class LinkPairTask extends Component {

  _panResponder = {};
  _previousLeft = 0;
  _previousTop = 0;

  _leftViews = [];
  _leftRefs  = [];
  _rightView = [];
  _rightRefs = [];
  _lineRefs  = [];
  _lineView  = [];

  _drawLeftIndex = -1;
  _svgDimens = {x: 0, y: 0, width: 0, height: 0};
  _initialized;

  _order = [];
  _orderCorrect = [];
  _state = false;
  _taskStore = undefined;

  constructor(props, lineRefs) {
    super(props);
    this._lineRefs = lineRefs;

    let lPos = new Array(this._lineRefs.length);
    for (var i=0; i<lPos.length; i++) {
      this._lineView.push( {origX: 0, origY: 0} );
      lPos[i] = {left: 0, top: 0};
    }

    this.state = {
      pos: lPos
    }
  }

  componentWillMount() {
    if (this._state) {
      this._taskStore.loadStates().then((state) => {
        if (state && this._taskStore.getState(0) !== undefined) {
          let lPos = this.state.pos;
          for (var i=0; i<this._lineView.length; i++) {
            let st = this._taskStore.getState(i);
            this._lineView[i] = { origX: st.x1, origY: st.y1 };
            lPos[i] = { left: st.x2, top: st.y2 };
          }
          this.setState({pos: lPos});
        }
      }).catch(function(error) {
        console.log("Error: " + error.message);
      });
    } else {
      this._panResponder = PanResponder.create({
        onMoveShouldSetResponderCapture: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderGrant: (e, gestureState) => {
            let left = e.nativeEvent.locationX;
            let top = e.nativeEvent.locationY;          
            this._drawLeftIndex = this._isOnViewIndex(left + this._svgDimens.x, top + this._svgDimens.y, this._leftViews);

            if (this._drawLeftIndex !== -1) {
              this._lineView[this._drawLeftIndex] = { origX: left, origY: top};
            }
        },

        onPanResponderMove: (e, gestureState) => {
          if (this._drawLeftIndex === -1) {
            return;
          }

          let lPos = this.state.pos;
          lPos[this._drawLeftIndex] = {
            left: this._lineView[this._drawLeftIndex].origX + gestureState.dx,
            top: this._lineView[this._drawLeftIndex].origY + gestureState.dy
          };
          this.setState({pos: lPos});
        },

        onPanResponderRelease: (e, gestureState) => {
          if (this._drawLeftIndex === -1) {
            return;
          }
          
          this._handleOnUp();
        }
      });
    }
  }

  componentDidMount() {    
    if (this._initialized) {
      return;
    }

    setTimeout(() => {
      for (var i=0; i<this._leftRefs.length; i++) {
        this.refs[ this._leftRefs[i] ].measure( (fx, fy, w, h, px, py) => {
          this._leftViews.push( {left: px, top: py, right: px+w, bottom: py+h} );
        });
      }

      for (var i=0; i<this._rightRefs.length; i++) {
        this.refs[ this._rightRefs[i] ].measure( (fx, fy, w, h, px, py) => {
          this._rightView.push( {left: px, top: py, right: px+w, bottom: py+h} );
        });
      }

      this.refs["contentWrapper"].measure((fx, fy, w, h, px, py) => {
        this._svgDimens.x = px;
        this._svgDimens.y = py;
      });

      this._initialized = true;
    }, 0);
  }

  _evaluate() {
    let state = true;

    let lPos = this.state.pos;
    for (var i=0; i<this._order.length; i++) {
      if (this._order[i] !== this._orderCorrect[i]) {
        state = false;
        lPos[i].left = 0;
        lPos[i].top = 0;
        this._lineView[i] = {origX: 0, origY: 0};
      }
    }

    if (state) {
      this._panResponder = PanResponder.create({
        onPanResponderGrant: (e, gestureState) => {},
        onPanResponderMove:  (e, gestureState) => {},
        onPanResponderRelease: () => {}
      });
      this.setState({pos: this.state.pos});
      this._savePositions();
    } else {
      this.setState({pos: lPos});
    }

    return state;
  }

  _savePositions() {
    for (var i=0; i<this._lineView.length; i++) {
      this._taskStore.setState(i, {
        x1: this._lineView[i].origX,
        y1: this._lineView[i].origY,
        x2: this.state.pos[i].left,
        y2: this.state.pos[i].top
      });
    }
  }

  _isOnViewIndex(x, y, views) {
    for (var i=0; i<views.length; i++) {
      let v = views[i];
      if (x>=v.left && x<=v.right && y>=v.top&&y<=v.bottom) {
        return i;
      }
    }

    return -1;
  }

  _handleOnUp() {
    let left = this.state.pos[this._drawLeftIndex].left + this._svgDimens.x;
    let top  = this.state.pos[this._drawLeftIndex].top + this._svgDimens.y

    let finalIndex = this._isOnViewIndex(left, top, this._rightView);

    if (finalIndex === -1) {
      this._lineView[this._drawLeftIndex] = { origX: 0, origY: 0};
      let lPos = this.state.pos;
      lPos[this._drawLeftIndex] = {
        left: 0,
        top: 0
      }
      this.setState({pos: lPos});
      this._order[this._drawLeftIndex] = -1;
    } else {
      this._order[this._drawLeftIndex] = finalIndex;
    }
  }

  _handleStartShouldSetPanResponder(e, gestureState) {
    // Should we become active when the user presses down on the circle?
    return true;
  }

  _handleMoveShouldSetPanResponder(e, gestureState) {
    // Should we become active when the user moves a touch over the circle?
    return true;
  }
}