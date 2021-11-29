import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState, Suspense } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import MainPage from "./components/main/mainPage.js";

function App() {
  return (
      <Router>
        <Switch>
          <Route exact path="/" component={MainPage} />
          {/* <Route exact path="/results" component={}/> */}
        </Switch>
      </Router>
  );
}

export default App;
