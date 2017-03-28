const express = require('express');
const DB = require('../helpers/db');

const router = express.Router();

const path = require('path');

const multer = require('multer');

const upload = multer({ dest: path.resolve(__dirname, '../public/images/profile/') });

const uploadtweet = multer({ dest: path.resolve(__dirname, '../public/images/tweetimage/') });
// GET: /

router.get('/', (req, res, next) => {
  // Constuct and run a simple query
  const query = DB.builder()
    .select()
    .function('NOW()')
    .toParam();
  DB.executeQuery(query, (error) => {
    if (error) {
      next(error);
    }
    res.render('index', {
       // title: `Time from the database is ${results.rows[0].now}`,
    });
  });
});

// router.get('/register', (req, res) => {
//   res.render('register');
// });

router.post('/register', upload.single('file'), (req, res, next) => {
  // const fullname = req.sanitize('fullname').trim();
  // const emailid = req.sanitize('emailid').trim();
  // const password = req.sanitize('password').trim();
  // const securityquestion = req.sanitize('question').trim();
  // const securityanswer = req.sanitize('answer').trim();

  const fullname = req.body.user.fullname;
  const emailid = req.body.user.emailid;
  const password = req.body.user.password;
  console.log("@@@@@@@@@@@@@",req.body.user.name);

  // req.checkBody('fullname', 'Username is required').notEmpty();
  // if (emailid !== '') {
  //   req.checkBody('emailid', 'Email is not valid').isEmail();
  // } else {
  //   req.checkBody('emailid', 'Email is required').notEmpty();
  // }
  // req.checkBody('question', 'question is required').notEmpty();
  // req.checkBody('answer', 'answer is required').notEmpty();

  // const errors = req.validationErrors();
  // if (errors) {
  //   res.render('register', {
  //     errors,
  //   });
  // } else {
  //   let photo = '';
  //   if (req.file) {
  //     photo = req.file.filename;
  //   } else {
  //     photo = 'default.png';
  //   }
    // const query = DB.builder()
    //   .insert()
    //   .into('tbl_register')
    //   .set('fullname', fullname)
    //   .set('emailid', emailid)
    //   .set('password', password)
    //   .set('image', photo)
    //   .set('securityquestion', securityquestion)
    //   .set('securityanswer', securityanswer)
    //   .toParam();

    const query = DB.builder()
      .insert()
      .into('tbl_register')
      .set('fullname', fullname)
      .set('emailid', emailid)
      .set('password', password)
      .toParam();


    DB.executeQuery(query, (error, data) => {
      if (error) {
        next(error);
      }
      let object = {data:data.rows};
      res.end(JSON.stringify(object));
      // res.redirect('/login');
    });
  // }
});


router.get('/login', (req, res) => {
  res.render('login');
});

// router.get('/auth_status', (req, res) => {
//   console.log(req.session);
//   return res.json({ status: req.session });
// })

router.post('/login', (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const session = req.session;
  // const emailid = req.sanitize('emailid').trim();
  // const password = req.sanitize('password').trim();
  const emailid = req.body.userdata.emailid;
  const password = req.body.userdata.password;

  // if (emailid !== '') {
  //   req.checkBody('emailid', 'Email is not valid').isEmail();
  // } else {
  //   req.checkBody('emailid', 'Email is required').notEmpty();
  // }
  // req.checkBody('password', 'Password is required').notEmpty();
  // const errors = req.validationErrors();
  // if (errors) {
  //   res.render('login', {
  //     errors,
  //   });
  // } else {
    const query = DB.builder()
      .select()
      .field('id')
      .field('emailid')
      .field('password')
      .from('tbl_register')
      .where('emailid = ? AND password = ?', emailid, password)
      .toParam();

    DB.executeQuery(query, (error, results) => {
      if (error) {
        next(error);
      }
      else if(results.rowCount) {

        req.session.emailid = results.rows[0].emailid;
        req.session.user_id = results.rows[0].id;

      }
      let data = {
        id: session.user_id,
      }
      res.end(JSON.stringify(data));
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.render('login');
    }
  });
});

router.get('/index', (req, res) => {
  res.render('index');
});

router.get('/header/:id', (req, res, next) => {

  let query;
  let userid= req.params.id;
  // const session = req.session;
  // if (req.session.emailid) {
    query = DB.builder()
      .select()
      .field('fullname')
      .field('t_tweetText')
      .field('image')
      .field('t_likeCount')
      .field('t.*')
      .from('tbl_register', 'r')
      .join('tbl_tweet', 't', 't.t_userid = r.id')
      .where(DB.builder().expr()
        .or('t.t_userid IN ?', DB.builder()
          .select()
          .field('f_followerid')
          .from('tbl_follower')
          .where('f_userid = ?', userid))
        .or('t.t_userid= ?', userid))
      .order('t_time', false);
    // console.log(query.toString());
    DB.executeQuery(query.toParam(), (error, tweets) => {
      if (error) {
        next(error);
      }
      query = DB.builder()
          .select()
          .from('tbl_register')
          .where('id != ?', userid)
          .where('id NOT IN ?',
          DB.builder()
            .select()
            .field('f_followerid')
            .from('tbl_follower')
            .where('f_userid = ?', userid))
            .order('RANDOM()')
            .limit(3)
            .toParam();
      DB.executeQuery(query, (error1, follow) => {
        if (error1) {
          next(error1);
          return;
        }

      query = DB.builder()
        .select()
        .from('tbl_register', 'r')
        .field('fullname')
        .field('id')
        .field('image')
        .where('id = ?', userid)
        .toParam();
        // console.log(query);

        DB.executeQuery(query, (error2, username) => {
          if (error2) {
            next(error2);
            return;
          }
      query = DB.builder()
        .select()
        .from('tbl_follower', 'r')
        .where('f_userid = ?', userid)
        .toParam();

      console.log("//////",userid);
        DB.executeQuery(query, (error2, count) => {
          if (error2) {
            next(error2);
            return;
          }

      query = DB.builder()
        .select()
        .from('tbl_register', 'r')
        .where('id = ?', userid)
        .toParam();

      console.log("//////",userid);
        DB.executeQuery(query, (error2, count1) => {
          if (error2) {
            next(error2);
            return;
          }


          let data = {
            tweets: tweets.rows,
            follow: follow.rows,
            username: username.rows,
            count: count.rows.length,
            count1: count1.rows.length,
          }
          res.end(JSON.stringify(data));
          // res.render('header', {
          //   tweets: tweets.rows,
          //   follow: follow.rows,
          //   username: username.rows,
          // });
        });
        });
      });
    });
  });
});

router.post('/tweet', (req, res, next) => {
  const session = req.session;
  const emailid = req.body.data.emailid;
  let userid = req.body.data.data.username[0].id;
  console.log("aaaaaaa", userid);
  const tweetText = req.body.data.tweet;
  console.log("/////////////", tweetText);
  // if (req.file) {
  //   filename = req.file.filename;
  // } else {
  //   filename = '';
  // }
  const query = DB.builder()
    .insert()
    .into('tbl_tweet')
    .set('t_tweetText', req.body.data.tweet)
    .set('t_time', 'now()')
    // .set('t_image', filename)
    .set('t_userid', userid)
    .toParam();
  DB.executeQuery(query, (error) => {
    if (error) {
      next(error);
    }
    // res.redirect('/header');
    let data = {
      id: userid,
    }
    res.end(JSON.stringify(data));
  });
});


router.get('/profile/:id', (req, res, next) => {
  let query;
  let userid= req.params.id;
  const session = req.session;
  // console.log(session);
  // if (req.session.emailid) {
    query = DB.builder()
      .select()
      .field('id')
      .field('fullname')
      .field('t_tweetText')
      .field('t_time')
      .field('image')
      .field('t_image')
      .from('tbl_register', 'r')
      .join(DB.builder().select().from('tbl_tweet'), 't', 't.t_userid = r.id')
      .where('id = ?', userid)
      .order('t_time', false)
      .toParam();

    DB.executeQuery(query, (error, tweets) => {
      if (error) {
        next(error);
      }
      query = DB.builder()
        .select()
        .field('fullname')
        .field('f_followerid')
        .field('f_id')
        .field('image')
        .from('tbl_register', 'r')
        .join(DB.builder().select().from('tbl_follower'), 'f', 'r.id = f.f_followerid')
        .where('r.id != ?', userid)
        .toParam();
      DB.executeQuery(query, (error1, follow) => {
        if (error1) {
          next(error1);
          return;
        }
        query = DB.builder()
          .select()
          .from('tbl_register', 'r')
          .field('fullname')
          .field('image')
          .where('id = ?', userid)
          .toParam();
        DB.executeQuery(query, (error2, username) => {
          if (error2) {
            next(error2);
            return;
          }

        query = DB.builder()
        .select()
        .from('tbl_register', 'r')
        .where('id = ?', userid)
        .toParam();

        DB.executeQuery(query, (error2, count) => {
          if (error2) {
            next(error2);
            return;
          }
          // res.render('profile', {
          //   res: results.rows,
          //   follow: follow.rows,
          //   username: username.rows,
          // });

          let data = {
            // res: results.rows,
            tweets: tweets.rows,
            follow: follow.rows,
            username: username.rows,
            count: count.rows.length,
          }
          res.end(JSON.stringify(data));
        });
      });
    });
  });
});

// router.post('/profile', (req, res, next) => {
//   const query = DB.builder()
//     .insert()
//       .into('tbl_tweet')
//       .set('t_tweetText', req.body.comment)
//       .set('t_likeCount', '0')
//       .set('t_time', 'now()')
//       .set('t_userid', req.session.userid)
//       .toParam();
//   DB.executeQuery(query, (error) => {
//     if (error) {
//       next(error);
//     }
//     res.redirect('/profile');
//   });
// });

router.post('/follow', (req, res, next) => {
  console.log("folllooowww called")
  const followid= req.body.myfollow;
  const userid= req.body.data.data.username[0].id;
  console.log("......",userid);
  console.log("......folllll",followid);
  const session = req.session;
  const query = DB.builder()
    .insert()
    .into('tbl_follower')
    .set('f_userid', userid)
    .set('f_followerid', followid)
    .toParam();
  DB.executeQuery(query, (error) => {
    if (error) {
      next(error);
    }
    console.log(query);
    let data = {
      "userid": userid,

    }
    console.log("data....",data)
    res.end(JSON.stringify(data));
  });
});

router.post('/unfollow', (req, res, next) => {
  // const followid= req.body.data.data.follow[0].f_id;
  const followid= req.body.myfollow;
  const userid= req.body.data;
  // console.log("......",userid);
  console.log("......uuuufolllll",followid);
  const query = DB.builder()
      .delete()
      .from('tbl_follower')
      .where('f_followerid=?', followid)
      .toParam();

  DB.executeQuery(query, (error) => {
    if (error) {
      next(error);
    }
    let data = {
      "followid": followid,

    }
    res.end(JSON.stringify(data));
    // res.redirect('/profile');
  });
});

// router.get('/updateprofile/:id', (req, res, next) => {
//   const session = req.session;
//   let userid= req.params.id;
//   // if (session.emailid) {
//     const query = DB.builder()
//       .select()
//       .from('tbl_register')
//       .where('id = ? ', userid)
//       .toParam();
//     DB.executeQuery(query, (error, results) => {
//       if (error) {
//         next(error);
//       }
//     //   res.render('updateprofile', { res: results.rows });
//     // });
//   // } else {
//   //   res.render('login');
//   // }
//   let data = {
//     res: results.rows,
//     // tweets: tweets.rows,
//     // follow: follow.rows,
//     // username: username.rows,
//     // count: count.rows.length,
//   }
//   res.end(JSON.stringify(data));

// });

router.post('/updateprofile/:id', (req, res, next) => {
  console.log("uuuuuuuu")
  const userid = req.params.id;
  console.log("zzzzzzz", userid);
  const session = req.session;

  const fullname = req.body.data.fullname;
  const emailid = req.body.data.emailid;
  const password = req.body.data.password;
  console.log("@@@@@@@@@@@@@",req.body.data);
  // if (session.emailid) {
    const query = DB.builder()
      .update()
        .table('tbl_register')
        .set('fullname', fullname)
        .set('emailid', emailid)
        .set('password', password)
        .where('id = ?', userid)
        .toParam();
    DB.executeQuery(query, (error, next) => {
      if (error) {
        next(error);
      }
    });
  //   res.redirect('updateprofile');
  // } else {
  //   res.render('login');
  let data = {
    id: session.userid,
  };
  res.end(JSON.stringify(data));
});


router.get('/profilepictureupload', (req, res, next) => {
  const session = req.session;
  if (req.session.emailid) {
    const query = DB.builder()
      .select()
      .field('image')
      .from('tbl_register')
      .where('emailid = ?', session.emailid)
      .toParam();
    DB.executeQuery(query, (error, results) => {
      if (error) {
        next(error);
      }
      res.render('updateprofile', { res: results.rows });
    });
  }
  res.render('login');
});

router.post('/profilepictureupload', upload.single('file'), (req, res) => {
  const session = req.session;
  if (req.session.emailid) {
    let photo = ''; /*= req.file.filename;*/
    if (req.file) {
      photo = req.file.filename;
    } else {
      photo = 'default.png';
    }
    const query = DB.builder()
      .update()
      .table('tbl_register')
      .set('image', photo)
      .where('emailid = ?', session.emailid)
      .toParam();
    DB.executeQuery(query, (error, next) => {
      if (error) {
        next(error);
      }
    });
    res.redirect('updateprofile');
  } else {
    res.render('login');
  }
});

router.get('/deleteaccount/:id', (req, res, next) => {
  console.log("delete...");
  const userid= req.params.id;
  console.log("......",userid);
  const session = req.session;
  let query;
  // if (req.session.emailid) {
    query = DB.builder()
      .delete()
      .from('tbl_register')
      .where('id = ?', userid)
      .toParam();
    DB.executeQuery(query, (error) => {
      if (error) {
        next(error);
      }
    });
    query = DB.builder()
      .delete()
      .from('tbl_tweet')
      .where('t_userid = ?', userid)
      .toParam();
    DB.executeQuery(query, (error) => {
      if (error) {
        next(error);
      }
    });
    query = DB.builder()
      .delete()
      .from('tbl_follower')
      .where('f_userid = ?', userid)
      .toParam();
    DB.executeQuery(query, (error) => {
      if (error) {
        next(error);
      }
    });
    let data = {
      "userid": userid,

    }
    console.log("data....",data)
    res.end(JSON.stringify(data));
    // res.render('login');
  });




router.get('/resetpassword', (req, res) => {
  res.render('resetpassword');
});

router.post('/resetpassword', (req, res, next) => {
  const query = DB.builder()
    .select()
    .field('password')
    .from('tbl_register')
    .where('emailid = ?', req.body.emailid)
    .where('securityquestion = ?', req.body.question)
    .where('securityanswer = ?', req.body.answer)
    .toParam();
  DB.executeQuery(query, (error, results) => {
    if (error) {
      next(error);
    }
    if (results.rowCount) {
      res.render('getpassword', { res: results.rows });
    } else {
      res.redirect('resetpassword');
    }
  });
});


router.get('/morefriends/:id', (req, res, next) => {
  let query;
  var userid = req.params.id;
  const session = req.session;
  // if (req.session.emailid) {
      query = DB.builder()
          .select()
          .from('tbl_register')
          .where('id != ?', userid)
          .where('id NOT IN ?',
          DB.builder()
            .select()
            .field('f_followerid')
            .from('tbl_follower')
            .where('f_followerid = ?', userid))
            .toParam();
      DB.executeQuery(query, (error1, follow) => {
        if (error1) {
          next(error1);
          return;
        }
        query = DB.builder()
          .select()
          .from('tbl_register', 'r')
          .field('fullname')
          .field('image')
          .where('id = ?', userid)
          .toParam();
        DB.executeQuery(query, (error2, username) => {
          if (error2) {
            next(error2);
            return;
          }

        query = DB.builder()
          .select()
          .from('tbl_register', 'r')
          .where('id = ?', userid)
          .toParam();

        console.log("//////",userid);
          DB.executeQuery(query, (error2, count) => {
            if (error2) {
              next(error2);
              return;
            }

          let data = {
            follow: follow.rows,
            username: username.rows,
            count: count.rows.length,
          }
          res.end(JSON.stringify(data));
        });
    });

    // });
  // } else {
  //   res.render('login');

  });
});

router.get('/userprofile/:id', (req, res, next) => {
  let query;
  const profileid = req.params.id;
  const session = req.session;
  if (session.emailid) {
    if(profileid == session.userid) {
      res.redirect('/profile');
    } else{
    query = DB.builder()
      .select()
      .field('fullname')
      .field('t_tweetText')
      .field('t_time')
      .field('image')
      .field('t_image')
      .from('tbl_register', 'r')
      .join(DB.builder().select().from('tbl_tweet'), 't', 't.t_userid = r.id')
      .where('id = ?', profileid)
      .order('t_time', false)
      .toParam();

    DB.executeQuery(query, (error, results) => {
      if (error) {
        next(error);
      }
      query = DB.builder()
        .select()
        .field('fullname')
        .field('f_followerid')
        .field('f_id')
        .field('image')
        .from('tbl_register', 'r')
        .join(DB.builder().select().from('tbl_follower'), 'f', 'r.id = f.f_followerid')
        .where('r.id != ?', session.userid)
        .toParam();
      DB.executeQuery(query, (error1, follow) => {
        if (error1) {
          next(error1);
          return;
        }
        query = DB.builder()
          .select()
          .from('tbl_register', 'r')
          .where('id = ?', profileid)
          .toParam();
        DB.executeQuery(query, (error2, username) => {
          if (error2) {
            next(error2);
            return;
          }
          res.render('userprofile', {
            res: results.rows,
            follow: follow.rows,
            username: username.rows[0],
          });
        });
      });
    });
  } } else {
    res.render('login');
  }
});

router.post('/like', (req, res, next) => {
  console.log('like called.............');
  const session = req.session;
  if (session.emailid) {
    const query = DB.builder()
      .update()
      .table('tbl_tweet', 't')
      .set('t_likeCount','t_likeCount = t_likeCount + 1')
      .where(DB.builder().select().from('tbl_register'), 'r', 't.t_userid = r.id')
      .toParam();

    DB.executeQuery(query, (error) => {
      if (error) {
        next(error);
      }
      res.render('header');
    });
  } else{
    res.redirect('/login');
  }
});

module.exports = router;
