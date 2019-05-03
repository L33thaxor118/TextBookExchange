import React, { Component } from 'react';
import { UploadComponentContainer } from './UploadComponent.styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


//SOURCE: https://medium.com/@650egor/simple-drag-and-drop-file-upload-in-react-2cb409d88929

class UploadComponent extends Component {
  constructor() {
    super();
    this.state = {
      dragging: false
    };

    this.dropboxRef = React.createRef();
    this.dragCounter = 0;
    this.handleDrag = this.handleDragOver.bind(this);
    this.handleDragEnter = this.handleDragEnter.bind(this);
    this.handleDragExit = this.handleDragExit.bind(this);
    this.handleDragDrop = this.handleDragDrop.bind(this);
  }
  componentDidMount() {
    let dropboxDiv = this.dropboxRef.current;
    dropboxDiv.addEventListener('dragenter', this.handleDragEnter);
    dropboxDiv.addEventListener('dragleave', this.handleDragExit);
    dropboxDiv.addEventListener('dragover', this.handleDragOver);
    dropboxDiv.addEventListener('drop', this.handleDragDrop);
  }

  componentWillUnmount() {
      let div = this.dropboxRef.current;
      div.removeEventListener('dragenter', this.handleDragEnter);
      div.removeEventListener('dragleave', this.handleDragExit);
      div.removeEventListener('dragover', this.handleDragOver);
      div.removeEventListener('drop', this.handleDragDrop);
    }

  handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  handleDragEnter(event) {
    event.preventDefault();
    event.stopPropagation();
    this.dragCounter++;
    if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
      console.log("entered");
      this.setState({dragging: true});
    }
  }

  handleDragExit(event) {
    event.preventDefault();
    event.stopPropagation();
    console.log("exited" + event.target.className);
    this.dragCounter--;
    if (this.dragCounter > 0) return;
    this.setState({dragging: false});
  }

  handleDragDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({dragging: false});
      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        this.props.handleFileDrop(event.dataTransfer.files);
        //event.dataTransfer.clearData()
        this.dragCounter = 0;
      }
  }

  render() {
    let content = {};
    if (this.state.dragging) {
      content = (
      <div className={'dragging'}>
        <FontAwesomeIcon className={'icon'} icon="plus" size="3x"/>
      </div>
      );
    } else {
      content = (
      <div className={'idle'}>
        <FontAwesomeIcon className={'icon'} icon="upload" size="3x"/>
        <h3> Drag to Upload! </h3>
      </div>
      );
    }
    return (
      <UploadComponentContainer ref={this.dropboxRef}>
        {content}
      </UploadComponentContainer>
    );
  }


}

export default UploadComponent;
