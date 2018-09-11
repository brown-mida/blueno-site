import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import './App.css';

import MainPage from './pages/Main';
import UserPage from './pages/User';
import UploadPage from './pages/Upload';
import PreprocessPage from './pages/Preprocess';
import AnnotatePage from './pages/Annotate';
import AnnotateOnePage from './pages/AnnotateOne';
import TrainPage from './pages/Train';
import ElvoTrainPage from './pages/ElvoTrain';
import PageNotFound from './pages/PageNotFound';

class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={MainPage} />
          <Route exact path="/u/:user" component={UserPage} />
          <Route exact path="/u/:user/upload" component={UploadPage} />
          {/* TODO: Dataset id for these pages */}
          <Route exact path="/u/:user/preprocess" component={PreprocessPage} />
          <Route exact path="/u/:user/annotate" component={AnnotatePage} />
          <Route
            exact
            path="/u/:user/annotate/:group"
            component={AnnotatePage}
          />
          <Route
            exact
            path="/u/:user/annotate/:group/:id"
            component={AnnotateOnePage}
          />
          <Route exact path="/u/:user/train" component={TrainPage} />
          <Route exact path="/trainer" component={ElvoTrainPage} />
          <Route path="*" component={PageNotFound} />
        </Switch>
      </div>
    );
  }
}

export default App;
