const express = require('express');
const path = require('path');
const app = express();

// Bodyparser Middleware
app.use(express.json());

// Use Routes
// app.use('/api/items', require('./routes/api/items'));

app.use('/v1/user', require('./routes/api/users'));


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
