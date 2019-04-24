import { Button, Form, Message} from 'semantic-ui-react';
import React, { Component } from 'react';
import styles from './Sign_in.module.scss';
import { authentication } from '../Utils/Firebase/firebase';

class UserAuthentication extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      error: false,
      errorMsg: ""
    };
    this.errorMessage = '';
    this.signUpHandler = this.signUpHandler.bind(this);
    this.signInHandler = this.signInHandler.bind(this);
    this.emailInputChanged = this.emailInputChanged.bind(this);
    this.passwordInputChanged = this.passwordInputChanged.bind(this);
  }

  signUpHandler() {
    authentication.createUserWithEmailAndPassword(this.state.email, this.state.password).then(function(user){
      this.props.history.push('/CreateListing');
    }).catch((error)=> {
    // Handle Errors here.
    this.setState({error:true, errorMsg: error.message});
    console.log(error.message);
    // ...
    });
  }

  signInHandler() {
    authentication.signInWithEmailAndPassword(this.state.email, this.state.password).then((user)=>{
      console.log("success");
      this.props.history.push('/CreateListing');
    }).catch((error)=> {
    // Handle Errors here.
    this.setState({error:true, errorMsg: error.message});
    console.log(error.message);
    // ...
    });
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
    var errorMessage = (  <Message
        header='Action Forbidden'
        content={this.state.errorMsg}
      />);

    return (
      <div className={styles.container}>
        <Form>
          <Form.Field>
            <label>email</label>
            <input placeholder='email' onChange={this.emailInputChanged}/>
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <input type= 'password' placeholder='password' onChange={this.passwordInputChanged}/>
          </Form.Field>
          <Button type='submit' onClick={this.signUpHandler}>Sign Up</Button>
          <Button type='submit' onClick={this.signInHandler}>Sign In</Button>
          {this.state.error ? errorMessage : null}
        </Form>
      </div>
    );
  }



}

export default UserAuthentication;
