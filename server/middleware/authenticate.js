var {User} = require("./../models/user");

var authenticate = (req, res, next) => {

  console.log("Authenticating Request");

  var token = req.header("x-auth");

  console.log("The token is:", token);

  User.findByToken(token).then((user) => {
    if(!user){
      console.log("NO USER FOUND WITH THAT TOKEN");
      return Promise.reject();
    }

    console.log("Found user:", user)

    req.user = user;
    req.token = token;
    
    next();
  }).catch((e) => {
    res.status(401).send();
  });
};

module.exports = {authenticate};
