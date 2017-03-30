import React, { Component } from 'react';
import '../public/css/App.css';
import { Navbar, NavItem, Footer } from 'react-materialize';


class App extends Component {
  render() {
    return (
      <div className="site">
        <Navbar brand='Twitter' right className="indigo">
          <NavItem href='login'>Login</NavItem>
          <NavItem href='signup'>SignUp</NavItem>
        </Navbar>
        <div className="site-content paragraph">
        <h1 id="title" className="indigo-text text-darken-2"> Welcome to Twitter!!!</h1>
        <br />
        <h4 className="indigo-text"> Be connected with your favourite ones...</h4>
        <br/>
        <h4 className="indigo-text"> Social Media</h4>
        <h4 className="indigo-text"> Online Platform</h4>
        </div>
        <Footer copyrights="&copy; 2015 Developed By Riddhi Gohel" className="indigo">
        </Footer>
        {this.props.children}
      </div>
    );
  }
}

export default App;
