require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('./utils/db');

// controllers
const errorController = require('./controllers/error');

// routes
const authRoute = require('./routes/auth')
const emailRoute = require('./routes/email');

// app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());
app.use(bodyParser.json())


app.use('/api',authRoute);
app.use('/api', emailRoute);


app.use(errorController.error404handler);

app.listen(process.env.PORT_SERVER,() => console.log(`Server started on port ${process.env.PORT_SERVER}`));

