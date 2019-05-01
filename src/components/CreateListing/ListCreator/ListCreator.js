import React, { Component } from 'react';
import {Input, Button, Label} from 'semantic-ui-react';
import {ListCreatorContainer} from './ListCreator.styled';

class ListCreator extends Component {
  constructor() {
    super();
    this.state = {
      inputText: ""
    };
    this.removeCourse = this.removeCourse.bind(this);
    this.addCourse = this.addCourse.bind(this);
    this.inputChanged = this.inputChanged.bind(this);
  }

  addCourse() {
    console.log(this.state.inputText);
    this.props.addCourse(this.state.inputText);
  }

  removeCourse(event, data) {
    console.log(data);
  }

  inputChanged(event){
    let text = event.target.value;
    this.setState({
      inputText: text
    });
  }

  render() {
    let courses = this.props.courses.map(course => {
      return (
        <Button label={course}
          labelPosition='left'
          onClick={this.removeCourse}>{'X'}
        </Button>
      );
    });
    return (
      <ListCreatorContainer>
        <div className='input'>
          <Input placeholder= 'Enter Course number' onChange={this.inputChanged} />
          <Button className={'addButton'} onClick={this.addCourse}>+</Button>
        </div>
        {courses}
      </ListCreatorContainer>
    );
  }



}

export default ListCreator;
