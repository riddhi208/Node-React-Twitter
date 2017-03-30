import React, { Component } from 'react';
import { Navbar, NavItem, Icon, Modal, Button, Input, Col, Row, CardPanel, Footer, CardTitle, Card } from 'react-materialize';
import { browserHistory } from 'react-router';
import axios from 'axios';
import cookie from 'react-cookie';
import '../public/css/App.css';
import '../public/css/header.css';


class profile extends Component {

  constructor(props){
    super(props);
    this.state={
      data:'',

    };
    this.handleUnfollow = this.handleUnfollow.bind(this);
    this.onTweet = this.onTweet.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  handleMount(){
    if(cookie.load(this.props.params.id)) {
      let userId = this.props.params.id;
      console.log("1!!!!!1", userId);
      axios.get('http://localhost:8000/profile/' + userId)
      .then(res => {
        console.log("profilllll")
        const data= res.data;
        this.setState({
          data: data
        });
      });
    } else {
      browserHistory.push('/login');
    }
  }
  componentWillMount() {
    this.handleMount();
  }

  onTweet(event) {
    let self=this;
    let userid = this.props.params.id;
    axios.post('http://localhost:8000/tweet',
      {data: this.state,})

    .then(function (response) {
      self.handleMount();
      self.setStete({data:''});
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

  handleUnfollow(id) {
    let self=this;
    let userid = this.props.params.id;
    axios.post('http://localhost:8000/unfollow',
      {
        data: this.state,
        myfollow: id,
      })

    .then(function (response) {
      return false;
      if (response.data.followid) {
        browserHistory.push("/profile/" + response.data.followid)
      } else {
          browserHistory.push("/profile/" + response.data.followid)
      }
      console.log(response);
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
      cookie.remove('id', { path: '/' });
      browserHistory.push('/login');
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
    event.preventDefault(event);
  }


  render() {

    console.log("------------->>>>>",this.state.data);
    console.log("------------->>>>>",this.state.data.count);
    var tweet = [];
    if(this.state.data.count) {
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
                <a href="#" className="tweetName"> {this.state.data.tweets[i].fullname}</a>
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
                <a href="#" className="tweetName"> {this.state.data.tweets[i].fullname}</a>
                </Col>
              </Row>
              <div className="tweetText"> {this.state.data.tweets[i].t_tweetText}
              </div>
              <br />
              </CardPanel>
            </div>
          );
        }
      }
    }
    var follower = [];
    if(this.state.data.count) {
       for ( i = 0; i < this.state.data.follow.length ; i++) {
        if(this.state.data.follow) {
          let a = this.state.data.follow[i].f_followerid;
            console.log("///",this.state.data.follow[i].f_followerid);
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
                      this.handleUnfollow(a);
                      event.preventDefault();
                    }}
                    type="submit"
                    value="Unfollow"
                    id={a}
                    className="btn-sm btn-info waves-effect waves-light">Unfollow
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
    if(this.state.data.count) {
      name.push(
      <div key={i}>
        <a href="#" className="tweetName"> {this.state.data.username[0].fullname}</a>
      </div>
    );
   }
   const profileroute = `/profile/${ this.props.params.id }`;
   const homeroute = `/header/${ this.props.params.id }`;
   const updateprofileroute = `/updateprofile/${ this.props.params.id }`;

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
              onSubmit={ (event) => {
                 this.onTweet(event);
                 event.preventDefault();
               }}>
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
          <Row>
            <Col s={3}>
              <h5 className="indigo-text">
              <br/>
                <Icon>perm_identity</Icon>My Profile
              </h5>
              <Card className='small'
                header={
                  <CardTitle
                    image={require(`../public/images/f99903e47077c0d6d40e5eee4c39151c`)}>
                  </CardTitle>
                }
                actions={
                  [
                    <div>
                      <a href="#">{name}</a>
                      <a href={updateprofileroute}>
                        <Icon>mode_edit</Icon>
                      </a>
                    </div>
                  ]
                }>

              </Card>
            </Col>

            <Col s={12} m={5}>
            <br/>
            <h5 className="indigo-text"><Icon>mode_edit</Icon>Tweets</h5>
                    {tweet}

            </Col>
            <Col s={12} m={4}>
            <br/>
            <h5 className="indigo-text"><Icon>person_pin</Icon>Who to Follow</h5>
                  {follower}

            </Col>
          </Row>
        </div>
        <Footer copyrights="&copy; 2015 Developed By Riddhi Gohel" className="indigo">
        </Footer>
      </div>
    );
  }
}

export default profile;
