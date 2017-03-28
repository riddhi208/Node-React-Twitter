import React, { Component } from 'react';
import '../public/css/login.css';
import { browserHistory } from 'react-router';
import { Button, Row, Input } from 'react-materialize';
import axios from 'axios';
import cookie from 'react-cookie';

// let request = axios.create({
//   withCredentials: true,
//   baseURL: 'http://localhost:8000/'
// });

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
      userdata: this.state,
    })
  .then(function (response) {
    console.log("cccccc",response.data.id)
    cookie.save(response.data.id, 'userid:'+ response.data.id, { path: '/header' })
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
    return (
      <div className="container loginform">
        <div className="wrapper">
        <form onSubmit={this.handleSubmit}>
          <h3 className="indigo-text text-darken-2">Please Login</h3><br/><br/>
            <Row>
              <Input
                s={6}
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
                s={6}
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
      </div>

    );
  }
}

export default login;


