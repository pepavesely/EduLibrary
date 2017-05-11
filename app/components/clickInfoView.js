'use strict';
import React, { Component, PropTypes } from 'react';
import { View, TouchableWithoutFeedback, StyleSheet } from 'react-native';

import ResizableText from './resizableText';
import ResizableImage from './resizableImage';
import ImageButton from './imageButton';
import Responsive from '../utils/responsive';

export default class ClickInfoView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      textVisible: false,
      disabled: false,
      state: false,
    };
  }

  renderContent() {
    if (this.props.hasImage === false) {
      return ( <View style={this.props.style} /> );
    } else {
      return ( <ResizableImage source={this.props.image} /> );
    }
  }

  render() {
    let btnInfoStyle = styles.btnInfoRightBottom;
    let _marginLeft = 0;
    let _marginRight = 0;
    if (this.props.btnInfoStyle === "rightTop") {
      btnInfoStyle = styles.btnInfoRightTop;
      _marginRight = Responsive.getSize(50)
    } else if (this.props.btnInfoStyle ==="leftTop") {
      btnInfoStyle = styles.btnInfoLeftTop;
      _marginLeft = Responsive.getSize(50)
    } else if (this.props.btnInfoStyle ==="leftBottom") {
      btnInfoStyle = styles.btnInfoLeftBottom;
    }

    return (
      <TouchableWithoutFeedback style={styles.container} onPress={this.props.imagePressed} disabled={this.state.disabled}>
        <View>
          {this.renderContent()}
          <TouchableWithoutFeedback onPress={this._hideText.bind(this)}>            
            <View style={[styles.overlay, {opacity: this.state.textVisible ? 1 : 0, zIndex: this.state.textVisible ? 1 : -1, 
                justifyContent: this.props.justifyContent || 'center',
                backgroundColor: this.props.overlayColor || 'rgba(255,255,255,0.7)',
              }]}>                
              <ResizableText style={{ 
                textAlign: this.props.textAlign || 'center',
                padding: this.props.textPadding || 12,
                color: this.props.textColor || 'black',
                marginLeft: _marginLeft,
                marginRight: _marginRight
              }}>                
                {this.props.text}
              </ResizableText>
            </View>            
          </TouchableWithoutFeedback>   

          <ImageButton ref="btnInfo"
            style={btnInfoStyle}
            src={this.props.src}
            srcDisabled={this.props.srcDisabled}
            srcPressed= {this.props.srcPressed}
            pressFunction={this._btnInfoPressed.bind(this)}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }

  _getState() {
    return this.state.state;
  }

  _hideText() {
    this.setState({textVisible: false});
  }

  _setDisabled(isDisabled) {
    this.refs["btnInfo"]._setDisabled(isDisabled);
    this.setState({disabled: isDisabled});
  }

  _isDisabled() {
    return this.state.disabled;
  }

  _btnInfoPressed() {
    if (this.props.hasOverlayText===undefined || this.props.hasOverlayText) {
      this.setState({
        textVisible: !this.state.textVisible,
        state: true
      });
    } else {
      this.setState({
        state: true
      });
    }

    if (this.props.btnInfoPressed !== undefined) {
      this.props.btnInfoPressed();
    }
  }
}

ClickInfoView.propTypes = {
  image: PropTypes.number,
  text: PropTypes.string,
  imagePressed: PropTypes.func,
  btnInfoPressed: PropTypes.func,
  textAlign: PropTypes.string,
  textPadding: PropTypes.number,
  hasOverlayText: PropTypes.bool,
  src: PropTypes.number,
  srcPressed: PropTypes.number,
  srcDisabled: PropTypes.number,

  /**
   * rightTop, rightBottom (default), leftTop, leftBottom 
   */
  btnInfoPosition: PropTypes.string,
  overlayColor: PropTypes.string,
  hasImage: PropTypes.bool
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  },

  btnInfoRightTop: {
    position: 'absolute',
    right: 0,
    top: 0
  },
  btnInfoRightBottom: {
    position: 'absolute',
    right: 0,
    bottom: 0
  },
  btnInfoLeftTop: {
    position: 'absolute',
    left: 0,
    top: 0
  },
  btnInfoLeftBottom: {
    position: 'absolute',
    left: 0,
    bottom: 0
  }
});