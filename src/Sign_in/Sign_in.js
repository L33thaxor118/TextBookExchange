import { Button, Checkbox, Form } from 'semantic-ui-react';
import React, { Component } from 'react';
import styles from './Sign_in.module.scss';
import Firebase from '../Firebase/firebase'

class UserAuthentication extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      error: false
    }
    this.firebase = new Firebase();
    this.signUpHandler = this.signUpHandler.bind(this);
    this.signInHandler = this.signInHandler.bind(this);
    this.emailInputChanged = this.emailInputChanged.bind(this);
    this.passwordInputChanged = this.passwordInputChanged.bind(this);
  }

  signUpHandler() {
    this.firebase.doCreateUserWithEmailAndPassword(this.state.email, this.state.password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(error.message);
    // ...
    }).then(()=>{console.log("success")}, (error)=>{console.log(error.message)});
  }

  signInHandler() {
    this.firebase.doSignInWithEmailAndPassword(this.state.email, this.state.password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(error.message);
    // ...
    }).then(()=>{console.log("success")}, (error)=>{console.log(error.message)});
  }

  emailInputChanged(event) {
    this.setState( {
      email: event.target.value
    });
  }

  passwordInputChanged(event) {
    this.setState( {
      password: event.target.value
    });
  }


  render() {
    return (
      <div className={styles.container}>
        <Form>
          <Form.Field>
            <label>email</label>
            <input placeholder='email' onChange={this.emailInputChanged}/>
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <input placeholder='password' onChange={this.passwordInputChanged}/>
          </Form.Field>
          <Form.Field>
            <Checkbox label='I agree to the Terms and Conditions' />
          </Form.Field>
          <Button type='submit' onClick={this.signUpHandler}>Sign Up</Button>
          <Button type='submit' onClick={this.signInHandler}>Sign In</Button>
        </Form>
      </div>
    );
  }



}

export default UserAuthentication;
