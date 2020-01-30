const connection = require('../../config')

module.exports = billAuth = (req,res,next) => {
    
    const ownerid = res.locals.ownerid;
    // console.log(ownerid)
    connection.query(`select owner_id from bill_table where id =?`,[req.params.id]
    ,(err,row) => {
        if(err) res.status("500").json({msg:"Database Error"})
        // console.log(row[0].owner_id)
        if(row.length == 0) return res.status(404).json({msg:"No such bills"})
        if(ownerid == row[0].owner_id){
            console.log("HERE")
            return next()
        }

        return res.status(401).json({msg:"Unauthorized Access"})
        });
}