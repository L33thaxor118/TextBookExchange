import React, { Component } from 'react';
import { Button, Form, Message } from 'semantic-ui-react';
import styles from './SignIn.module.scss';
import { authentication } from '../Utils/Firebase/firebase';

class UserAuthentication extends Component {
  state = {
    email: '',
    password: '',
    error: null,
  };

  // TODO: Move all of this into a Redux reducer
  async signUpHandler() {
    try {
      const { email, password } = this.state;
      const { user } = await authentication.createUserWithEmailAndPassword(email, password);
      console.log('created user', user);
      this.props.history.push('/');
    } catch (error) {
      this.setState({ error: error.message || 'An unknown error occurred' });
    }
  }

  async signInHandler() {
    try {
      const { email, password } = this.state;
      const { user } = await authentication.signInWithEmailAndPassword(email, password);
      console.log('user is', user);
    } catch (error) {
      this.setState({ error: error.message || 'An unknown error occurred' });
    }
  }

  onFormFieldChange = fieldName => event => this.setState({
    [fieldName]: event.target.value
  });

  render() {
    return (
      <div className={styles.container}>
        <Form>
          <Form.Field>
            <label>Email</label>
            <input placeholder='email' onChange={this.onFormFieldChange('email')}/>
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <input
              type='password'
              placeholder='password'
              onChange={this.onFormFieldChange('password')}
            />
          </Form.Field>
          <Button type='submit' onClick={this.signInHandler.bind(this)}>Sign in</Button>
          <Button type='submit' onClick={this.signUpHandler.bind(this)}>Register</Button>
          {this.state.error && <Message header='Action forbidden' content={this.state.error} />}
        </Form>
      </div>
    );
  }
}

export default UserAuthentication;
