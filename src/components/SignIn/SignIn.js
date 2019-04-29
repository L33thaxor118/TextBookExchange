import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Message, Card } from 'semantic-ui-react';

import { SignInContainer, ErrorContainer, ToggleLink } from './SignIn.styled';

import { createUser, login } from '../../redux/reducers/userReducer';

class UserAuthentication extends Component {
  state = {
    email: '',
    displayName: '',
    password: '',
    isRegisterScreen: false,
  };

  redirectToPreviousPage = () => {
    const { from } = this.props.location.state || {};

    this.props.history.push(from || '/');
  };

  async handleFormSubmit() {
    const { isRegisterScreen, email, password, displayName } = this.state;
    
    if (isRegisterScreen) {
      await this.props.createUser({
        email,
        displayName,
        password
      });
    } else {
      await this.props.login({ email, password });
    }

    if (!this.props.error) {
      this.redirectToPreviousPage();
    }
  }

  onFormFieldChange = fieldName => event => this.setState({
    [fieldName]: event.target.value
  });

  toggleScreenType = isRegisterScreen => () => this.setState({ isRegisterScreen });

  render() {
    const { isRegisterScreen } = this.state;
    const { error } = this.props;

    const actionName = isRegisterScreen ? 'Register' : 'Sign In';

    return (
      <SignInContainer>
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
                content={error.message}
              />
            </ErrorContainer>
          )}
        </Card>
      </SignInContainer>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  createUser: user => dispatch(createUser(user)),
  login: user => dispatch(login(user)),
});

export default connect(
  state => state.loginState,
  mapDispatchToProps
)(UserAuthentication);
