var express = require('express');
var router = express.Router();
var curl = require('curlrequest');

router.get('/', function(req, res) {
  return res.render('index', {
    title: 'Group Chow'
  });
});

router.get('/getFriends', function(req, res) {
  return res.render('getFriends', {
    title: 'Group Chow',
    count: req.session.count
  })
});

router.get('/incrCount', function(req, res) {
  if(req.session.count == null) {
    req.session.count = 0;
  }
  req.session.count = req.session.count + 1;
  res.redirect('/getFriends');
});

router.post('/getRestaurant', function(req, res) {
  console.log("function starting..");
  var menuurl = "http://api.locu.com/v1_0/venue/search/?has_menu=TRUE&name=" + req.body.restname +"&locality=" + req.body.city + "&region=" + req.body.state + "&api_key=99018cb9712f77ed7276576673b997470cd3f9ec";

  curl.request({
    url: 'http://api.locu.com/v2/venue/search'
  }, function (err, data, meta) {
      console.log("function entered..");
  });

  console.log("function done..");

});



/*

router.post('/getRestaurant', function(req, res) {

});

router.post('/getUserMenu', function(req, res) {

});

router.post('/getFriends', function(req, res) {

});

router.post('/friendOrders', function(req, res) {

});

router.post('/confirmOrder', function(req, res) {

});

*/

router.get('/success', function(req, res) {
  return res.render('success', {
    title: 'babycall.me'
  });
});

router.get('/error', function(req, res) {
  return res.render('error', {
    title: 'babycall.me'
  });
});

router.post('/delete', function(req, res) {
  var ind = -1;

  var fs1 = require('fs');
  var array1;
  var array2;
  var array3;

  fs1.readFile('data/numbers.txt', function(err,data) {
    array1 = data.toString().split("\n");
    console.log(array1);

    for(i in array1) {
      if(array1[i]==req.body.num1) {
        ind = i;
      }
    }
  });

  console.log(array1);

  console.log('hello3');
  console.log(ind);  

  if(ind==-1) return res.redirect('/error');
  
  console.log('hello4');
  

  fs1.readFile('data/time.txt', function(err,data) {
    array2 = data.toString().split("\n");
  });

  fs1.readFile('data/minutes.txt', function(err,data) {
    array3 = data.toString().split("\n");
  });

  console.log(array1);
  console.log(array2);
  console.log(array3);


  fs1.unlink(data/time.txt);
  fs1.unlink(data/numbers.txt);
  fs1.unlink(data/names.txt);

  for(i in array1) {
    if(i!=ind) {
      fs.appendFile('data/numbers.txt', array1[i].concat('\n'), function(err) {
        console.log("Error3");
        console.log(err);
        if(err) throw err;
      });
      fs.appendFile('data/time.txt', array2[i].concat('\n'), function(err) {
        console.log("Error3");
        console.log(err);
        if(err) throw err;
      });
      fs.appendFile('data/minutes.txt', array3[i].num.concat('\n'), function(err) {
        console.log("Error3");
        console.log(err);
        if(err) throw err;
      });
    }
  }
  return res.redirect('/success')
});

router.post('/create', function(req, res) {
  var fs1 = require('fs');

  if(!req.body.num || !req.body.mins || !req.body.tim) {
    console.log("Error1");
    fs1.close();
  	return res.redirect('/error');
  }
  else if(req.body.num.length!=10) {
    console.log("Error2");
    fs1.close();
  	return res.redirect('/error');
  }
  else {
    console.log("success");
    fs1.appendFile('data/numbers.txt',req.body.num.concat('\n'), function(err) {
      console.log("Error3");
      console.log(err);
      if(err) throw err;
    });
    fs1.appendFile('data/time.txt',req.body.tim.concat('\n'), function(err) {
      console.log("Error3");
      console.log(err);
      if(err) throw err;
    });
    fs1.appendFile('data/minutes.txt',req.body.mins.concat('\n'), function(err) {
      console.log("Error3");
      console.log(err);
      if(err) throw err;
    });
  }
  return res.redirect('/success'); //put a successful message here
});

module.exports = router;
