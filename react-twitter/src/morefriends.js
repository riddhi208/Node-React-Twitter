import React, { Component } from 'react';
import '../public/css/App.css';
import '../public/css/header.css';
import { Navbar, NavItem, Icon, Modal, Button, Input, Col, Row, CardPanel, Card, CardTitle } from 'react-materialize';
import axios from 'axios';
import { browserHistory } from 'react-router';
import cookie from 'react-cookie';

class morefriends extends Component {
  constructor(props){
    super(props);
    this.state={
      data:'',

    };
    //
     this.handleFollow = this.handleFollow.bind(this);
     this.handleLogout = this.handleLogout.bind(this);
  }
  handleMount(){
    let userId = this.props.params.id;
    console.log("1!!!!!1", userId);
    if(cookie.load(this.props.params.id)) {
      axios.get('http://localhost:8000/morefriends/' + userId)
      .then(res => {

        const data= res.data;
        this.setState({
          data: data
        });
        console.log("-------", res.data);
      });
    } else {
      browserHistory.push('/login');
    }
  }
  componentWillMount() {
    this.handleMount();
  }

  handleFollow(id) {
    let self = this;
    let userid = this.props.params.id;
    console.log("follower-------",userid);

    axios.post('http://localhost:8000/follow',
      {
        data: this.state,
        myfollow: id,
      })

    .then(function (response) {
      if (response.data.userid) {
        console.log("..]]]]]",response.data.userid);
        browserHistory.push("/header/"+ response.data.userid)
      } else {
          browserHistory.push("/header/" + response.data.userid)
      }
    })
    .then(function(response) {
      self.handleMount();

    })
    .catch(function (error) {
      console.log(error);
    });
    event.preventDefault(event);
  }

  handleLogout(event) {
    alert('A logout was submitted: '+this.state.fullname +'\n');
    let userid = this.props.params.id;
    axios.get('http://localhost:8000/logout',
      {
        user: this.state,
      })

    .then(function (response) {
      cookie.remove('userid', { path: '/' });
      browserHistory.push('/login');
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
    event.preventDefault(event);
  }


  render() {
    var name = [];
      if(this.state.data.username) {
        name.push(
        <div key={i}>
          <a href="profile" className="tweetName"> {this.state.data.username[0].fullname}</a>
        </div>
      );
     }
    var follower = [];
      if(this.state.data.follow) {
        for (var i = 0; i < this.state.data.follow.length ; i++) {
          if(this.state.data.follow) {
            let a = this.state.data.follow[i].id;
            follower.push(
              <div key={i}>
                <CardPanel className="grey lighten-4 black-text">
                  <Row>
                    <Col s={4.5}>
                      <img name="profile"
                        src={require(`../public/images/f99903e47077c0d6d40e5eee4c39151c`)}
                        alt="www"
                        height="100px"
                        width="100px"
                      />
                    </Col>

                    <Col s={3}>
                      <h5>{this.state.data.follow[i].fullname}</h5>
                      <Input
                        type="hidden"
                        name="myfollow"
                        value={a}/>
                      <Button
                        onClick={ (event) => {
                          this.handleFollow(a);
                          event.preventDefault();
                        }}
                        type="submit"
                        value="Follow"
                        id={a}
                        className="btn-sm btn-info waves-effect waves-light">Follow
                      </Button>
                    </Col>
                  </Row>
                </CardPanel>
              </div>
            );
          }
        }
      }
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
                >
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
          <NavItem href={this.handleLogout}><Icon>input</Icon></NavItem>
        </Navbar>

        <div className="container">
        <Row>
          <Col s={3} key={i}>
            <Card className='small' key={i}
              header={
                <CardTitle key={i}
                  image={require(`../public/images/f99903e47077c0d6d40e5eee4c39151c`)}>
                </CardTitle>
              }
              actions={
                [
                  <div key={i}>
                    <p>{name}</p>
                  </div>
                ]
              }>

            </Card>
          </Col>

          <Col s={3}>
            <h5 className="indigo-text">More Friends</h5>

                {follower}

          </Col>
          </Row>

      </div>
    </div>

    );
  }
}

export default morefriends;
