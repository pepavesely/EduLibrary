'use strict';
import { PixelRatio } from 'react-native';
import Dimensions from 'Dimensions';

const { height: h, width: w } = Dimensions.get('window');
const factor = w / 1000;
const ratio = w / h; // predpodkladme landscape

class Responsive {

  constructor() {
    /* empty */
  }

  getSize = (size) => {
    var result = this._float2int(size * factor);
    return result < 1 ? 1 : result;
  }

  getSizeByRatio = (size) => {
    if (ratio <= 1.6) {
      return this.getSize(size * 2);
    } else {
      return this.getSize(size);
    }
  }

  getFactor = () => {
    return factor;
  }

  getRatio = () => {
    return ratio;
  }

  getWidth = () => {
    return w;
  }

  getHeight = () => {
    return h;
  }

  _float2int = (value) => {
    return value | 0;
  }
}

export default new Responsive();