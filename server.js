/*Set Up*/

var express = require('express');
var mongoose = require('mongoose'); // mongoose for mongodb
var morgan = require('morgan'); // log requests to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var app = express(); // create our app w/ express


/* =========set up port ======== */

var port = process.env.PORT || 5000; //  

/* ======== Setting up Database ========= */

mongoose.connect('mongodb://node:nodeapp@ds145302.mlab.com:45302/todo'); // connect to mongoDB database on mlabs

var conn = mongoose.connection;
conn.on('error', console.error.bind(console, "connection error"));
conn.on('open', () => {
  console.log("Connected to database");
  //if connected to db, then start the app, listening on given port
  app.listen(port);
  console.log("listening on " + port);
});

/* ========  App Configurations ========= */
app.use(express.static(__dirname + '/public')); // set the app to serve static files
app.use(morgan('dev')); //log every request to the console
app.use(bodyParser.urlencoded({
  'extended': 'true'
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/jso
app.use(bodyParser.json({
  'type': 'application/vnd.api+json'
})); //parse application/vnd.api+json
app.use(methodOverride());

/* ========  define model ========= */
var Todo = mongoose.model('Todo', {
  text: String
});


/* ========  RESTful API Routes ========= */

//api---------------------------------------------------------------------------------

//get all todos
app.get('/api/todos', function (req, res) {
  // use mongoose to get all todos in the database
  Todo.find(function (err, todos) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send("There was an error while getting todos " + err)
    res.json(todos) // return all todos in JSON format
  });
});


//create a new todo, info will come from front-end through AJAX
app.post('/api/todos', function (req, res) {
  //save/create todo in MongoDB using mongoose
  Todo.create({
    text: req.body.text,
    done: false
  }, function (err, todo) {
    if (err) res.send("There was an error creating a new todo" + err);

    // get and return all the todos after you create another
    Todo.find(function (err, todos) {
      if (err) res.send("There was an error while getting todos after creating a new todo" + err)
      res.json(todos)
    });
  });

});

//delete a todo
app.delete('/api/toso/:todo_id', function (req, res) {
  Todo.remove({
    _id: req.param.todo_id
  }, function (err, todo) {
    if (err) res.send("There was an error deleting todo" + err)

    // get and return all the todos after you delete a todo
    Todo.find(function (err, todos) {
      if (err) res.send("There was an error while getting todos after deleting a todo" + err)
      res.json(todos)
    });
  });
});

/*==========Front-end Application ==========*/
app.get('*', function (req, res) {
  res.sendFile('./public/index.html'); //load the single view file and angular will handle the page changes on the front-end
});
