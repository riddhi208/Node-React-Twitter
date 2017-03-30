const should = require('should');

let request = require('supertest');
const app = require('../app');
// request = request('http://localhost:3000');

var user = {
  user: {
    id: 1,
    fullname: 'riddhi',
    emailid: 'riddhi@gmail.com',
    password: 'riddhi',
    image: 'twitter.jpg',
  },
  userdata:{
    id: 1,
    fullname: 'riddhi',
    emailid: 'riddhi@gmail.com',
    password: 'riddhi',
    image: 'twitter.jpg',
  },
  data: {
    t_tweetText: 'Hello world',
    t_time: 'now()',
    t_userid: '1',
    t_likeCount: '',
  },
  username: {
    id: 1,
  }
};
const follow = {
  data: {
  f_userid: '1',
  f_followerid: '1',
  },
};

describe('index', function () {
  describe('GET /', function () {
    it('should return a homepage', function (done) {
      request(app)
        .get('/')
        .expect('Content-type', 'text/html; charset=utf-8')
        .expect(200)
        .end(function (err, res) {
          res.status.should.be.equal(200);
          done();
        });
    });
  });
});
describe('GET /register', function () {
  it('should return registration page', function (done) {
    request(app)
      .get('/register')
      .expect('Content-type', 'text/html; charset=utf-8')
      .expect(200)
      .end(function (err, res) {
        res.status.should.be.equal(200);
        done();
      });
  });
});
describe('GET /login', function () {
  it('should return login page', function (done) {
    request(app)
      .get('/login')
      .expect('Content-type', 'text/html; charset=utf-8')
      .expect(200)
      .end(function (err, res) {
        res.status.should.be.equal(200);
        done();
      });
  });
});
describe('GET /logout', function () {
  it('should return login page', function (done) {
    request(app)
      .get('/logout')
      .expect('Content-type', 'text/html; charset=utf-8')
      .expect(200)
      .end(function (err, res) {
        res.status.should.be.equal(200);
        done();
      });
  });
});
describe('GET /index', function () {
  it('should return index page', function (done) {
    request(app)
      .get('/index')
      .expect('Content-type', 'text/html; charset=utf-8')
      .expect(200)
      .end(function (err, res) {
        res.status.should.be.equal(200);
        done();
      });
  });
});
describe('GET /header', function () {
  it('should return header', function (done) {
    request(app)
      .get('/header')
      .expect('Content-type', 'text/html; charset=utf-8')
      .expect(200)
      .end(function (err, res) {
        res.status.should.be.equal(200);
        done();
      });
  });
});
describe('GET /profile', function () {
  it('should return profile page', function (done) {
    request(app)
      .get('/profile')
      .expect('Content-type', 'text/html; charset=utf-8')
      .expect(200)
      .end(function (err, res) {
        res.status.should.be.equal(200);
        done();
      });
  });
});
describe('GET /updateprofile', function () {
  it('should return update profile page', function (done) {
    request(app)
      .get('/updateprofile')
      .expect('Content-type', 'text/html; charset=utf-8')
      .expect(200)
      .end(function (err, res) {
        res.status.should.be.equal(200);
        done();
      });
  });
});
describe('GET /deleteaccount', function () {
  it('it should response login page', function (done) {
    this.timeout(500);
    setTimeout(done, 300);
    request(app)
    .get('/deleteaccount')
    .expect(304)
    .end(function (err, res) {
      if (err) {
        done(err);
      } else {
        res.status.should.be.equal(304);
        done();
      }
    });
  });
});
describe('GET /resetpassword', function () {
  it('should return get password page', function (done) {
    request(app)
    .get('/resetpassword')
    .expect('Content-type', 'text/html; charset=utf-8')
    .expect(200)
    .end(function (err, res) {
      res.status.should.be.equal(200);
      done();
    });
  });
});
describe('GET /profilepictureupload', function () {
  it('it should response updateprofile page', function (done) {
    request(app)
      .get('/updateprofile')
      .expect(200)
      .end(function (err, res) {
        if (err) {
          done(err);
        } else {
          res.status.should.be.equal(200);
          done();
        }
      });
  });
});

describe('POST /register', function () {
  it('it should response login page', function (done) {
    request(app)
      .post('/register')
      .send(user)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          done(err);
        } else {
          res.status.should.be.equal(200);
          done();
        }
      });
  });
});
describe('POST /login', function () {
  it('it should response header page', function (done) {
    request(app)
      .post('/login')
      .send(user)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          done(err);
        } else {
          res.status.should.be.equal(200);
          done();
        }
      });
  });
});
describe('POST /tweet', function () {
  it('it should response header page', function (done) {
    request(app)
      .post('/tweet')
      .send(user)
      .expect(302)
      .end(function (err, res) {
        if (err) {
          done(err);
        } else {
          res.status.should.be.equal(302);
          done();
        }
      });
  });
});
describe('POST /profile', function () {
  it('it should response profile page', function (done) {
    const user = {
      t_tweetText: 'Hello world',
      t_time: 'now()',
      t_userid: '1',
      t_likeCount: '',
    };
    request(app)
      .post('/profile')
      .send(user)
      .expect(302)
      .end(function (err, res) {
        if (err) {
          done(err);
        } else {
          res.status.should.be.equal(302);
          done();
        }
      });
  });
});

describe('POST /follow', function () {
  it('it should response header page', function (done) {
    request(app)
      .post('/follow')
      .send(follow)
      .expect(302)
      .end(function (err, res) {
        if (err) {
          done(err);
        } else {
          res.status.should.be.equal(302);
          done();
        }
      });
  });
});

describe('POST /unfollow', function () {
  it('it should response login page', function (done) {
    this.timeout(500);
    setTimeout(done, 300);
    request(app)
    .post('/unfollow')
    .expect(302)
    .end(function (err, res) {
      if (err) {
        done(err);
      } else {
        res.status.should.be.equal(302);
        done();
      }
    });
  });
});

describe('POST /updateprofile', function () {
  it('it should response updtaeprofile page', function (done) {
    const user = {
      fullname: 'vivek',
      emailid: 'vivek@vivek.com',
      password: 'vivek',
    };
    request(app)
      .post('/updateprofile')
      .send(user)
      .expect(302)
      .end(function (err, res) {
        if (err) {
          done(err);
        } else {
          res.status.should.be.equal(302);
          done();
        }
      });
  });
});

describe('POST /profilepictureupload', function () {
  it('it should response update profile page', function (done) {
    const user = {
      image: 'twitter.jpg',
    };
    request(app)
      .post('/profilepictureupload')
      .send(user)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          done(err);
        } else {
          res.status.should.be.equal(200);
          done();
        }
      });
  });
});

describe('POST /resetpassword', function () {
  it('it should response updateprofile page', function (done) {
    const user = {
      emailid: 'vivek@improwised.com',
      securityquestion: 'bof',
      securityanswer: 'jamnagar',
    };
    request(app)
      .post('/resetpassword')
      .send(user)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          done(err);
        } else {
          res.status.should.be.equal(200);
          done();
        }
      });
  });
});
