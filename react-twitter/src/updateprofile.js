import React, { Component } from 'react';
import '../public/css/App.css';
import '../public/css/header.css';
import { Navbar, NavItem, Icon, Modal, Button, Input, Col, Row } from 'react-materialize';
import axios from 'axios';
import { browserHistory } from 'react-router';


class updateprofile extends Component {
  constructor(props){
    super(props);
    this.state={
      fullname: '',
      emailid: '',
      password:'',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  handleSubmit(event) {
    alert('A Name was submitted: '+this.state.fullname +'\n');
    const userid = this.props.params.id;
    axios.post('http://localhost:8000/updateprofile/'+userid,
      {data: this.state,})

    .then(function (response) {
      console.log("....",response.data);

    })
    .catch(function (error) {
      console.log(error);
    });
    event.preventDefault(event);
  }

  handleDelete(event) {
    alert(this.state.fullname +'\n'+'Are you want to sure delete this account???: ');
    const userid = this.props.params.id;
    console.log(".,,,",userid);
    axios.get('http://localhost:8000/deleteaccount/'+ userid,
      {data: this.state,})

    .then(function (response) {
      console.log("....",response.data);
      if (response.data.userid) {
        browserHistory.push("/login")
      } else {
          browserHistory.push("/header/" + response.data.userid)
      }

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
    const a = this.state;
    console.log("????",a);
    const profileroute = `/profile/${ this.props.params.id }`;
    const homeroute = `/header/${ this.props.params.id }`;
    return (
      <div>
        <Navbar brand='Twitter' right className="indigo">
          <NavItem href={homeroute}>
            <Icon>home</Icon>
          </NavItem>
            <Modal
              header=''
              trigger={
                <NavItem>
                  <Icon>mode_edit</Icon>
                </NavItem>
              }>
              <Input
                name="tweet"
                placeholder="Whats going on???"
                maxLength="140"
                required="required"/>
              <form
                onSubmit={this.onTweet}
                encType="multipart/form-data"
                method="POST" action="/tweet">
                <Button
                  type="submit"
                  className="indigo"
                  id="tweetbtn">Tweet
                </Button>
              </form>
            </Modal>
          <NavItem href={profileroute}>
              <Icon>face</Icon>
          </NavItem>
          <NavItem href='/login' onSubmit={this.handleLogout}><Icon>input</Icon></NavItem>
        </Navbar>
        <div className="container signupform">
        <form onSubmit={this.handleSubmit}>
          <br />
          <h4 className="indigo-text text-darken-2">Update Profile</h4>
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
          <br />
          <br />
        </form>
        <form onSubmit={this.handleDelete}>
        <Button
          name="submit"
          type="submit"
          className="red"
        >Delete Account
        </Button>
        </form>
      </div>
    </div>

    );
  }
}

export default updateprofile;
