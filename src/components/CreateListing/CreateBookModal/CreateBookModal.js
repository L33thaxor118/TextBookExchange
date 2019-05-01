import React, { Component } from 'react';
import {Input, Button, Label, Modal, Form} from 'semantic-ui-react';
import {CreateBookModalContainer} from './CreateBookModal.styled';
import ListCreator from '../ListCreator/ListCreator';

class CreateBookModal extends Component {
  constructor() {
    super();
    this.state = {
      courses: [],
      title: "",
      authors: [],
      isbn: ""
    };
    this.addCourse = this.addCourse.bind(this);
    this.removeCourse = this.removeCourse.bind(this)

  }

  removeCourse(event){
    console.log(event);
  }

  addCourse(courseName) {
    console.log(courseName);
    this.setState({
      courses: [...this.state.courses, courseName]
    });
  }

  render() {
    return (
      <Modal open={this.props.open}
        closeOnEscape={true}
        closeOnRootNodeClick={true}>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>Title</label>
              <input placeholder='title' />
            </Form.Field>
            <Form.Field>
              <label>ISBN</label>
              <input placeholder='Last Name' />
            </Form.Field>
            <Form.Field>
              <label>Authors</label>
              <input placeholder='Last Name' />
            </Form.Field>
            <ListCreator courses = {this.state.courses}
              addCourse = {this.addCourse}
              removeCourse = {this.removeCourse}
            />
            <Button type='submit'>Submit</Button>
            <Button color='red' onClick={this.props.close}>Cancel</Button>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}

export default CreateBookModal;
