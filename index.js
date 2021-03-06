// 'use strict';
import { NativeModules } from 'react-native';
import ClickInfoTask from './app/components/clickInfoTask'; 
import ClickInfoView from './app/components/clickInfoView';
import DragDropTask from './app/components/dragDropTask';
import DraggableView from './app/components/draggableView';
import DroppableView from './app/components/droppableView';
import CheckBox from './app/components/checkbox';
import CheckboxTask from './app/components/checkboxTask';
import ImageButton from './app/components/imageButton';
import ImageRiddlesTask from './app/components/imageRiddlesTask';
import LinkPairTask from './app/components/linkPairTask';
import ResizableImage from './app/components/resizableImage';
import ResizableText from './app/components/resizableText';
import TestTask from './app/components/testTask';
import VideoComponent from './app/components/videoComponent';
import Responsive from './app/utils/responsive';
import { getCorrectFontSizeForScreen } from './app/utils/multiResolution';

const { RNEduLibrary } = NativeModules;

export { 
  RNEduLibrary,
  ClickInfoTask,
  ClickInfoView,
  DragDropTask,
  DraggableView,
  DroppableView,
  CheckBox,
  CheckboxTask,
  ImageButton,
  ImageRiddlesTask,
  LinkPairTask,
  ResizableImage,
  ResizableText,
  TestTask,
  VideoComponent,
  Responsive,
  getCorrectFontSizeForScreen
}

// module.exports = RNEduLibrary;
// module.exports.ClickInfoTask = ClickInfoTask;
// module.exports.ClickInfoView = ClickInfoView;
// module.exports.DragDropTask = DragDropTask;
// module.exports.DraggableView = DraggableView;
// module.exports.DroppableView = DroppableView;
// module.exports.CheckBox = CheckBox;
// module.exports.CheckboxTask = CheckboxTask;
// module.exports.ImageButton = ImageButton;
// module.exports.ImageRiddlesTask = ImageRiddlesTask;
// module.exports.ResizableImage = ResizableImage;
// module.exports.ResizableText = ResizableText;
// module.exports.TestTask = TestTask;
// module.exports.VideoComponent = VideoComponent;
// module.exports.Responsive = Responsive;
// module.exports.getCorrectFontSizeForScreen = getCorrectFontSizeForScreen;