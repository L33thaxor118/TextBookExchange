import { Button, Form } from 'semantic-ui-react';
import React, { Component } from 'react';
import styles from './CreateListing.css';
import UploadComponent from './UploadComponent/UploadComponent';
import PhotoUploadPreview from './PhotoUploadPreview/PhotoUploadPreview';
import { storage } from '../Utils/Firebase/firebase'

const mockListingObject = {
    _id: '4ecc05e55dd98a436ddcc47c',
    description: 'testing',
    status: 'incomplete',
    photo_names: [],
    listedBy: '1aac05e55da23fsd436cc47c',
    price: 20
  };
//// TODO: Add upload from file as opposed to drag and drop

function createObjectURL(object) {
    return (window.URL) ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object);
}

// function revokeObjectURL(url) {
//     return (window.URL) ? window.URL.revokeObjectURL(url) : window.webkitURL.revokeObjectURL(url);
// }

class CreateListing extends Component {
  constructor() {
    super();
    this.state = {
      imageFileList: []
    }
    this.handleFileDrop = this.handleFileDrop.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleRemovePhoto = this.handleRemovePhoto.bind(this);


  }

  handleRemovePhoto(idx) {
    let newList = this.state.imageFileList;
    newList.splice(idx, 1);
    this.setState({
      imageFileList: newList
    });

  }

  handleCreate() {
    //make POST request with other fields. add image_names as photo_names since
    //that is how they will be stored in firebase. use returned ID to upload
    //to a folder named after ID
    //something like mockListingObject is returned by POST
    var storageRef = storage.ref();
    for (let i = 0; i < this.state.imageFileList.length; i++) {
      let imageFile = this.state.imageFileList[i];
      var imgref = storageRef.child(mockListingObject._id + '/' + imageFile.name);
      imgref.put(imageFile).then(function(snapshot) {
        console.log('Uploaded a blob or file!');
      }).catch(function(error){console.log(error.message)});
    }
  }

  handleFileDrop(fileList) {
    this.setState({
      imageFileList: [...this.state.imageFileList, fileList[0]]
    });
  }

  render() {
    var imageContainers = [];
    var imageFiles = this.state.imageFileList;
    for (let i = 0; i < imageFiles.length; i++) {
      imageContainers.push(
          <PhotoUploadPreview removePhoto={this.handleRemovePhoto} photo={createObjectURL(imageFiles[i])} idx = {i}/>
        );
    }
    return (
      <div className={styles.container}>
        <Form>
          <Form.Field>
            <label>Name</label>
            <input placeholder='title' onChange={this.emailInputChanged}/>
          </Form.Field>
          <Form.Field>
            <label>Description</label>
            <input placeholder='desc' onChange={this.passwordInputChanged}/>
          </Form.Field>
          <Form.Field>
            <label>Price</label>
            <input placeholder='$'/>
          </Form.Field>
          <Button type='submit' onClick={this.handleCreate}>Create</Button>
        </Form>
        <div className={styles.uploadComponentContainer}>
          <UploadComponent handleFileDrop = {this.handleFileDrop}></UploadComponent>
        </div>
        {imageContainers}
      </div>
    );
  }



}

export default CreateListing;
