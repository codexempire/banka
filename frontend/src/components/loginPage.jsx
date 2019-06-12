import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class LoginPage extends Component {
  render () {
    return (
      <div>
        <header class="header grid-l">
          <div class="container">
            <h1>MyBanka</h1>
          </div>
        </header>
        <div className="back" />
        <section class="grid">
          <div class="container">
            <div className="form-card">
              <h3>LOGIN</h3>
              <div class="alert" />
              <form>
                <div class="alert" />
                <label>Email</label>
                <div class="form-group">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    autoComplete="off"
                  />
                </div>
                <label>Password</label>
                <div class="form-group">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    autoComplete="off"
                  />
                </div>
                <div class="form-group">
                  <button type="button" class="btn btn-green" id="login">
                    Login
                  </button>
                </div>
              </form>
              <p class="tip">
                Dont have an account <Link to="/signup">Signup</Link>
              </p>
            </div>
          </div>
        </section>
        <footer>
          Copyright © 2019<br /> Made by Princewill Michael
        </footer>
      </div>
    );
  }
}

export default LoginPage;
