'use strict';
import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';

export default class DroppableView extends Component {

  /**
   * Priznak, kolik je na cili draggable obj.
   */
  _occupied = 0;
  
  constructor(props) {
    super(props);
    this.state = {
      style: View.propTypes.style,
      _x: 0,
      _y: 0,
      _width: 0,
      _height: 0,
      _centerX: 0,
      _centerY: 0
     };
  }

  componentDidMount() {
    setTimeout(() => {
      if (this.refs["drop"] !== undefined) {
        this.refs["drop"].measure( (fx, fy, width, height, px, py) => {
          this.setState({
            _x: px,
            _y: py,
            _width: width,
            _height: height,
            _centerX: px + width / 2,
            _centerY: py + height / 2
          });
        }); 
      }
    }, 0);
  }

  render() {
    return ( 
      <View ref="drop" style={this.props.style} collapsable={false}>
        {this.props.children}
      </View>
    )
  }

  _getPosition() {
    return {
      x: this.state._x,
      y: this.state._y,
      width: this.state._width,
      height: this.state._height,
      centerX: this.state._centerX,
      centerY: this.state._centerY
    };
  }

  _setOccupied(isOccupied) {
    if(isOccupied) {
      this._occupied++;
    } else {
      this._occupied--;
    }
  }

  _isOccupied() {
    return this._occupied;
  }

  _isDeceptive() {
    return this.props.isDeceptive !== undefined && this.props.isDeceptive === true;
  }
}

DroppableView.PropTypes = {
  /*
  * center or not
  */
  autocenter: PropTypes.bool,

  /**
   * Nastavit na true, pokud jde o klamny cil.
   * Nema na nem byt nic umisteno
   */
  isDeceptive: PropTypes.bool
}