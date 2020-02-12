const bcrypt = require("bcryptjs");
const connection = require("../../config");
var auth = require("basic-auth");

validatePass = pass => {
  var schema = new passwordValidator();
  schema
    .is()
    .min(8)
    .has()
    .uppercase()
    .has()
    .lowercase()
    .has()
    .digits();
  return schema.validate(pass);
};

validateEmail = user => {
  if (!validator.validate(user)) false;
  connection.query(
    `SELECT * FROM finaltable WHERE email_address = ? `,
    [user],
    (err, row) => {
      if (err) throw err;
      if (row.length >= 1 && row[0].email_address != user.name) return false;
    }
  );
  return true;
};

getreq = (req, res) => {
  var user = res.locals.user;
  connection.query(
    `SELECT * FROM finaltable  WHERE email_address = ?`,
    [user],
    (err, row, fields) => {
      const { password, ...pl } = row[0];
      res.status(200).json(pl);
    }
  );
};

putreq = (req, res) => {
  var user = res.locals.user;
  const { first_name, last_name, email_address, password } = req.body;

  //Simple Validations
  if (!first_name || !last_name || !email_address || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  if (!validatePass(password)) {
    return res.status(400).json({ msg: "Please Enter a Strong Password" });
  }

  if (!validateEmail(user)) {
    return res.status(400).json({ msg: "Enter correct Email" });
  }

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) throw err;
      var new_password = hash;
      var ud = new Date();
      const queryStr = `UPDATE finaltable SET first_name = ?, last_name = ?, email_address = ?, password = ?, account_updated = ? WHERE email_address = ?`;
      connection.query(
        queryStr,
        [first_name, last_name, email_address, new_password, ud, user],
        (err, row, fields) => {
          if (err) {
            console.error(err);
            res.status(500).json({
              // succ: "-1",
              msg: "Database Error"
            });
          }
          // console.log(row)
          res.status(204);
          res.end();
        }
      );
    });
  });
};

module.exports = { getreq, putreq };
