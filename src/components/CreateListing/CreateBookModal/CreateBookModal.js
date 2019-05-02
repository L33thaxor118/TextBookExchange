import React, { Component } from 'react';
import {Button, Modal, Form, Message} from 'semantic-ui-react';
import ListCreator from '../ListCreator/ListCreator';
import { connect } from 'react-redux';
import { createBook } from '../../../redux/actions/index';

class CreateBookModal extends Component {
  constructor() {
    super();
    this.state = {
      courses: [],
      title: "",
      authors: [],
      isbn: "",

      titleRequiredError: false,
      isbnRequiredError: false,
      authorRequiredError: false,
      bookCreationFailed: false,
      bookCreationSuccess: false
    };

    this.addCourse = this.addCourse.bind(this);
    this.removeCourse = this.removeCourse.bind(this)
    this.addAuthor = this.addAuthor.bind(this);
    this.removeAuthor = this.removeAuthor.bind(this)
    this.titleChanged = this.titleChanged.bind(this);
    this.isbnChanged = this.isbnChanged.bind(this);
    this.clearErrors = this.clearErrors.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
  }

  async handleCreate() {
    let titleRequiredError = false;
    let isbnRequiredError = false;
    let authorRequiredError = false;
    if (this.state.title === "") titleRequiredError = true;
    if (this.state.isbn === "") isbnRequiredError = true;
    if (this.state.authors.length === 0) authorRequiredError = true;
    this.setState({
      titleRequiredError: titleRequiredError,
      isbnRequiredError: isbnRequiredError,
      authorRequiredError: authorRequiredError,
      bookCreationFailed: false,
      bookCreationSuccess: false
    });
    if (titleRequiredError || isbnRequiredError || authorRequiredError) return;
    let newBook = {
      title: this.state.title,
      isbn: this.state.isbn,
      authors: this.state.authors,
      courses: this.state.courses
    }
    try {
      await this.props.createBook(newBook);
      this.setState({bookCreationFailed: false, bookCreationSuccess: true});
    } catch(err) {
      this.setState({bookCreationFailed: true, bookCreationSuccess: false});
    }
  }

  clearErrors() {
    this.setState({
      titleRequiredError: false,
      isbnRequiredError: false,
      authorRequiredError: false
    });
  }

  addAuthor(author) {
    this.setState({
      authors: [...this.state.authors, author]
    });
  }

  removeAuthor(author) {
    let newAuthors = this.state.authors;
    let idx = 0;
    for (let i = 0; i < newAuthors.length; i++) {
      if (newAuthors[i] === author) {
        idx = i;
        break;
      }
    }
    newAuthors.splice(idx, 1);
    this.setState({
      authors: newAuthors
    });
  }

  removeCourse(course){
    let newCourses = this.state.courses;
    let idx = 0;
    for (let i = 0; i < newCourses.length; i++) {
      if (newCourses[i] === course) {
        idx = i;
        break;
      }
    }
    newCourses.splice(idx, 1);
    this.setState({
      courses: newCourses
    });
  }

  addCourse(courseName) {
    this.setState({
      courses: [...this.state.courses, courseName]
    });
  }

  titleChanged(event){
    let title = event.target.value;
    this.setState({
      title: title
    });
  }

  isbnChanged(event){
    let isbn = event.target.value;
    this.setState({
      isbn: isbn
    });
  }

  render() {
    return (
      <Modal open={this.props.open}
        closeOnEscape={true}
        closeOnRootNodeClick={true}>
        <Modal.Content>
          <Form>
            <Form.Field error={this.state.titleRequiredError}>
              <label>Title</label>
              <input onChange = {this.titleChanged} placeholder='title' />
            </Form.Field>
            <Form.Field error={this.state.isbnRequiredError}>
              <label>ISBN</label>
              <input onChange = {this.isbnChanged} placeholder='Last Name' />
            </Form.Field>
            <Form.Field error={this.state.authorRequiredError}>
              <h4>Add Authors</h4>
              <ListCreator items = {this.state.authors}
                addItem = {this.addAuthor}
                removeItem = {this.removeAuthor}
              />
            </Form.Field>
            <h4>Add Relevant Courses</h4>

            <Button type='submit' onClick={this.handleCreate}>Submit</Button>
            <Button color='red' onClick={this.props.close}>Cancel</Button>
          </Form>
          <Message success hidden={!this.state.bookCreationSuccess}>
            Created book! You can now select it via ISBN or Search
          </Message>
          <Message error hidden={!this.state.bookCreationFailed}>
            Failed to create book
          </Message>
        </Modal.Content>
      </Modal>
    );
  }

}
const mapStateToProps = (state) => {
  return {
    createBookHasFailed: state.createBookHasFailed
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createBook: book => dispatch(createBook.start(book))
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateBookModal);
