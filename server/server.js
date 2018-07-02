require("./config/config.js");

const _ = require("lodash");
const path = require('path');
const express = require('express');
var bodyParser = require("body-parser");
const {ObjectID} = require("mongodb");

var {mongoose} = require("./db/mongoose");
var {Todo} = require("./models/todo");
var {User} = require("./models/user");
var {authenticate} = require("./middleware/authenticate");

const app = express();
const publicPath = path.join(__dirname, '..', 'public');
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(express.static(publicPath));


app.post("/todos", authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get("/todos", authenticate, (req, res) => {

  Todo.find({_creator: req.user._id}).then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });

});

app.get("/todos/:id", authenticate, (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id
    }).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }

    res.send({todo});
  }, (e) => {
    res.status(400).send();
  });
});

app.delete("/todos/:id", authenticate, async (req, res) => {
  try{
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
      return res.status(404).send();
    }

    const todo = await Todo.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    });

    if(!todo){
      return res.status(404).send();
    }

    res.send({todo});
  }
  catch(e){
    res.status(400);
  }

  // var id = req.params.id;
  //
  // if(!ObjectID.isValid(id)){
  //   return res.status(404).send();
  // }
  //
  // Todo.findOneAndRemove({
  //   _id: id,
  //   _creator: req.user._id
  // }).then((todo) => {
  //   if(!todo){
  //     return res.status(404).send();
  //   }
  //
  //   res.send({todo});
  // }).catch((e) => {
  //   res.status(400).send();
  // });
});

app.patch("/todos/:id", authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ["text", "completed"]);

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  }
  else{
    body.completed = false;
    body.completedAt = null
  }

  Todo.findOneAndUpdate({_id: id, _creator:req.user._id}, {$set: body}, {new: true}).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.post("/users", async (req, res) => {
  try{
    var body = _.pick(req.body, ["email", "password"]);
    var user = new User(body);

    await user.save();
    const token = await user.generateAuthToken();
    res.header("x-auth", token).send(user);
  }
  catch(e){
    res.status(400).send(e);
  }

  // user.save().then(() => {
  //   return user.generateAuthToken();
  // }).then((token) => {
  //   res.header("x-auth", token).send(user);
  // }).catch((e) => {
  //   res.status(400).send(e);
  // });
});

app.get("/users/me", authenticate, (req, res) => {
  res.send(req.user);
});

app.post("/users/login", async (req, res) => {
  console.log("Attemping to login user");

  try{
    const body = _.pick(req.body, ["email", "password"]);
    console.log(body);
    const user = await User.findByCredentials(body.email, body.password);
    console.log("User: ", user);
    const token = await user.generateAuthToken();
    res.header("x-auth", token).send(user);
  }
  catch(e){
    res.status(400).send();
  }
});

app.delete("/users/me/token", authenticate, async (req, res) => {
  try{
    await req.user.removeToken(req.Token);
    res.status(200).send();
  }
  catch(e){
    res.status(400).send();
  }
});

app.get("/users/me/token", authenticate, async (req, res) => {
  console.log("Trying to get a new token");
  try{
    const token = await req.user.generateAuthToken();
    res.header("x-auth", token).send(req.user);
  }
  catch(e){
    console.log(e);
    res.status(400).send();
  }
});



app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(port, () => {
  console.log('Server is up!');
});

module.exports = {app};