import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'

import logo from './logo.svg';
import './App.css';

import MainPage from './pages/Main';
import UserPage from './pages/User';
import UploadPage from './pages/Upload';
import PreprocessPage from './pages/Preprocess';
import PageNotFound from './pages/PageNotFound';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path='/' component={MainPage}/>
          <Route exact path='/u/:user' component={UserPage}/>
          <Route exact path='/u/:user/upload' component={UploadPage}/>
          <Route exact path='/u/:user/preprocess' component={PreprocessPage}/>
          <Route path="*" component={PageNotFound} />
        </Switch>
      </div>
    );
  }
}

export default App;
