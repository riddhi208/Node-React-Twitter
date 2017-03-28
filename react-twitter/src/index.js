import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import '../public/css/index.css';
import login from './login';
import signup from './signup';
import header from './header';
import profile from './profile';
import updateprofile from './updateprofile';
import morefriends  from './morefriends';
import { Router, Route, browserHistory} from 'react-router';

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="/login" component={login}/>
      <Route path="/signup" component={signup}/>
    </Route>
    <Route path="/header/:id" component={header}/>
    <Route path="/profile/:id" component={profile}/>
    <Route path="/updateprofile/:id" component={updateprofile}/>
    <Route path="/morefriends/:id" component={morefriends}/>
  </Router>
  ),document.getElementById('root'));
