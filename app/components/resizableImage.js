'use strict';
import React, { Component, PropTypes } from 'react';
import { AppRegistry, StyleSheet, Image, View } from 'react-native';
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';

import Responsive from '../utils/responsive';

export default class ResizableImage extends Component {
  
  constructor(props) {
    super(props)
  }

  setNativeProps(nativeProps) {
    this._root.setNativeProps(nativeProps);
  }

  render() {
    let source = this._getSource(this.props.source)

    return (
      <Image style={[styles.imageDefault, this.props.style]} source={source}>
        {this.props.children}
      </Image>
    );
  }

  _getSource(assetNumber) {
    let source = resolveAssetSource(assetNumber);
    let width  = Responsive.getSize(source.width);
    let height = Responsive.getSize(source.height);
    source.width = width;
    source.height = height;
    return source;
  }
}

ResizableImage.propTypes = {
  source: PropTypes.number.isRequired,
}

const styles = StyleSheet.create({
  imageDefault: {
    resizeMode: 'cover',
    overflow: 'visible',
  }
})