import React, { Component } from 'react';
import {PhotoUploadPreviewContainer} from './PhotoUploadPreview.styled';

class PhotoUploadPreview extends Component {
  constructor() {
    super();
    this.remove = this.remove.bind(this);
  }

  remove() {
    this.props.removePhoto(this.props.idx);
  }
  render() {
    return (
      <PhotoUploadPreviewContainer>
        <img alt="upload" src={this.props.photo}/>
        <h1 onClick={this.remove}>X</h1>
      </PhotoUploadPreviewContainer>
    );
  }



}

export default PhotoUploadPreview;
