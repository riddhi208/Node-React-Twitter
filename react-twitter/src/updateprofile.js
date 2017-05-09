import React, { Component } from 'react';
import '../public/css/App.css';
import '../public/css/header.css';
import { Navbar, NavItem, Icon, Modal, Button, Input, Col, Row, Footer } from 'react-materialize';
import axios from 'axios';
import cookie from 'react-cookie';
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
    this.handleLogout = this.handleLogout.bind(this);
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

  handleLogout(event) {
    alert('A logout was submitted: '+this.state.fullname +'\n');
    let userid = this.props.params.id;
    axios.get('http://localhost:8000/logout',
      {
        user: this.state,
      })

    .then(function (response) {
      cookie.remove('this.props.params.id', { path: '/' });
      browserHistory.push('/login');
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
    event.preventDefault(event);
  }

  render() {
    const a = this.state;
    console.log("????",a);
    const profileroute = `/profile/${ this.props.params.id }`;
    const homeroute = `/header/${ this.props.params.id }`;
    return (
      <div className="site">
        <Navbar brand='Twitter' right className="indigo">
          <NavItem href={homeroute}>
            <Icon>home</Icon>
          </NavItem>
          <Modal
            header='Express Your mood...'
            trigger={
              <NavItem>
                <Icon>mode_edit</Icon>
              </NavItem>
            }>
            <form
              onSubmit={ (event) => {
                 this.onTweet();
                 event.preventDefault();
               }}>
              <br/>
              <Input
                name="tweet"
                placeholder="Whats going on???"
                maxLength="140"
                onChange={this.handleInputChange}
                />

              <Button
                name="imageTweet"
                type="file"

              >Upload</Button>
              <br/>
              <Button
                type="submit"
                // className="indigo"
                className="modal-action modal-close indigo"
                id="tweetbtn">Tweet
              </Button>
            </form>
          </Modal>
          <NavItem href={profileroute}>
              <Icon>face</Icon>
          </NavItem>
          <NavItem href={this.handleLogout}><Icon>input</Icon></NavItem>
        </Navbar>

        <div className="container updateform site-content">
        <form onSubmit={this.handleSubmit}>
          <br />
          <h4 className="indigo-text text-darken-2">Update Profile</h4>
          <br/>
          <Row>
            <Input
              s={12}
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
            s={12}
            type="email"
            name="emailid"
            label="Email Id"
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
          >Submit
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
      <Footer copyrights="&copy; 2015 Developed By Riddhi Gohel" className="indigo">
      </Footer>
    </div>

    );
  }
}

export default updateprofile;
