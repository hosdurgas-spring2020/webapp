const connection = require('../../config')

module.exports = billAuth = (req,res,next) => {
    
    const ownerid = res.locals.ownerid;
    console.log(ownerid)
    connection.query(`select owner_id from bill_table where id =?`,[req.params.id]
    ,(err,row) => {
        console.log(row[0].owner_id)
        if(ownerid == row[0].owner_id){
            return next()
        }
    
        return res.status(401).json({msg:"Unauthorized Access"})
        });
}