const bcrypt = require('bcryptjs');
const connection = require('../../config')
var auth = require('basic-auth');
const uuidv4 = require('uuid/v4');



createBill = (req,res) => {
    const email_address = res.locals.user
    const {
        vendor,
        bill_date,
        amount_due,
        due_date,
        categories,
        paymentStatus
    } = req.body
    var new_cat=''
    for (i in categories){
        new_cat=new_cat+categories[i]+","
    }
    new_cat1 = "["+new_cat.slice(0,new_cat.length-1)+"]"
   
    console.log(new_cat1)
    var date = new Date()
    
    const queryStr = `INSERT INTO bill_table (id, created_ts, updated_ts, owner_id, vendor, bill_date, due_date, amount_due,categories,paymentStatus) VALUES (?,?,?,(SELECT id FROM finaltable WHERE email_address = ?),?,?,?,?,?,?) `
    var id = uuidv4();
    connection.query(queryStr,
        [id,
        date,
        date,
        email_address,
        vendor,
        bill_date,
        due_date,
        amount_due,
        new_cat1,
        paymentStatus
        
    ]
    ,(err,row) =>{
        if (err) {
            console.error(err)
            return res.status(500).json({msg:"Database Error"})
        }
        
        connection.query(`SELECT * FROM bill_table WHERE id = ?`,[id],
        (err,row) => {
                if (err) return res.status(500).json({msg:"Database Error"})
                return res.status(200).json(row)
        });
    });

}


getAllBills = (req,res) => {
    console.log(res.locals.ownerid)
    connection.query(`SELECT * FROM bill_table WHERE owner_id = ?`,[res.locals.ownerid],
    (err,row) => {
        if (err) return res.status(500).json({msg:"Database Error"})
        return res.status(200).json(row)
    });

}







module.exports = {createBill, getAllBills}