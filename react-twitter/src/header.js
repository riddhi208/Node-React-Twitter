import React, { Component } from 'react';
import { Navbar, NavItem, Icon, Collection, CollectionItem, Badge, Modal,Footer, Button, Input, Col, Row, CardPanel, Card, CardTitle } from 'react-materialize';
import { browserHistory } from 'react-router';
import cookie from 'react-cookie';
import axios from 'axios';
import '../public/css/App.css';
import '../public/css/header.css';

class header extends Component {
  constructor(props){
    super(props);
    this.state={
      data:'',

    };
    this.onTweet = this.onTweet.bind(this);
    this.handleFollow = this.handleFollow.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  componentWillMount() {

    let userId = this.props.params.id;
    console.log(userId)
    if(cookie.load(userId)){
      axios.get('http://localhost:8000/header/' + userId)
      .then(res => {

        const data= res.data;
        this.setState({
          data: data,
        });
        console.log("-------", res.data);
      });
    }
    console.log("1!!!!!1", userId);
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
      cookie.remove('id', { path: '/' });
      browserHistory.push('/login');
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
    event.preventDefault(event);
  }

  handleFollow(id) {

    let userid = this.props.params.id;
    console.log("follower-------",userid);

    axios.post('http://localhost:8000/follow',
      {
        data: this.state,
        myfollow: id,
      })

    .then(function (response) {
      if (response.data.userid) {
        browserHistory.push("/header/"+ response.data.userid)
      } else {
          browserHistory.push("/header/" + response.data.userid)
      }
    })
    .then(function(response) {
      location.reload();
    })
    .catch(function (error) {
      console.log(error);
    });
    event.preventDefault(event);
  }

  onTweet(event) {
    let userid = this.props.params.id;
    axios.post('http://localhost:8000/tweet',
      {data: this.state,})

    .then(function (response) {
      location.reload();
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
    event.preventDefault(event);

  }

  render() {
    console.log("------------->>>>>",this.state);
    var tweet = [];
    if(this.state.data.tweets) {
      console.log("for loop........");
      for (var i = 0; i < this.state.data.tweets.length ; i++) {
        console.log("for loop........");
        if(this.state.data.tweets[i].t_image) {
          console.log(this.state.data.tweets[i].t_image,"=======");

          tweet.push(

            <div key={i}>
            <CardPanel className="grey lighten-4 black-text">
              <Row>
                <Col s={3}>
                  <img src={ require(`../public/images/1942115a9fe6f41361e4b43ac648b25d`)}
                  alt="sss"
                  height="50px"
                  width="50px"
                  className=""/>
                </Col>
                <Col s={3}>
                <a className="tweetName"> {this.state.data.tweets[i].fullname}</a>
                </Col>
              </Row>
                <div className="tweetText"> {this.state.data.tweets[i].t_tweetText} </div>
                <br />
            </CardPanel>
            </div>
          );
        } else {
          tweet.push(
            <div key={i}>
            <CardPanel className="grey lighten-4 black-text">
              <Row>
                <Col s={3}>
                  <img src={ require(`../public/images/1942115a9fe6f41361e4b43ac648b25d`)}
                  alt="sss"
                  height="50px"
                  width="50px"
                  className=""/>
                </Col>
                <Col s={3}>
                <a href="/profile" className="tweetName"> {this.state.data.tweets[i].fullname}</a>
                </Col>
              </Row>
              <div className="tweetText"> {this.state.data.tweets[i].t_tweetText}
              </div>

            </CardPanel>
            </div>
          );
        }
      }
    }
      var follower = [];
      if(this.state.data.follow) {
         for ( i = 0; i < this.state.data.follow.length ; i++) {
          if(this.state.data.follow) {
            let a = this.state.data.follow[i].id;
            console.log("///",this.state.data.follow[i].userid);

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
                        onClick={this.handleFollow.bind(this, a)}
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

      var name = [];
      if(this.state.data.username) {
        name.push(
        <div key={i}>
          <a href="profile" className="tweetName"> {this.state.data.username[0].fullname}</a>
        </div>
      );
     }

    const homeroute = `/header/${ this.props.params.id }`;
    const updateroute = `/updateprofile/${ this.props.params.id }`;
    const profileroute = `/profile/${ this.props.params.id }`;
    const morefriendsroute = `/morefriends/${ this.props.params.id }`;

    return (
      <div className="site">
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
              <form
                onSubmit={this.onTweet}>
              <Input
                name="tweet"
                placeholder="Whats going on???"
                maxLength="140"
                onChange={this.handleInputChange}
                required="required"/>

              <Input
                name="imageTweet"
                type="file"
                onChange={this.handleInputChange}
              />
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

        <div className="container site-content">
          <Row key={i}>
            <Col s={3} key={i}>
            <br/>
            <h5 className="indigo-text"><Icon>perm_identity</Icon>My Profile</h5>
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
              <br/>
              <Collection>
                <CollectionItem href="#!">
                  Tweets <Badge newIcon className="indigo">{this.state.data.count1}</Badge>
                </CollectionItem>
                <CollectionItem href="#!">
                  Followers <Badge newIcon className="indigo">{this.state.data.count}</Badge>
                </CollectionItem>
                <CollectionItem href="#!">
                  Likes <Badge newIcon className="indigo">4</Badge>
                </CollectionItem>

              </Collection>
            </Col>

            <Col s={12} m={6}>
            <br/>
            <h5 className="indigo-text"><Icon>mode_edit</Icon>Tweets</h5>
              {tweet}
            </Col>

            <Col s={12} m={3}>
            <br/>
            <h5 className="indigo-text"><Icon>person_pin</Icon>Who to Follow</h5>

              {follower}
              <form action={morefriendsroute}>
                <Button className="blue">More Friends</Button>
              </form>
            </Col>
          </Row>
        </div>
        <Footer copyrights="&copy; 2015 Developed By Riddhi Gohel" className="indigo">
        </Footer>
      </div>
    );
  }
}

export default header;
