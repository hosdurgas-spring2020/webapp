const bcrypt = require('bcryptjs');
const connection = require('../../config')
var auth = require('basic-auth');
const uuidv4 = require('uuid/v4');

checkEnum = (ps) =>{
    if (ps == 'paid' || ps == 'due' || ps == 'no_payment_required' || ps == 'past_due')
        return true
    return false
}



createBill = (req,res) => {
    const email_address = res.locals.user
    const {
        vendor,
        bill_date,
        due_date,
        amount_due,

        categories,
        paymentStatus
    } = req.body

    if(!checkEnum(paymentStatus)) return res.status(401).json({msg:"Payment Status can be only paid, due, past_due, no_payment_required"})
    
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
                if (err) { 
                    console.error(err)
                    return res.status(500).json({msg:"Database Error"})
                }
                return res.status(200).json(row)
        });
    });

}


getAllBills = (req,res) => {
    console.log(res.locals.ownerid)
    connection.query(`SELECT * FROM bill_table WHERE owner_id = ?`,[res.locals.ownerid],
    (err,row) => {
        if (err) return res.status(500).json({msg:"Database Error"})
        if(row.length==0){
            return res.status(400).json({
              msg:"No bills exist"
            });
        }
        return res.status(200).json(row)
    });

}

updateBill = (req,res) =>{
    
    const billid = req.params.id
    const {
        vendor,
        bill_date,
        amount_due,
        due_date,
        categories,
        paymentStatus
    } = req.body
    var date = new Date()
    var new_cat=''
    for (i in categories){
        new_cat=new_cat+categories[i]+","
    }

    new_cat1 = "["+new_cat.slice(0,new_cat.length-1)+"]"
    queryStr = `UPDATE  bill_table  SET   updated_ts  =  ?  ,  vendor  =  ? ,  bill_date  =  ? ,  due_date  =  ? ,  amount_due  =  ? ,  categories  =  ? ,  paymentStatus  =  ?  WHERE ( id  =  ? );` 
    connection.query(queryStr,
        [
            date,
            vendor,
            bill_date,
            due_date,
            amount_due,
            new_cat1,
            paymentStatus,
            billid
        ],
        (err,row) =>{
            
            if (err) {
            console.error(err)
            res.status(500).json({msg:"Database Error"})
            }
            
            if(row.affectedRows == 0)
                return res.status(400).json({msg:"Bill Doesn't Exist"})
            connection.query(`SELECT * FROM bill_table WHERE id = ?`,[billid],
            (err,row) => {
                if (err) return res.status(500).json({msg:"Database Error"})
                const {owner_id, ...pl} = row[0]
                return res.status(200).json([pl])
        });
            
    });
}


deleteBill = (req,res) => {
    const billid = req.params.id
    connection.query(`DELETE FROM bill_table WHERE (id = ?)`,[billid],
    (err,row) => { 
        if (err) return res.status(500).json({msg:"Database Error"})
        if(row.affectedRows == 0)
        return res.status(400).json({msg:"Bill Doesn't Exist"})
        // console.log(row)
        return res.status(204).json()
    }
    );
}


getBill = (req,res) =>{
    const billid = req.params.id
    console.log(billid)
    connection.query('SELECT * FROM bill_table WHERE id = ?',[billid],
    (err,row) => {
        if (err) 
            return res.status(500).json({msg:"Database Error"})
        if(row.length == 0) return res.status(401).json({msg:"No such bill"})
        return res.status(200).json(row[0])
    });
}




module.exports = {createBill, getAllBills, updateBill,deleteBill,getBill}