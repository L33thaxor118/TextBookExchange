import React, { Component } from 'react';
import { Dropdown, Message, Input, Radio, Button, Modal, Form} from 'semantic-ui-react';
import { SelectBookContainer, SelectBookRadioGroup } from './SelectBook.styled';
import CreateBookModal from '../CreateBookModal/CreateBookModal';


class SelectBook extends Component {
  constructor() {
    super();
    this.state = {
      dropdownEnabled: true,
      isbnEnabled: false,
      modalOpen: false
    };
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  handleRadioChange(event, { value }) {
    if (value == ('isbn' + this.props.name)){
      this.setState({
        isbnEnabled: true,
        dropdownEnabled: false
      });
    } else if (value == ('dropdown' + this.props.name)) {
      this.setState({
        isbnEnabled: false,
        dropdownEnabled: true
      });
    }
    this.props.onRadioButtonChange(value);
  }

  openModal() {
    this.setState({
      modalOpen: true
    });
  }

  closeModal() {
    this.setState({
      modalOpen: false
    });
  }

  render() {
    let errorMessage = null;
    if (this.props.createBookHasFailed) {
      errorMessage = (
        <div>
          <Message
            color='red'
            header='Error'
            content={"failed to find ISBN"}
          />
          <Button type='submit' onClick={this.openModal}>Click to create your own Book</Button>
        </div>
      );
    }
    return (
      <SelectBookContainer disabled = {this.props.disabled}>
        <SelectBookRadioGroup selected = {this.state.dropdownEnabled}>
          <Radio className={'radio'}
            name={this.props.name}
            value={'dropdown' + this.props.name}
            checked={this.state.dropdownEnabled == true}
            onChange={this.handleRadioChange} />
          <h3>Select a book from our list: </h3>
          <Dropdown className={'dropdown'}
              disabled = {!this.state.dropdownEnabled}
              defaultValue={'None'}
              upward = {false}
              placeholder='Select Book'
              fluid
              search
              selection
              options={this.props.bookOptions}
              onChange={this.props.bookSelected}
            />
        </SelectBookRadioGroup>
        <SelectBookRadioGroup selected = {this.state.isbnEnabled}>
          <Radio className={'radio'}
            name={this.props.name}
            value={'isbn' + this.props.name}
            checked={this.state.isbnEnabled == true}
            onChange={this.handleRadioChange} />
          <h3>Find by ISBN:</h3>
          <Input className={'input'} placeholder='Enter 10 or 13 digit ISBN'
            disabled = {!this.state.isbnEnabled}
            onChange= {this.props.createBookFormISBNChanged}
            loading = {this.props.loading}
             />
          {errorMessage}
        </SelectBookRadioGroup>
        <CreateBookModal open = {this.state.modalOpen} close = {this.closeModal}/>
      </SelectBookContainer>
    );
  }

}

export default SelectBook;
