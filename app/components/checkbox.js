'use strict';

import React, { Component } from 'react';
var PropTypes = React.PropTypes;
import {
    StyleSheet,
    Image,
    View,
    TouchableHighlight
} from 'react-native';

import ResizableText from './resizableText';
import ResizableImage from './resizableImage';

/**
 * This class is originally react-native-checkbox available from https://github.com/sconxu/react-native-checkbox.
 * It is sligtly modified to have more friendly look & feel and better functionality.
 * 
 * Date: 17-04-11
 * @author sconxu (GitHub user); modifications by Josef Vesely
 */
class CheckBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            internalChecked: false
        };

        this.onChange = this.onChange.bind(this);
    }

    onChange() {
        if (this.props.onChange &&  typeof this.props.checked === 'boolean') {
            this.props.onChange(this.props.checked);
        } else {
            let internalChecked = this.state.internalChecked;

            if(this.props.onChange){
              this.props.onChange(internalChecked);
            }
            this.setState({
                internalChecked: !internalChecked
            });
        }
    }

    setChecked(ischecked) {
        this.setState({ internalChecked: ischecked });
    }

    render() {
        let container = (
            <View style={this.props.containerStyle || styles.container}>
                <Image
                style={this.props.checkboxStyle || styles.checkbox}
                source={source}/>
                <View style={styles.labelContainer}>
                    <ResizableText style={[styles.label, this.props.labelStyle]}>{this.props.label}</ResizableText>
                </View>
            </View>
        );

        let source;

        if(typeof this.props.checked === 'boolean') {
          source = this.props.checked ? this.props.checkedImage : this.props.uncheckedImage;
        } else {
          source = this.state.internalChecked ? this.props.checkedImage : this.props.uncheckedImage;
        }


        if (this.props.labelBefore) {
            container = (
                <View style={this.props.containerStyle || [styles.container, styles.flexContainer]}>
                    <View style={styles.labelContainer}>
                        <ResizableText numberOfLines={this.props.labelLines} style={[styles.label, this.props.labelStyle]}>{this.props.label}</ResizableText>
                    </View>
                    <ResizableImage
                    style={[styles.checkbox, this.props.checkboxStyle]}
                    source={source}/>
                </View>
            );
        } else {
            container = (
                <View style={[styles.container, this.props.containerStyle]}>
                    <ResizableImage
                    style={[styles.checkbox, this.props.checkboxStyle]}
                    source={source}/>
                    <View style={styles.labelContainer}>
                        <ResizableText numberOfLines={this.props.labelLines} style={[styles.label, this.props.labelStyle]}>{this.props.label}</ResizableText>
                    </View>
                </View>
            );
        }

        return (
            <TouchableHighlight disabled={this.props.disabled || false} onPress={this.onChange} underlayColor={this.props.underlayColor} style={styles.flexContainer}>
                {container}
            </TouchableHighlight>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        // marginBottom: 5,
    },
    checkbox: {
      // Josef Vesely: removed dimensions
    },
    labelContainer: {
      // Josef Vesely: removed margins
    },
    label: {
        // Josef Vesely: removed text style
    }
});

CheckBox.propTypes = {
    label: PropTypes.string,
    labelBefore: PropTypes.bool,
    labelStyle: PropTypes.oneOfType([PropTypes.array,PropTypes.object,PropTypes.number]),
    labelLines: PropTypes.number,
    checkboxStyle: PropTypes.oneOfType([PropTypes.array,PropTypes.object,PropTypes.number]),
    containerStyle: PropTypes.oneOfType([PropTypes.array,PropTypes.object,PropTypes.number]),
    checked: PropTypes.bool,
    checkedImage: PropTypes.number,
    uncheckedImage: PropTypes.number,
    underlayColor: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool
};

CheckBox.defaultProps = {
    label: 'Label',
    labelLines: 1,
    labelBefore: false,
    checked: null,
    underlayColor: 'white'
};

module.exports = CheckBox;
