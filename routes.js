var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  return res.render('index', {
    title: 'babycall.me'
  });
});

router.get('/success', function(req, res) {
  return res.render('success', {
    title: 'babycall.me'
  });
});

router.get('/postmates', function(req, res) {
console.log("at postmates");
  var pickup_address = "60 South 38th Street, Philadelphia, PA";

var dropoff_address = "3910 Irving Street, Philadelphia, PA";

fee = []; 

var Postmates = require('postmates');

var postmates = new Postmates('cus_KAefIoO_AD5TbV', '334e74ce-2d20-4055-9480-f39f9a385e12');

var delivery = {
  pickup_address: pickup_address,
  dropoff_address: dropoff_address
};

postmates.quote(delivery, function(err, res2) {
  console.log(res2.body.fee); // 799

return res.render('yelp.jade', {pickup_address: pickup_address, dropoff_address: dropoff_address, fee: res2.body.fee} );

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