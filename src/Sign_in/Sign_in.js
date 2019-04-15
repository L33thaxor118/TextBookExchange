import { Button, Checkbox, Form } from 'semantic-ui-react';
import React, { Component } from 'react';
import styles from './Sign_in.module.scss';

class UserAuthentication extends Component {
  constructor() {
    super();
    this.state = {
      error: false
    };

  }

  render() {
    return (
      <div className={styles.container}>
        <Form>
          <Form.Field>
            <label>First Name</label>
            <input placeholder='First Name' />
          </Form.Field>
          <Form.Field>
            <label>Last Name</label>
            <input placeholder='Last Name' />
          </Form.Field>
          <Form.Field>
            <Checkbox label='I agree to the Terms and Conditions' />
          </Form.Field>
          <Button type='submit'>Submit</Button>
        </Form>
      </div>
    );
  }



}

export default UserAuthentication;
