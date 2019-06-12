import React, {Component} from 'react';
import LoginForm from './loginForm';
import Header from './header';
import Footer from './footer';

class LoginPage extends Component {
  render () {
    return (
      <React.Fragment>
        <Header />
        <div className="back" />
        <LoginForm />
        <Footer />
      </React.Fragment>
    );
  }
}

export default LoginPage;
