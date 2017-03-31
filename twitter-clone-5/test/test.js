const should = require('should');

let request = require('supertest');
const app = require('../app');
// request = request('http://localhost:3000');

var user = {
  user: {
    id: 66,
    fullname: 'riddhi',
    emailid: 'riddhi@gmail.com',
    password: 'riddhi',
    image: 'twitter.jpg',
  }
};
const follow = {
  data: user.user.id,
  f_followerid: '1',
};

const tweet = {
  data: {
    username: {
      id: user.user.id,
    }
  },
  t_userid: user.user.id,
  username: user.user.id,
};

const updateprofile = {
  data: {
    fullname: 'riddhi',
    password: 'riddhi',
    emailid: 'riddhi@gmail.com',
    image: '2567901bf9cbf2c5ede7317aba2379bc',
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

// describe('GET /logout', function () {
//   it('should return login page', function (done) {
//     request(app)
//       .get('/logout')
//       .expect('Content-type', 'text/html; charset=utf-8')
//       .expect(200)
//       .end(function (err, res) {
//         res.status.should.be.equal(200);
//         done();
//       });
//   });
// });

describe(`GET /header/${user.user.id}`,  ()=> {
  it('should return header', function (done) {
    request(app)
      .get(`/header/${user.user.id}`)
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


describe(`GET /profile/${user.user.id}`, function () {
  it('should return profile page', function (done) {
    request(app)
      .get(`/profile/${user.user.id}`)
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

describe(`GET /deleteaccount/${user.user.id}`, function () {
  it('it should response login page', function (done) {
    this.timeout(500);
    setTimeout(done, 300);
    request(app)
    .get(`/deleteaccount/${user.user.id}`)
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
      .send(tweet)
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
describe('POST /follow', function () {
  it('it should response login page', function (done) {
    this.timeout(500);
    setTimeout(done, 300);
    request(app)
    .post('/follow')
    .expect(302)
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
// describe('POST /follow', function () {
//   it('it should response header page', function (done) {
//     request(app)
//       .post('/follow')
//       .send(follow)
//       .expect(302)
//       .end(function (err, res) {
//         if (err) {
//           done(err);
//         } else {
//           res.status.should.be.equal(200);
//           done();
//         }
//       });
//   });
// });

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
        res.status.should.be.equal(200);
        done();
      }
    });
  });
});

describe(`POST /updateprofile/${user.user.id}`, function () {
  it('it should response updtaeprofile page', function (done) {
    request(app)
      .post(`/updateprofile/${user.user.id}`)
      .send(updateprofile)
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

// describe(`POST /editprofile/ + ${registeruser.userdata.id}`, () => {
//     it('user can edit their profile', (done) => {
//       request(app)
//         .post(`/editprofile/ + ${registeruser.userdata.id}`)
//         .send(editprofile)
//         .expect(200)
//         .end((err, res) => {
//           if (err) {
//             done(err);
//           } else {
//             res.status.should.be.equal(200);
//             done();
//           }
//         });
//     });
//   });


