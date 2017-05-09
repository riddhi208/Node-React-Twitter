import React, { Component } from 'react';
import '../public/css/signup.css';
import {  } from 'react-router';
import { Button, Row, Input, Footer, NavItem, Navbar } from 'react-materialize';
import axios from 'axios';
// let request = axios.create({
//   withCredentials: true,
//   baseURL: 'http://localhost:8000/'
// });
class signup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fullname: '',
      emailid: '',
      password:'',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

  }
  handleSubmit(event) {
    alert('A Name was submitted: '+this.state.fullname +'\n');

    axios.post('http://localhost:8000/register',
      {user: this.state,})

    .then(function (response) {

      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
    event.preventDefault(event);
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
    console.log("state---->", this.state);
  }

  render() {
    console.log(this.state);
    return (

      <div className="site">
        <Navbar brand='Twitter' right className="indigo">
          <NavItem href='login'>Login</NavItem>
          <NavItem href='signup'>SignUp</NavItem>
        </Navbar>
        <div className="wrapper site-content">
        <form onSubmit={this.handleSubmit} className="signupform">
          <h4 className="indigo-text text-darken-2">Create New One!!!</h4>
          <br/>
          <Row>
            <Input
              s={12}
              type="text"
              name="fullname"
              label="name"
              validate='true'
              onChange={this.handleInputChange}
              minLength="3"
              required
            />
          </Row>
          <Row>
          <Input
            s={12}
            type="email"
            name="emailid"
            label="Email Id"
            validate='true'
            onChange={this.handleInputChange}
            required
          />
          </Row>
          <Row>
          <Input
            s={12}
            type="password"
            label="Password"
            name="password"
            validate='true'
            onChange={this.handleInputChange}
            minLength="1"
            required
          />
          </Row>
          <Row>
          <Input
            s={12}
            type="file"
            name="file"
            onChange={this.handleInputChange}
          />
          </Row>
          <Button
            name="submit"
            type="submit"
            className="indigo"
          >SignUp
          </Button>
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

export default signup;


