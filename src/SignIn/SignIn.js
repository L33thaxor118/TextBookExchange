import React, { Component } from 'react';
import { Button, Form, Message, Card } from 'semantic-ui-react';

import { authentication } from '../Utils/Firebase/firebase';
import styles from './SignIn.module.scss';
import { ErrorContainer } from './SignIn.styled';

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
        <Card>
          <Card.Content>
            <Card.Header>Sign In</Card.Header>
            <Card.Description>
              <Form>
                <Form.Field>
                  <label>Email</label>
                  <input onChange={this.onFormFieldChange('email')}/>
                </Form.Field>
                <Form.Field>
                  <label>Password</label>
                  <input
                    type='password'
                    onChange={this.onFormFieldChange('password')}
                  />
                </Form.Field>
                <Button
                  primary
                  type='submit'
                  onClick={this.signInHandler.bind(this)}
                >
                  Sign In
                </Button>
                <Button
                  basic
                  type='submit'
                  onClick={this.signUpHandler.bind(this)}
                >
                  Register
                </Button>
              </Form>
            </Card.Description>
          </Card.Content>
          {this.state.error && (
            <ErrorContainer>
              <Message
                color='red'
                header='Error'
                content={this.state.error}
              />
            </ErrorContainer>
          )}
        </Card>
      </div>
    );
  }
}

export default UserAuthentication;
