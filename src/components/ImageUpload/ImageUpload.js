import React from 'react';
import Uppy from '@uppy/core';
import { DashboardModal } from '@uppy/react';
import { storage } from '../../utils/firebase';
import FirebaseCloudStorage from './FirebaseStoragePlugin';

import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'

class ImageUpload extends React.Component {
  state = {
    open: false,
  };

  constructor(props) {
    super(props);
    const noop = () => {};

    this.uppy = Uppy({
      allowMultipleUploads: false,
      restrictions: {
        allowedFileTypes: ['image/*']
      },
      onBeforeUpload: files => {
        const updatedFiles = {...files};
        const filePrefix = this.props.listingId ? this.props.listingId + '/' : '';
        
        Object.keys(updatedFiles).forEach(fileId => {
          updatedFiles[fileId].name = filePrefix + updatedFiles[fileId].name;
        });
        
        return updatedFiles;
      }
    }).use(FirebaseCloudStorage, { storageRef: storage.ref() });

    this.uppy.on('file-added', props.onFileAdded || noop);
    this.uppy.on('file-removed', props.onFileRemoved || noop);
  }
  
  componentWillUnmount() {
    this.uppy.close();
  }

  upload = () => this.uppy.upload();

  render() {
    const Trigger = this.props.trigger;
    
    return (
      <>
        <Trigger onClick={() => this.setState({ open: true })} />
        <DashboardModal
          open={this.state.open}
          onRequestClose={() => this.setState({ open: false })}
          hideUploadButton
          uppy={this.uppy}
        />
      </>
    );
  }
}

export default ImageUpload;