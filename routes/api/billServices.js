const bcrypt = require("bcryptjs");
const connection = require("../../config");
var auth = require("basic-auth");
const uuidv4 = require("uuid/v4");
const fileServices = require("./fileServices");

checkEnum = ps => {
  if (
    ps == "paid" ||
    ps == "due" ||
    ps == "no_payment_required" ||
    ps == "past_due"
  )
    return true;
  return false;
};

createBill = (req, res) => {
  const email_address = res.locals.user;
  const {
    vendor,
    bill_date,
    due_date,
    amount_due,
    categories,
    paymentStatus
  } = req.body;

  if (
    vendor == null ||
    bill_date == null ||
    due_date == null ||
    categories == null ||
    amount_due == null
  ) {
    return res.status(400).json({ msg: "Enter all details" });
  }
  if (!checkEnum(paymentStatus))
    return res.status(401).json({
      msg: "Payment Status can be only paid, due, past_due, no_payment_required"
    });

  var new_cat = "";
  for (i in categories) {
    new_cat = new_cat + categories[i] + ",";
  }
  new_cat1 = "[" + new_cat.slice(0, new_cat.length - 1) + "]";

  console.log(new_cat1);
  var date = new Date();

  const queryStr = `INSERT INTO bill_table (id, created_ts, updated_ts, owner_id, vendor, bill_date, due_date, amount_due,categories,paymentStatus) VALUES (?,?,?,(SELECT id FROM finaltable WHERE email_address = ?),?,?,?,?,?,?) `;
  var id = uuidv4();
  connection.query(
    queryStr,
    [
      id,
      date,
      date,
      email_address,
      vendor,
      bill_date,
      due_date,
      amount_due,
      new_cat1,
      paymentStatus
    ],
    (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ msg: "Database Error" });
      }

      connection.query(
        `SELECT * FROM bill_table WHERE id = ?`,
        [id],
        (err, row) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ msg: "Database Error" });
          }
          return res.status(200).json(row);
        }
      );
    }
  );
};

getAllBills = (req, res) => {
  console.log(res.locals);
  connection.query(
    `SELECT * FROM
    (SELECT *
        FROM bill_table
        LEFT JOIN filedata_table
        ON bill_table.attachments = filedata_table.file_id 
     ) AS T
    WHERE owner_id = ?;`,
    [res.locals.ownerid],
    (err, row) => {
      // console.log(row);
      if (err) return res.status(500).json({ msg: "Database Error" });
      if (row.length == 0) {
        return res.status(400).json({
          msg: "No bills exist"
        });
      }
      let pl = row.map(val => {
        if (val.attachments != null) {
          let { file_name, file_id, url, uploaded_on, bill_id, ...ren } = val;
          let filedata = {
            file_name,
            id: file_id,
            url,
            uploaded_on
          };

          let ret = {
            ...ren,
            attachments: filedata
          };
          return ret;
        } else {
          let { file_name, file_id, url, uploaded_on, bill_id, ...ret } = val;
          return ret;
        }
      });

      return res.status(200).json(pl);
    }
  );
};

updateBill = (req, res) => {
  const billid = req.params.id;
  const {
    vendor,
    bill_date,
    amount_due,
    due_date,
    categories,
    paymentStatus
  } = req.body;

  if (
    vendor == null ||
    bill_date == null ||
    due_date == null ||
    categories == null ||
    amount_due == null
  ) {
    return res.status(400).json({ msg: "Enter all details" });
  }
  if (!checkEnum(paymentStatus))
    return res.status(401).json({
      msg: "Payment Status can be only paid, due, past_due, no_payment_required"
    });

  var date = new Date();
  var new_cat = "";
  for (i in categories) {
    new_cat = new_cat + categories[i] + ",";
  }

  new_cat1 = "[" + new_cat.slice(0, new_cat.length - 1) + "]";
  queryStr = `UPDATE  bill_table  SET   updated_ts  =  ?  ,  vendor  =  ? ,  bill_date  =  ? ,  due_date  =  ? ,  amount_due  =  ? ,  categories  =  ? ,  paymentStatus  =  ?  WHERE ( id  =  ? );`;
  connection.query(
    queryStr,
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
    (err, row) => {
      if (err) {
        console.error(err);
        res.status(500).json({ msg: "Database Error" });
      }

      if (row.affectedRows == 0)
        return res.status(400).json({ msg: "Bill Doesn't Exist" });
      connection.query(
        `SELECT * FROM bill_table WHERE id = ?`,
        [billid],
        (err, row) => {
          if (err) return res.status(500).json({ msg: "Database Error" });
          const { owner_id, ...pl } = row[0];
          return res.status(200).json([pl]);
        }
      );
    }
  );
};

deleteBill = (req, res) => {
  const billid = req.params.id;
  connection.query(
    `DELETE FROM bill_table WHERE (id = ?)`,
    [billid],
    (err, row) => {
      if (err) return res.status(500).json({ msg: "Database Error" });
      if (row.affectedRows == 0)
        return res.status(400).json({ msg: "Bill Doesn't Exist" });
      // console.log(row);

      if (res.locals.attachments != null) {
        fileServices.deleteFile(req, res);
      }

      // console.log(row)
      else return res.status(204).json();
    }
  );
};

getBill = (req, res) => {
  const billid = req.params.id;
  console.log(billid);
  connection.query(
    "SELECT * FROM bill_table WHERE id = ?",
    [billid],
    (err, row) => {
      if (err) return res.status(500).json({ msg: "Database Error1" });
      if (row.length == 0) return res.status(401).json({ msg: "No such bill" });
      if (row[0].attachments != null) {
        getAttachments(row[0], billid, res, pl => {
          res.status(200).json(pl);
        });
      } else {
        return res.status(200).json(row[0]);
      }
    }
  );
};

getAttachments = (row, billid, res, callback) => {
  connection.query(
    `SELECT * from filedata_table WHERE id = ?`,
    [billid],
    (err, row1) => {
      if (err) {
        console.log(err + "here");
        return res.status(500).json({ msg: "Database Error" });
      }
      let { id, ...pl1 } = row1[0];
      let pl = { ...row, attachments: pl1 };
      console.log(pl);
      return callback(pl);
    }
  );
};

module.exports = { createBill, getAllBills, updateBill, deleteBill, getBill };
