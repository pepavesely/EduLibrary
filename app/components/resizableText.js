'use strict';
import React, { Component } from 'react';
import { AppRegistry, Text } from 'react-native';

export default class ResizableText extends Component {

    constructor(props) {
        super(props);

        this.state = {
            style: Text.propTypes.style
        };
    }

    render() {
        return (
            <Text style={this.props.style} allowFontScaling={false}>
                {this.props.children}
            </Text>
        );
    }
}