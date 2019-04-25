import React, { Component } from 'react';
import { Dropdown, Message, Input } from 'semantic-ui-react';
import axios from 'axios';
import styles from './SelectBook.module.scss';

class SelectBook extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.dropdownContainer}>
          <h3>Select a book from our list: </h3>
          <Dropdown className={styles.dropdown}
              defaultValue={this.props.bookOptions[0].value}
              placeholder='Select Book'
              fluid
              search
              selection
              options={this.props.bookOptions}
              onChange={this.props.bookSelected}
            />
        </div>
        <h1> OR </h1>
        <div className={styles.createBookForm}>
          <h3>Find by ISBN:</h3>
          <Input className={styles.input} placeholder='ISBN'
            onChange= {this.props.createBookFormISBNChanged}
            loading = {this.props.loading}
            disabled={this.props.selectedFromDropdown} />
          {this.props.createBookHasFailed && (
              <Message
                color='red'
                header='Error'
                content={"failed to find ISBN"}
              />
          )}
        </div>
      </div>
    );
  }

}

export default SelectBook;
