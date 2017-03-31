import React, { Component } from 'react';
import '../public/css/login.css';
import { browserHistory } from 'react-router';
import { Button, Row, Input, Navbar, NavItem, Footer } from 'react-materialize';
import axios from 'axios';
import cookie from 'react-cookie';


class login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      emailid: '',
      password:'',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

  }

  handleSubmit(event){

    axios.post('http://localhost:8000/login', {
      user: this.state,
    })
  .then(function (response) {
    console.log("cccccc",response.data.id)
    cookie.save(response.data.id, 'userid:'+ response.data.id, { path: '/' })
    if (response.data.id) {
      browserHistory.push("/header/" + response.data.id)
    } else {
      browserHistory.push("/login")
    }
  })
  .catch(function (error) {
    console.log(error);
  });

  event.preventDefault(event);
  this.setState({
    showComponent: true,
  });


  }

  handleInputChange(event){
    this.setState({
      [event.target.name]: event.target.value
    });
  }



  render() {
    console.log("------------->>>>>",this.state);
    let emailerr='', passworderr='';
    return (
      <div className="site">
        <Navbar brand='Twitter' right className="indigo">
          <NavItem href='login'>Login</NavItem>
          <NavItem href='signup'>SignUp</NavItem>
        </Navbar>
        <div className="wrapper site-content">
        <form onSubmit={this.handleSubmit} className="loginform">
          <h3 className="indigo-text text-darken-2">Please Login</h3><br/><br/>
            <Row>
              <Input
                s={12}
                label="Email Id"
                className="validate"
                type="email"
                name="emailid"
                required
                onChange={this.handleInputChange}
                id="email"
              />
            </Row>
            <Row>
              <Input
                s={12}
                label="Password"
                className="validate"
                type="password"
                name="password"
                required
                onChange={this.handleInputChange}
                id="password"
              />

            </Row>
            <Button
              className="waves-effect waves-light indigo btn btn-block"
              type="submit"
            >Login</Button>
            <br/>
            <br/>
            <br/>
          </form>
        </div>
        <Footer copyrights="&copy; 2015 Developed By Riddhi Gohel" className="indigo">
        </Footer>
      </div>

    );
  }
}

export default login;


