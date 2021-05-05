import React from "react";
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from "react-router-dom";
import Cookies from 'js-cookie';
import Dashboard from './Dashboard';
import Login from './Login';
import Signup from './Signup';



const isAnon = (Component) => () => {
  return Cookies.get('auth_token') ? (
    <Component />
  ) : (
    <Redirect to="/login" />
  );
};

const isLoggedIn = () => () => {
  return Cookies.get('auth_token') ? (
    <Redirect to="/" />
  ) : (
    <Login />
  );
};

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/login" render={ isLoggedIn() } />
      <Route exact path="/signup"> <Signup /> </Route>
      <Route exact path="/logout" >
				<Redirect to="/login" />
			</Route>
      <Route path="/" render={ isAnon(Dashboard) } />
      
    </Switch>
  </Router>
);

export default App;