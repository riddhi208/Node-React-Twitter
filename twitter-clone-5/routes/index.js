const express = require('express');
const DB = require('../helpers/db');

const router = express.Router();

const path = require('path');

const multer = require('multer');

const upload = multer({ dest: path.resolve(__dirname, '../public/images/profile/') });

const uploadtweet = multer({ dest: path.resolve(__dirname, '../public/images/tweetimage/') });


router.get('/', (req, res, next) => {

  const query = DB.builder()
    .select()
    .function('NOW()')
    .toParam();
  DB.executeQuery(query, (error) => {
    if (error) {
      next(error);
    }
    res.render('index', {

    });
  });
});


router.post('/register', upload.single('file'), (req, res, next) => {
  const fullname = req.body.user.fullname;
  const emailid = req.body.user.emailid;
  const password = req.body.user.password;
  console.log("@@@@@@@@@@@@@",req.body.user.name);

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
  });
});


router.post('/login', (req, res, next) => {
  console.log("post login called")
  const session = req.session;
  const emailid = req.body.userdata.emailid;
  const password = req.body.userdata.password;

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
      console.log("....",req.session.emailid)
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

router.get('/header/:id', (req, res, next) => {
  console.log("header called")
  let query;
  let userid= req.params.id;

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
          .field('id')
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

          let data = {
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

router.post('/follow', (req, res, next) => {
  console.log("folllooowww called", req.body.data);
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
  const followid= req.body.myfollow;
  const userid= req.body.data;
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
  });
});

router.post('/updateprofile/:id', (req, res, next) => {
  const userid = req.params.id;
  console.log("zzzzzzz", userid);
  const session = req.session;

  const fullname = req.body.data.fullname;
  const emailid = req.body.data.emailid;
  const password = req.body.data.password;

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

  let data = {
    id: session.userid,
  };
  res.end(JSON.stringify(data));
});




// router.post('/profilepictureupload', upload.single('file'), (req, res) => {
//   const session = req.session;
//   if (req.session.emailid) {
//     let photo = ''; /*= req.file.filename;*/
//     if (req.file) {
//       photo = req.file.filename;
//     } else {
//       photo = 'default.png';
//     }
//     const query = DB.builder()
//       .update()
//       .table('tbl_register')
//       .set('image', photo)
//       .where('emailid = ?', session.emailid)
//       .toParam();
//     DB.executeQuery(query, (error, next) => {
//       if (error) {
//         next(error);
//       }
//     });
//     res.redirect('updateprofile');
//   } else {
//     res.render('login');
//   }
// });

router.get('/deleteaccount/:id', (req, res, next) => {
  console.log("delete...");
  const userid= req.params.id;
  console.log("......",userid);
  const session = req.session;
  let query;

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
});

router.get('/morefriends/:id', (req, res, next) => {
  let query;
  var userid = req.params.id;
  const session = req.session;

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
  });
});

module.exports = router;
