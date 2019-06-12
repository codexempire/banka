import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import LandingPage from './components/landingPage';
import LoginPage from './components/loginPage';
import SignupPage from './components/signupPage';
import './MyStyles.css';

class App extends Component {
  render () {
    return (
      <React.Fragment>
        <Router>
          <Switch>
            <Route path="/" exact component={LandingPage} />
            <Route path="/login" exact component={LoginPage} />
            <Route path="/signup" exact component={SignupPage} />
          </Switch>
        </Router>
      </React.Fragment>
    );
  }
}

export default App;
