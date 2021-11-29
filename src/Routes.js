import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
    Routes,
  Route,
} from 'react-router-dom';
import MainPage from './components/main/mainPage'

class RoutePage extends React.Component {
    render() {
        console.log("hellooo")
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={MainPage} />
                </Switch>
            </Router>
        )
    }
}

export default RoutePage;