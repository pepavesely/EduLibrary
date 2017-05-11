'use strict';
import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';

import CheckBox from './checkbox';

/**
 * Checkbox task represents task with a list of statements. User checks
 * correct answers (one or more answers are correct). The list is vertical.
 * 
 * Date: 17-04-11
 * @author Josef Vesely
 */
@observer
export default class CheckboxTask extends Component {

  /**
   * Constructor defines class state:
   * <strong>values:</strong> array of booleans. True means that respectve 
   * answer is correct, False otherwise.
   * <strong>taskDone:</strong> wheter or not the task is done.
   * 
   * @param {*} props 
   * @constructor
   */
  constructor(props) {
    super(props);

    this.state = {
      values: this.props.values,
      labels: this.props.labels,
      taskDone: this.props.taskDone || false
    }
  }

  render() {
    var rows = [];
    
    if (this.state.taskDone) {
      for (var i=0; i < this.props.values.length; i++) {
        rows.push(
          <CheckBox key={i} ref={"ch"+i}      
            checked={this.state.values[i]}  
            disabled={true}  
            label={this.props.labels[i]}
            uncheckedImage={this.props.btnCheckbox}
            checkedImage={this.props.btnCheckboxChecked}
            labelStyle={this.props.labelStyle}
            underlayColor='rgba(255,255,255,0)'
          />
        );
      }
    } else {
      for (var i=0; i < this.props.values.length; i++) {
        rows.push(
          <CheckBox key={i} ref={"ch"+i}          
            label={this.props.labels[i]}
            uncheckedImage={this.props.btnCheckbox}
            checkedImage={this.props.btnCheckboxChecked}
            labelStyle={this.props.labelStyle}
            underlayColor='rgba(255,255,255,0)'
          />
        );
      }
    }
    return <View>{rows}</View>;
  }

  /**
   * 
   */
  evaluate() {
    let mistakeCounts = 0;
    for(var i=0; i<this.props.taskStore.state.length; i++) {
      let key = "ch" + i;
      let chState = this.refs[key].state.internalChecked;
      this.props.taskStore.setState(i, chState);

      if (chState !== this.state.values[i]) {
        mistakeCounts++;
      }
    }
    
    let state = (mistakeCounts === 0)
    this.setState({taskDone:state}); 

    return mistakeCounts;
  }
}

CheckboxTask.PropTypes = {
  values: PropTypes.arrayOf(PropTypes.bool).isRequired,
  labels: PropTypes.arrayOf(PropTypes.number).isRequired,
  labelStyle: PropTypes.oneOfType([PropTypes.array,PropTypes.object,PropTypes.number]),
  btnCheckbox: PropTypes.number.isRequired,
  btnCheckboxChecked: PropTypes.number.isRequired,
  taskDone: PropTypes.bool
}