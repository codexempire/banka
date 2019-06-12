import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class SignupForm extends Component {
  console = () => {
    console.log ('The signup button has been clicked');
    return;
  };
  render () {
    return (
      <section className="grid">
        <div className="container">
          <div className="form-card">
            <h3>SIGNUP</h3>
            <div className="alert" />
            <form>
              <div id="input-half">
                <label>Firstname</label>
                <div className="form-group">
                  <input type="text" className="form-control" id="firstName" />
                </div>
              </div>
              <div id="input-half">
                <label>Lastname</label>
                <div className="form-group">
                  <input type="text" className="form-control" id="lastName" />
                </div>
              </div>
              <label>Email</label>
              <div className="form-group">
                <input type="email" className="form-control" id="email" />
              </div>
              <label>Password</label>
              <div className="form-group">
                <input type="password" className="form-control" id="password" />
              </div>
              <div className="form-group">
                <button
                  type="button"
                  className="btn btn-green"
                  id="signup"
                  onClick={this.console}
                >
                  Create
                </button>
              </div>
            </form>
            <p className="tip">
              Already registered <Link to="/login">Log in</Link>
            </p>
          </div>
        </div>
      </section>
    );
  }
}

export default SignupForm;
