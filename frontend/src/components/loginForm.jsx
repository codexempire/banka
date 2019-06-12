import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class LoginForm extends Component {
  render () {
    return (
      <section className="grid">
        <div className="container">
          <div className="form-card">
            <h3>LOGIN</h3>
            <div className="alert" />
            <form>
              <div className="alert" />
              <label>Email</label>
              <div className="form-group">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  autoComplete="off"
                />
              </div>
              <label>Password</label>
              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  autoComplete="off"
                />
              </div>
              <div className="form-group">
                <button type="button" className="btn btn-green" id="login">
                  Login
                </button>
              </div>
            </form>
            <p className="tip">
              Dont have an account <Link to="/signup">Signup</Link>
            </p>
          </div>
        </div>
      </section>
    );
  }
}

export default LoginForm;
