'use strict';
import React, {Component} from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';

// TODO: video neni resizable, pokousi se hrat i po tom co neni zobrazene
// TODO: nastavit timeout pri nacitani videa, moznost posouvani videa...
// TODO: mozna zkusit najit jinou implementaci?
export default class VideoComponent extends Component {

  video = undefined;

  constructor(props) {
    super(props);

    this.state = {
      duration: 0.0,
      currentTime: 0.0,
      paused: false
    };
  }

  componentWillUnmount() {
    console.log("konec");
    this._onEnd();
  }

  render() {
    const flexCompleted = this._getCurrentTimePercentage() * 100;
    const flexRemaining = (1 - this._getCurrentTimePercentage()) * 100;

    return (
      <View style={styles.videoContainer}>
        <TouchableOpacity onPress={() => this.setState({ paused: !this.state.paused })} >
          <Video
            ref={(ref) => { this.video = ref }}
            source={{ uri: this.props.src, type: 'mp4' }}
            style={{width: this.props.width, height: this.props.height}}
            repeat={this.props.repeat || false}
            paused={this.state.paused}
            resizeMode={'contain'}
            onBuffer={this._onBuffer}  
            onLoad={this._onLoad}
            onProgress={this._onProgress}
            onEnd={this._onEnd} />
        </TouchableOpacity>

        <View style={styles.controls}>
          <View style={styles.trackingControls}>
            <View style={styles.progress}>
              <View style={[styles.innerProgressCompleted, { flex: flexCompleted }]} />
              <View style={[styles.innerProgressRemaining, { flex: flexRemaining }]} />
            </View>
          </View>
        </View>
      </View>
    );
  }

  _onBuffer = (data) => {
   console.log("BUFFERING VIDEO");
  }

  _onLoad = (data) => {
    console.log("VIDEO LOADED");
    this.setState({ duration: data.duration });
  }

  _onProgress = (data) => {
    console.log("PLAYING VIDEO " + data.currentTime);
    this.setState({ currentTime: data.currentTime });
  }

  _onEnd = () => {
    console.log("VIDEO ENDED")
    this.setState({ paused: true });
    this.video.seek(0);
  }

  _getCurrentTimePercentage() {
    if (this.state.currentTime > 0) {
      return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
    }
    return 0;
  }

  _pause(isPaused) {
    this.setState({ paused: isPaused });
  }
}

const styles = StyleSheet.create({
  videoContainer: {
    backgroundColor: 'black',
  },
  controls: {
    backgroundColor: 'transparent',
    borderRadius: 5,
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  progress: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 3,
    overflow: 'hidden',
  },
  innerProgressCompleted: {
    height: 20,
    backgroundColor: '#cccccc',
  },
  innerProgressRemaining: {
    height: 20,
    backgroundColor: '#2C2C2C',
  }
});