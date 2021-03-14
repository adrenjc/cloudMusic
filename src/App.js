import React, { Component } from 'react';
import Top from './component/Top/index';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import NormalLoginForm from './login/index.js';

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/App" component={Top}></Route>
          <Route path="/login" component={NormalLoginForm}></Route>
          <Redirect to="/login" />
        </Switch>
      </BrowserRouter>
    );
  }
}
