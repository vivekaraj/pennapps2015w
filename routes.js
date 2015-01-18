var express = require('express');
var router = express.Router();
var curl = require('curlrequest');
var Postmates = require('postmates');
var postmates = new Postmates('cus_KAefIoO_AD5TbV', '334e74ce-2d20-4055-9480-f39f9a385e12');

//email stuff - should be straightforward

var mandrill = require('node-mandrill')('YC4wihw55JFZz1p87ZDiUg');
//two lists, 1:1 correspondence
var emails = ['kwhuo68@gmail.com', 'triplep3@gmail.com'];
var names = ['Kevin H', 'Vivek R'];
// the right npm install is: node-mandrill
var formattedList = [];
for(var i=0; i<emails.length; i++) {
  formattedList.push({email: emails[i], name: names[i]});
}
console.log("formatted list is: " + formattedList);
mandrill('/messages/send', {
  message: {
    to: formattedList,
    from_email: 'you@domain.com',
    subject: "hello world",
    text: "mandrill test"
  }
}, function(err, resp)
{
  if (err) console.log( JSON.stringify(error) );
  else console.log(resp);
});
console.log("DONE!");

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

  req.session.userstreet = req.body.userstreet;
  req.session.usercity = req.body.usercity;
  req.session.userstate = req.body.userstate;

  console.log("function starting..");
  var d = JSON.stringify({
      "api_key" : "99018cb9712f77ed7276576673b997470cd3f9ec",
      "fields" : [ "name", "menus", "location" ],
      "venue_queries" : [
        {
          "location" : { "locality": req.body.city, "region" : req.body.state},
          "name": req.body.restname,
          "menus" : { "$present" : true }

        }
      ],
      "menu_item_queries" : [
        {
          "price" : {"$present" : true}
        }
      ]
    });
  curl.request({
    url: 'http://api.locu.com/v2/venue/search',
    method: 'POST',
    data: d
  }, function (err, data, meta) {
      var temp = data;
      var venues = JSON.parse(temp).venues;
      var location = venues[0].location;
      console.log("Location: " + location);
      //var sections = JSON.parse(venues).sections;
      var menus = venues[0].menus;
      console.log("Location: " + location);
      var tempAddr = "" + location.address1;
      req.session.address = tempAddr.substring(0, tempAddr.length - 1) + "reet";
      req.session.city = location.locality;
      req.session.state = location.region;
      console.log("City: " + req.session.city + "//" + req.session.state);
      console.log("Menus: " + menus);
      console.log("Venues: " + venues);  
      var foods = [];
      var prices = [];
      for(var i = 0; i < menus.length; i++) {
        console.log("Section " + i + ": " + menus[i]);
        var menu = menus[i];
        var sections = menu.sections;
        for(var j = 0; j < sections.length; j++) {
          var section = sections[j];
          var subsections = section.subsections;
          for(var k = 0; k < subsections.length; k++) {
            var subsection = subsections[k];
            var contents = subsection.contents;
            for(var l = 0; l < contents.length; l++) {
              var content = contents[l];
              foods.push(content.name);
              prices.push(content.price);
              req.session.foods = foods;
              req.session.prices = prices;
              console.log("Name: " + content.name);
              console.log("Price: " + content.price);
            }
          }
        }
      }

    var delivery = {
      pickup_address: req.session.address + ", " + req.session.city + ", " + req.session.state,
      dropoff_address: req.session.userstreet + ", " + req.session.usercity + ", " + req.session.userstate
    };
    var fee;
    postmates.quote(delivery, function(err, res2) {fee = res2.body.fee;});

      res.render('userOrders', {
        title: 'Group Chow',
        foods: foods,
        prices: prices,
        pickup_address: req.session.address + ", " + req.session.city + ", " + req.session.state,
        dropoff_address: req.session.userstreet + ", " + req.session.usercity + ", " + req.session.userstate,
        fee: fee
      });
      console.log("exits");
  });

});

router.post('/submitUserOrder', function(req, res) {
  var foods = req.session.foods;
  var prices = req.session.prices;
  var orderedFoods = [];
  var orderedPrices = [];
  for(var i = 0; i < foods.length; i++) {
    var bool = "0";
    eval("bool = req.body.food" + i);
    console.log(i + "//" + bool);
    if(bool != null && "" + bool === "1") {
      orderedFoods.push(foods[i]);
      orderedPrices.push(prices[i]);
    }
  }
  req.session.orderedFoods = orderedFoods;
  req.session.orderedPrices = orderedPrices;
  var name = "You";
  var val = [];
  val.push({
    name: name,
    orderedFoods: orderedFoods,
    orderedPrices: orderedPrices
  });
  var order = "" + JSON.stringify(val);
  req.session.order = order;
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


/*
CURL -X POST https://api.locu.com/v2/venue/search -d '{
    "api_key" : "99018cb9712f77ed7276576673b997470cd3f9ec",
     "fields" : [ "location"  ],
     "venue_queries" : [
       {
         "name" : "Pattaya",
         "location" : { "locality" : "Philadelphia", "region" : "PA"},
         "menus" : { "$present" : true }
       }
     ],
     "menu_item_queries" : [
       {
         "price" : {"$present" : true }
       }
     ]
  }'
*/
