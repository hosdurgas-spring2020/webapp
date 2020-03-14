const express = require("express");
const path = require("path");
const app = express();
const fileUpload = require("express-fileupload");

// Bodyparser Middleware
app.use(express.json());

app.use(fileUpload());

// Use Routes
// app.use('/api/items', require('./routes/api/items'));

app.use("/v2/", require("./routes/api/users"));

app.post("/upload", (req, res) => {
  console.log(req.files);
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
