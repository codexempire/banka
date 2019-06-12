import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class LandingPage extends Component {
  paragraphStyle = {
    fontFamily: 'cursive',
  };
  render () {
    return (
      <main>
        <header class="grid head">
          <div class="image" />
          <div class="container">
            <h1><strong>M</strong><i>y</i><strong>B</strong><i>anka</i></h1>
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
