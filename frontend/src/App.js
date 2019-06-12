import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import LandingPage from './components/landingPage';
import LoginPage from './components/loginPage';
import './MyStyles.css';

class App extends Component {
  render () {
    return (
      <div>
        <Router>
          <Switch>
            <Route path="/" exact component={LandingPage} />
            <Route path="/login" exact component={LoginPage} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
