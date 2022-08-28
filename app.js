const express = require('express');
require('dotenv').config()
const fs = require('fs')
const app = express();
const morgan = require('morgan')
const path = require('path');
const cors = require('cors');
const chalk = require('chalk');
const createSchema = require('./schemas/createSchema');
const loginSchema = require('./schemas/loginSchema');
const mongo = require('./mongo');
const bcrypt = require('./bcrypt')
const randomBytes = require('./bs')
const jwt = require('jsonwebtoken');
const { error } = require('console');



app.set('view engine', 'ejs')
const staticWebsite = path.join(__dirname , './views');
app.use(express.static(staticWebsite));
bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());



 
// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
 
// setup the logger
app.use(morgan(':method :url :response-time', { stream: accessLogStream }))

// app.use(cors())
 



//create


app.get('/create',(req, res)  => {
    res.render('/index');
});





app.post('/create' , usercreation);

async function usercreation(req , res){

  const {error , value} = createSchema.validate(req.body);

  req.body.password = bcrypt.hashApassword(req.body.password);


  if (error) { 
    res.status(400)
    console.log(chalk.red('error in validation'))
  }
  else {

    if (req.body.vip == 'on') {

      const dbName = 'business';
      const result = await mongo.uniqueEmail(dbName , {email : req.body.email})

      if(result == undefined){

        mongo.createUser(dbName , req.body);
        console.log(chalk.blue('a new business user was created'));
        res.status(200)
      }

      else {       
          console.log(chalk.red('the email is taken'))
      }

    }

    else {

      const dbName = 'standard';
      const result = await mongo.uniqueEmail(dbName , {email : req.body.email})

      if (result == undefined){

          mongo.createUser(dbName , req.body);
          console.log(chalk.blue('a new user was created'));
          res.status(200)
      }

      else {
        console.log(chalk.red('the email is taken'))
      }


    }
    res.render('index')
  }


}



//login

app.get('/login',(req, res)  => {
  res.render('login');
});




app.post('/login' , userLogin);




async function userLogin(req , res) {

  const {error , value} = loginSchema.validate(req.body);

  if (error) { 
    res.status(400)
    console.log(chalk.red('error in validation'))
  }
  else {
    if (await mongo.loginCheck('business' , {'email' :req.body.email} , req.body.password) || await mongo.loginCheck('standard' , {'email' :req.body.email} , req.body.password)){
      const userObject = await mongo.loginCheck('business' , {'email' :req.body.email} , req.body.password)
      console.log('the user object is' + userObject);
      if (!userObject.vip){
        userObject.vip = 'off'
      }
      let dataForToken = {
        userId : userObject._id,
        vip : userObject.vip
      }

      const accessToken = jwt.sign(dataForToken , process.env.SECRET);
      res.json({accessToken : accessToken})
    }
  }


}


// user details


app.get('/userDetails' , checkToken , (req , res) => {
  const userId = req.user.userId;
  const userObject = mongo.uniqueEmail(userId);
  res.send(200).send(userObject);
})




async function checkToken(req , res , next){
  const token = req.header('authorization');
  if (token == null) res.send(401);

  try {
    const user = jwt.verify(token , process.env.SECRET );
    console.log(user)
    req.user = user;
    next()

  }

  catch { res.send(401) }
}


app.listen(process.env.PORT , () => console.log('the app is listening to port 3000!!'));
















