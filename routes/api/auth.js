var auth = require('basic-auth');
const bcrypt = require('bcryptjs');
const connection = require('../../config')

authetnticate=(req,res,next)=>{
    var isauth = false
  
    var user = auth(req);
    if(user==undefined||user==null){
    return res.status(400).json({msg: "Access Denied"})
    
     }
    connection.query(`SELECT * FROM finaltable  WHERE email_address = ?`,[user.name],
    (err,row,fields) => {
      
      if(err) {
        return res.status(500).json({msg:"Database Error"})
    
      }
      
      else{
        
        bcrypt.compare(user.pass,row[0].password)
        .then(isMatch => {
          if(!isMatch) return res.status(401).json({msg:"Unauthorized Access"})
  
          else{
            res.locals.ownerid = row[0].id
            res.locals.user = user.name
            next()
             
          }
          
      });
    }
    
    
 });
    
}

module.exports = authetnticate