import React, { Component } from 'react';
import styles from './PhotoUploadPreview.css';

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
      <div className={styles.container}>
        <img alt="upload" src={this.props.photo}/>
        <h1 onClick={this.remove}>X</h1>
      </div>
    );
  }



}

export default PhotoUploadPreview;
