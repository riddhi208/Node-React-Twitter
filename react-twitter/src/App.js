import React, { Component } from 'react';
import '../public/css/App.css';
import { Navbar, NavItem } from 'react-materialize';


class App extends Component {
  render() {
    return (
      <div>
        <Navbar brand='Twitter' right className="indigo">
          <NavItem href='login'>Login</NavItem>
          <NavItem href='signup'>SignUp</NavItem>
        </Navbar>
        {this.props.children}
      </div>
    );
  }
}

export default App;
