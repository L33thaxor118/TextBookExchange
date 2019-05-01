import React, { Component } from 'react';
import {Input, Button, Label} from 'semantic-ui-react';
import {ListCreatorContainer} from './ListCreator.styled';

class ListCreator extends Component {
  constructor() {
    super();
    this.state = {
      inputText: ""
    };
    this.removeItem = this.removeItem.bind(this);
    this.addItem = this.addItem.bind(this);
    this.inputChanged = this.inputChanged.bind(this);
  }

  addItem() {
    console.log(this.state.inputText);
    this.props.addItem(this.state.inputText);
  }

  removeItem(event, {label}) {
    this.props.removeItem(label);
  }

  inputChanged(event){
    let text = event.target.value;
    this.setState({
      inputText: text
    });
  }

  render() {
    let items = this.props.items.map(item => {
      return (
        <Button label={item}
          labelPosition='left'
          onClick={this.removeItem}>
        X</Button>
      );
    });
    return (
      <ListCreatorContainer>
        <div className='input'>
          <Input placeholder= 'Enter Item' onChange={this.inputChanged} />
          <Button className={'addButton'} onClick={this.addItem}>+</Button>
        </div>
        {items}
      </ListCreatorContainer>
    );
  }



}

export default ListCreator;
