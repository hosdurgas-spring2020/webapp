const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const connection = require('../../config')
var auth = require('basic-auth');
const uuidv4 = require('uuid/v4');
var passwordValidator = require('password-validator');
var validator = require("email-validator");
const authenticate = require('./auth')
const {getreq,putreq} = require('./userServices')
var isAuth = false
const services = require('./billServices')
const billAuth = require('./billAuth')

validatePass=(pass) => {
  var schema = new passwordValidator();
  schema
  .is().min(8)
  .has().uppercase()
  .has().lowercase()
  .has().digits()
  return schema.validate(pass)
}


validateEmail=(user)=>{
  if(!validator.validate(user)) false
  connection.query(`SELECT * FROM finaltable WHERE email_address = ? `,[user],
  (err,row)=>{
    if(err) throw err
      if(row.length>=1 && row[0].email_address!=user.name)
        return false
      
  });
  return true
  
}


// @route   POST api/users
// @desc    Register new user
// @access  Public
router.post('/', (req, res) => {
  // console.log(typeof createBill)
  console.log("Here")
  const { first_name,last_name, email_address, password } = req.body;
  // console.log(req.body)
  var check = false;

  // Simple validationr
  if(!first_name ||!last_name || !email_address || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }
  //Validate Email
  if(!validator.validate(email_address)){
    return res.status(400).json({msg:"Enter correct email address"})
  }

  //Check if email already exists
  connection.query(`SELECT * FROM finaltable WHERE email_address = ? `,[email_address],
  (err,row)=>{
    if (err) {
      return res.status(500).json({msg: "Database Error"})
    }

  //Validate passwords
  if(!validatePass(password)){
    return res.status(400).json({msg: 'Password should minimus of 8 characters and be a combination of uppercase, lowercase, and digits'})

  }

    if(row.length>=1){
      return res.status(400).json({
        msg: "user exists"
      });
    }
    else{
      var newUser = {
        first_name,
        last_name,
        email_address,
        password
      }
      
      var date=new Date() //Creating date for created_time
      
      // Create salt & hash
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if(err) throw err;
          newUser.password = hash;

          var id = uuidv4(); //Generating uuid
          connection.query(
            `insert into finaltable(id,first_name, last_name, email_address, password, account_created, account_updated) 
                      values(?,?,?,?,?,?,?)`,
            [ id,
              newUser.first_name,
              newUser.last_name,
            
              newUser.email_address,
              newUser.password,
              date,
              date
            ],
            (error, results, fields) => {
              if (error) {
                console.log(error);
                res.status(500).json({
                  msg:"Databse error"
                })
              }
              else{
                const {password,... data} = req.body 
                
                 
                 
                return res.status(201).json({
                  ...data,
                  account_created: date,
                  account_updated: date
                })
              }
            })
          
            
        })
      })

    }
  });
  
});











router.get('/self', authetnticate,getreq)
router.put('/self',authenticate,putreq)
router.post('/bill',authenticate,services.createBill)
router.get('/bills',authenticate,services.getAllBills)
router.put('/bill/:id',authenticate,billAuth,services.updateBill)
router.delete('/bill/:id',authenticate,billAuth,services.deleteBill)
router.get('/bill/:id',authenticate,billAuth,services.getBill)



module.exports = router;
