var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');

// by default the pool will use the same environment variables
// as psql, pg_dump, pg_restore etc:
// https://www.postgresql.org/docs/9.5/static/libpq-envars.html

// you can optionally supply other values
var config = {
  host: 'db.imad.hasura-app.io',
  user: 'ashishsardana',
  database: 'ashishsardana',
  port: '5432',
  password: process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json()); //If content type is JSON, load it into req.body

//Not used anymore
var articles = {
    'article-one' : {
        title: 'Article One | Ashish Sardana',
        heading: 'Article One',
        date: 'Sep 6, 2016',
        content : `<p>
                    This is the content for my first acticle.This is the content for my first acticle.This is the content for my first acticle.This is the content for my first acticle.This is the content for my first acticle.This is the content for my first acticle.
                </p>
                <p>
                    This is the content for my first acticle.This is the content for my first acticle.This is the content for my first acticle.This is the content for my first acticle.This is the content for my first acticle.This is the content for my first acticle.
                </p>
                <p>
                    This is the content for my first acticle.This is the content for my first acticle.This is the content for my first acticle.This is the content for my first acticle.This is the content for my first acticle.This is the content for my first acticle.
                </p>`},
    'article-two' : {
        title: 'Article Two | Ashish Sardana',
        heading: 'Article Two',
        date: 'Sep 10, 2016',
        content : `<p>
                    This is the content for my Second acticle.This is the content for my Second acticle.This is the content for my Second acticle.This is the content for my Second acticle.This is the content for my Second acticle.
                </p>
                <p>
                    This is the content for my Second acticle.This is the content for my Second acticle.This is the content for my Second acticle.This is the content for my Second acticle.This is the content for my Second acticle.
                </p>
                <p>
                    This is the content for my Second acticle.This is the content for my Second acticle.This is the content for my Second acticle.This is the content for my Second acticle.This is the content for my Second acticle.This is the content for my Second acticle.
                </p>`},
    'article-three' : {
        title: 'Article Three | Ashish Sardana',
        heading: 'Article Three',
        date: 'Sep 15, 2016',
        content : `<p>
                    This is the content for my Third acticle.This is the content for my Third acticle.This is the content for my Third acticle.This is the content for my Third acticle.This is the content for my Third acticle.This is the content for my Third acticle.
                </p>
                <p>
                    This is the content for my Third acticle.This is the content for my Third acticle.This is the content for my Third acticle.This is the content for my Third acticle.This is the content for my Third acticle.
                </p>
                <p>
                    This is the content for my Third acticle.This is the content for my Third acticle.This is the content for my Third acticle.This is the content for my Third acticle.This is the content for my Third acticle.
                    }
                </p>`}
};

//Not used anymore
function createTemplate (data) {
    var title = data.title;
    var date = data.date;
    var heading = data.heading;
    var content= data.content;
    var htmlTemplate = `<html>
        <head>
            <title>
                ${title}
            </title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="/ui/style.css" rel="stylesheet" />
        </head>
        <body>
            <div class="container">
                <div>
                    <a href="/">Home</a>
                </div>
                <hr/>
                <h3>
                    ${heading}
                </h3>
                <div>
                    ${date.toDateString()}
                </div>
                <div>
                    ${content}
                    
                </div>
				<div>
					<br>
					<br>
					<br>
					<br>
					<h4>
						Comment Section
					</h4>
					<hr/>
					This button <button id="counter">Click ME</button> has been clicked <span id="count">0</span> times.
					<hr/>
					<input type="text" id="name" placeholder="name"></input>
					<input type="submit" id="submit_button" value="Submit"></input>
					<ul id="namelist">
					</ul> 
				</div>
            </div>
        </body>
    </html>`
        ;
    return htmlTemplate;
        
}

function hash (input, salt){
    //Creating a hash
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
}

app.get('/hash/:input', function(req,res){
    var hashedString = hash(req.params.input, 'this-is-some-random-string');
    res.send(hashedString);
});

app.post('/create-user', function(req,res){
    //username, password
    //Format of data incoming is JSON. Req.body is json and we'll find keywords
    var username = req.body.username;
    var password = req.body.password;
    var salt = crypto.randomBytes(128).toString('hex');
    var dbString = hash(password, salt);
    pool.query('INSERT INTO "user" (username,password) VALUES ($1, $2)', [username, dbString], function(err, result){
        if(err){
           res.status(500).send(err.toString());
       } 
       else{
           res.send('User successfully created: ' + username);
       }
    });
});

app.post('/login', function(req,res){
     
    var username = req.body.username;
    var password = req.body.password;
    
    pool.query('SELECT * FROM "user" WHERE username = $1', [username], function(err, result){
        if(err){
           res.status(500).send(err.toString());
       } 
       else{
           if(result.rows.length === 0){
               res.send(403).send('username does not exist.');
           }
           else{
               //Matching the password
               var dbString = result.rows[0].password;
               var salt = dbString.split('$')[2];
               var hashedPassword = hash(password, salt); //Creating a hash based on the password submitted and the original salt.
               if(hashedPassword === dbString){
                   res.send('Credentials are correct');
                   
                   //Set a session
                   
               }
               else {
                   res.send(403).send('username/password is incorrect')
               }
           }
           
       }
    });
});


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

// create the pool somewhere globally so its lifetime
// lasts for as long as your app is running
var pool = new Pool(config);

app.get('/test-db', function (req,res){
    //make a select request
    //return a respose with the results
    pool.query('SELECT * FROM test', function (err,result){
       if(err){
           res.status(500).send(err.toString());
       } 
       else{
           res.send(JSON.stringify(result));
       }
    });
});

var counter = 0;

app.get('/counter', function (req, res) {
  counter=counter + 1;
  res.send(counter.toString());
});

app.get('/elevatorData', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'elevatorData.html'));
});

app.get('/ui/elevatorScript.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'elevatorScript.js'));
});

var names = [];
app.get('/submit-name/', function (req, res) {
  //Get the name from the request
  var name = req.query.name; // To do
  names.push(name);
  // JSON: Javascript Object Notation
  res.send(JSON.stringify(names)); //To do
  
});

app.get('/articles/:articleName', function (req, res){
    // articleName == article-one
    // articles[articleName] = {} content for article one
    
    //SELECT * FROM article WHERE title = article-one
    //It thinks that we're subtracting "one from article", so to fix this
    //SELECT * FROM article WHERE title = 'article-one'
    
    //SELECT * FROM article WHERE title = ''; DELETE from "article" where a = 'asdf
    pool.query("SELECT * FROM article WHERE title = $1", [req.params.articleName], function (err, result) {
        if(err) {
            res.status(500).send(err.toString());
        }
        else{
            if(result.rows.length === 0){
                res.status(404).send('Article not found');
            }
            else{
                var articleData = result.rows[0];
                res.send(createTemplate(articleData));
            }
        }
    });
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
