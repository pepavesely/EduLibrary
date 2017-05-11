'use strict'
import React, { Component, PropTypes } from 'react'
import { View, TouchableOpacity } from 'react-native'
import ResizableImage from "./resizableImage"

export default class ImageButton extends Component {

  constructor(props) {
    super(props)

    this.state = {
      style: View.propTypes.style,
      src: (this.props.disabled === undefined || this.props.disabled === false) ? this.props.src : this.props.srcDisabled,
      disabled: this.props.disabled === undefined ? false : this.props.disabled
    }
  }

  render() {
    return(
      <TouchableOpacity
        style={this.props.style}
        onPress={this.props.pressFunction}
        activeOpacity={1}
        disabled={this.state.disabled}
        onPressIn={this._onPressIn.bind(this)}
        onPressOut={this._onPressOut.bind(this)}>

        <ResizableImage source={this.state.src} sources={[this.props.src, this.props.srcPressed, this.props.srcDisabled]}>
          {this.props.children}
        </ResizableImage>

      </TouchableOpacity>
    )
  }

  _setDisabled(isDisabled) {
    this.setState({
      src: (isDisabled && this.props.srcDisabled !== undefined) ? this.props.srcDisabled : this.props.src,
      disabled: isDisabled
    })
  }

  _isDisabled() {
    return this.state.disabled;
  }

  _onPressIn() {
    this.setState({src: this.props.srcPressed})
  }

  _onPressOut() {
    this.setState({src: this.props.src})
  }  

}

ImageButton.propTypes = {
  src: PropTypes.number.isRequired,
  srcPressed: PropTypes.number.isRequired,
  srcDisabled: PropTypes.number,
  pressFunction: PropTypes.func,
  disabled: PropTypes.bool,
}
