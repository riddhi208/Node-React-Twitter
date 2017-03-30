import React, { Component } from 'react';
import '../public/css/App.css';
import '../public/css/header.css';
import { Navbar, NavItem, Icon, Modal, Button, Input, Col, Row, CardPanel, Card, CardTitle } from 'react-materialize';
import axios from 'axios';


class morefriends extends Component {
  constructor(props){
    super(props);
    this.state={
      data:'',

    };
    // this.onTweet = this.onTweet.bind(this);
  }
  componentWillMount() {
    let userId = this.props.params.id;
    console.log("1!!!!!1", userId);
    axios.get('http://localhost:8000/morefriends/' + userId)
    .then(res => {

      const data= res.data;
      this.setState({
        data: data
      });
      console.log("-------", data);
      console.log("-------", res.data.follow[1]);
    });

  }
  render() {
    var name = [];
      if(this.state.data.count) {
        name.push(
        <div key={i}>
          <a href="profile" className="tweetName"> {this.state.data.username[0].fullname}</a>
        </div>
      );
     }
    var follower = [];
      if(this.state.data.count) {
        for (var i = 0; i < this.state.data.follow.length ; i++) {
          if(this.state.data.follow) {
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

                    <Col s={2}>
                      <h5>{this.state.data.follow[i].fullname}</h5>
                      <form method="post" action="/follow">
                        <Input
                          type="hidden"
                          name="myfollow"/>
                        <Button
                          type="submit"
                          value="Follow"
                          className="btn-sm btn-info waves-effect waves-light">Follow</Button>
                      </form>
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
