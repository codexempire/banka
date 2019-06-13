import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class LandingPage extends Component {
  paragraphStyle = {
    fontFamily: 'cursive',
  };
  render () {
    return (
      <main>
        <header className="grid head">
          <div className="image" />
          <div className="container">
            <h1>MyBanka</h1>
            <p style={this.paragraphStyle}> A bank you can trust...</p>
            <Link to="/login" className="btn btn-purple">Login</Link>
            <Link to="/signup" className="btn btn-border-y">Signup</Link>
          </div>
        </header>
      </main>
    );
  }
}

export default LandingPage;
