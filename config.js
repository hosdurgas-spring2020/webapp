
var mysql      = require('mysql');
require('dotenv').config({path:'../userdata.env'})
var connection = mysql.createConnection({
  host     :  process.env.HOST,
  user     :  process.env.USERNAME,
  password : process.env.PASSWORD,
  database : 'csye'


});
connection.connect((err)=>{
if(!err) {
    console.log("Database is  connected");
    let q = `CREATE TABLE IF NOT EXISTS bill_table (
        id varchar(45) NOT NULL,  
        created_ts varchar(45) DEFAULT NULL,
        updated_ts varchar(45) DEFAULT NULL,
        owner_id varchar(45) DEFAULT NULL,
        vendor varchar(45) DEFAULT NULL,
        bill_date varchar(45) DEFAULT NULL,
        due_date varchar(45) DEFAULT NULL,
        amount_due varchar(45) DEFAULT NULL,
        categories varchar(500) DEFAULT NULL,
        paymentStatus enum('paid',' due',' past_due',' no_payment_required') DEFAULT NULL,
        attachments varchar(45) DEFAULT NULL,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1`
      connection.query(q,(err,row) => {
          if(err) return console.log(err);
          let q2 = `CREATE TABLE IF NOT EXISTS filedata_table (
            bill_id varchar(45) DEFAULT NULL,
            file_name varchar(45) DEFAULT NULL,
            url varchar(45) DEFAULT NULL,
            uploaded_on varchar(45) DEFAULT NULL,
            file_id varchar(45) NOT NULL,
            md5 varchar(45) DEFAULT NULL,
            size varchar(45) DEFAULT NULL,
            PRIMARY KEY (file_id),
            UNIQUE KEY id_UNIQUE (bill_id),
            KEY fk_idx (bill_id)
          ) ENGINE=InnoDB DEFAULT CHARSET=latin1`
          connection.query(q2,(err,res) =>{
            if(err) return console.log(err)
            let q3 = `CREATE TABLE IF NOT EXISTS finaltable (
              id varchar(45) NOT NULL,
              first_name varchar(45) DEFAULT NULL,
              last_name varchar(45) DEFAULT NULL,
              email_address varchar(45) DEFAULT NULL,
              password varchar(450) DEFAULT NULL,
              account_created varchar(45) DEFAULT NULL,
              account_updated varchar(45) DEFAULT NULL,
              PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`
            connection.query(q3,(err,res) =>{
              if(err) return console.log(err)
              console.log("All tables Successfully Created")
            }) 
            
          })
          
      })
    
    // connection.destroy();//Remove
   

} else {
    console.log("Error while connecting with database");
}
});
module.exports = connection; 