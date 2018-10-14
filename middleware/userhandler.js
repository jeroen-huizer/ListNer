var bcrypt = require('bcryptjs');

module.exports =

{

  auth: function(username, password, done) {

    // find user by username
    // Check password

    var user;
    User.find({username: username}, onFind);

    function onFind(err, users){
      if(err){return done(err)}
      if(!users.length == 1){return done(null, false)}

      user = users[0];
      bcrypt.compare(password, matched[0].password, onCompare);
    }

    function onCompare(err, match){
      if(err){return done(err)}
      if(!match){return done(null, false)}
      return done(null, user)
    }

  },

  addUser: function(req, res){
    var User = req.models['user'];

    var username = res.data.username;
    var password = res.data.password;

    // check if username not taken
    // If not, hash password and save user

    User.find({username: username}, onFind);

    function onFind(err, matched){
  		errHandler(err, res);
      if(matched.length){
        errHander({},res);
      }else{
        bcrypt.genSalt(10, onSalt);
      }
    }

    function onSalt(err, salt){
      errHandler(err, res);
      bcrypt.hash(password, salt, onHash);
    }

    function onHash(err, hash){
      errHandler(err, res);
      User.create({username: username, password: hash}, onCreate);
    }

    function onCreate(err, result){
      errHandler(err, res);
      res.send(result);
    }
  },

  updateUser: function(id, firstname, lastname){
    // Find user by id
    // Update details
    // Commit user
  }

}


function errHandler(err, res){
	if(err){
		console.log(err);
		res.status(404).send(err);
		res.end();
	}

}
