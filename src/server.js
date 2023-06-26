require('dotenv').config();
const express = require('express');
const app = express(), morgan = require('morgan');
const mongoose = require('mongoose'), cors = require('cors');
const { port, mongoUrl } = process.env;
const mainRouter = require('../routers/index.js');

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB.....'))
    .catch(err => console.log(err));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());

app.use('/api', mainRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));