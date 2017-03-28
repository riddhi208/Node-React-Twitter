import React, { Component } from 'react';
import '../public/css/signup.css';
import {  } from 'react-router';
import { Button, Row, Input } from 'react-materialize';
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

      <div className="container signupform">
        <div className="wrapper">
        <form onSubmit={this.handleSubmit}>
          <h4 className="indigo-text text-darken-2">Create New One!!!</h4>
          <br/>
          <Row>
            <Input
              s={6}
              type="text"
              name="fullname"
              label="name"
              onChange={this.handleInputChange}
              minLength="3"
              required
            />
          </Row>
          <Row>
          <Input
            s={6}
            type="email"
            name="emailid"
            label="Email Id"
            onChange={this.handleInputChange}
            required
          />
          </Row>
          <Row>
          <Input
            s={6}
            type="password"
            label="Password"
            name="password"
            onChange={this.handleInputChange}
            minLength="1"
            required
          />
          </Row>
          <Row>
          <Input
            s={6}
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
        </form>
      </div>
    </div>
    );
  }
}

export default signup;


