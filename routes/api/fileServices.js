const bcrypt = require("bcryptjs");
const connection = require("../../config");
var auth = require("basic-auth");
const uuidv4 = require("uuid/v4");
var fs = require("fs");

// console.log("hello")
postFile = (req, res) => {
  console.log(req.files.file);
  const billid = req.params.id;

  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send("No files were uploaded.");
    return;
  }
  const file = req.files.file;
  const fileid = uuidv4();

  let file_name = billid.slice(0, 7);
  let extension = file.mimetype.split("/")[1];
  let uploadPath = "uploads/" + file_name + "." + extension;

  if (
    !(
      extension == "jpeg" ||
      extension == "pdf" ||
      extension == "png" ||
      extension == "jpg"
    )
  )
    return res
      .status(400)
      .json({ msg: "Files should be jpg, jpeg, pdf or png" });

  file.mv(uploadPath, err => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }

    queryStr = `INSERT INTO filedata_table (bill_id,file_id, file_name, url, uploaded_on) VALUES(?,?,?,?,CURDATE())`;
    connection.query(
      queryStr,
      [billid, fileid, file_name + "." + extension, uploadPath],
      (err, row) => {
        if (err) {
          if (err.code == "ER_DUP_ENTRY")
            return res
              .status(500)
              .json({ msg: "Bill Can have only one attachment" });
          return res.status(500).json({ msg: "Databases Error" });
        }
        connection.query(
          `UPDATE bill_table SET attachments = ? WHERE (id = ?) `,
          [fileid, billid],
          (err, row) => {
            if (err) {
              return res.status(500).json({ msg: "Databases Error" });
            }
            let pl = {
              file_name: file_name + "." + extension,
              id: fileid,
              url: uploadPath,
              uploaded_on: new Date().toISOString().slice(0, 10)
            };
            return res.status(201).json(pl);
          }
        );
      }
    );
  });
};

deleteFile = (req, res) => {
  const billid = req.params.id;

  // console.log(fileid)
  connection.query(
    "SELECT * FROM filedata_table WHERE bill_id = ?",
    [billid],
    (err, row) => {
      if (err) return res.status(500).send(err);
      if (row.length == 0) return res.status(500).json({ msg: "No such file" });
      const fileid = row[0].file_id;
      let path = row[0].url;
      connection.query(
        `DELETE FROM filedata_table WHERE (file_id = ?)`,
        fileid,
        (err, row) => {
          if (err) return res.status(500).json({ msg: "Database Error" });
          if (row.affectedRows == 0)
            return res.status(400).json({ msg: "Bill Doesn't Exist" });
          // console.log(row)
          try {
            fs.unlinkSync(path);
          } catch (err) {
            console.log(err);
          }

          return res.status(204).json();
        }
      );
    }
  );
};

getFile = (req, res) => {
  const fileid = req.params.fileid;
  connection.query(
    "SELECT * FROM filedata_table WHERE file_id = ?",
    [fileid],
    (err, row) => {
      if (err) return res.status(500).json({ msg: "Database Error" });
      if (row.length == 0 || row == undefined)
        return res.status(401).json({ msg: "No such Files" });
      let { bill_id, ...pl } = row[0];
      return res.status(201).json(pl);
    }
  );
};

module.exports = { postFile, deleteFile, getFile };
