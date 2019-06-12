import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import LandingPage from './components/landingPage';
import './MyStyles.css';

class App extends Component {
  render () {
    return (
      <div>
        <Router>
          <Switch>
            <Route path="/" exact component={LandingPage} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
