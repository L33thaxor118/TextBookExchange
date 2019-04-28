import React, { Component } from 'react';
import { Button, Form, Message, Card } from 'semantic-ui-react';

import { authentication } from '../Utils/Firebase/firebase';
import styles from './SignIn.css';
import { ErrorContainer, ToggleLink } from './SignIn.styled';

import usersApi from '../api/users';

class UserAuthentication extends Component {
  state = {
    email: '',
    displayName: '',
    password: '',
    error: null,
    isRegisterScreen: false,
  };

  redirectToPreviousPage = () => {
    const { from } = this.props.location.state || {};

    this.props.history.push(from || '/');
  };

  // TODO: Move all of this into a Redux reducer
  async handleFormSubmit() {
    const { isRegisterScreen } = this.state;
    try {
      const authMethod = (isRegisterScreen ? 'createUser' : 'signIn') + 'WithEmailAndPassword';
      const { email, password, displayName } = this.state;
      const { user } = await authentication[authMethod](email, password);
      
      if (user && isRegisterScreen) {
        await usersApi.create({
          firebaseId: user.uid,
          displayName,
          email,
        });
      }

      this.redirectToPreviousPage();
    } catch (error) {
      this.setState({ error: error.message || 'An unknown error occurred' });
    }
  }

  onFormFieldChange = fieldName => event => this.setState({
    [fieldName]: event.target.value
  });

  toggleScreenType = isRegisterScreen => () => this.setState({
    isRegisterScreen,
    error: null
  });

  render() {
    const { error, isRegisterScreen } = this.state;
    const actionName = isRegisterScreen ? 'Register' : 'Sign In';

    return (
      <div className={styles.container}>
        <Card>
          <Card.Content>
            <Card.Header>{actionName}</Card.Header>
            <Card.Description>
              <Form>
                <Form.Field>
                  <label>Email</label>
                  <input onChange={this.onFormFieldChange('email')}/>
                </Form.Field>
                {isRegisterScreen && (
                  <Form.Field>
                    <label>Display name</label>
                    <input onChange={this.onFormFieldChange('displayName')} />
                  </Form.Field>
                )}
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
                  onClick={this.handleFormSubmit.bind(this)}
                >
                  {actionName}
                </Button>
              </Form>
            </Card.Description>
          </Card.Content>
          <Card.Content style={{userSelect: 'none'}} extra>
            {isRegisterScreen ? (
              <div>
                Already have an account? <ToggleLink onClick={this.toggleScreenType(false)}>Sign in</ToggleLink>.
              </div>
            ) : (
              <div>
                Don't have an account? <ToggleLink onClick={this.toggleScreenType(true)}>Register</ToggleLink> now.
              </div>
            )}
          </Card.Content>
          {error && (
            <ErrorContainer>
              <Message
                color='red'
                header='Error'
                content={error}
              />
            </ErrorContainer>
          )}
        </Card>
      </div>
    );
  }
}

export default UserAuthentication;
