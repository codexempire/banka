import React, {Component} from 'react';
import Header from './header';
import Footer from './footer';
import SignupForm from './signupForm';

class SignupPage extends Component {
  render () {
    return (
      <React.Fragment>
        <Header />
        <div className="back" />
        <SignupForm />
        <Footer />
      </React.Fragment>
    );
  }
}

export default SignupPage;
