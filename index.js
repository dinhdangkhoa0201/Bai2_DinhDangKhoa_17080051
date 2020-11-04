require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const indexRoute = require('./route/index.route');
const app = express();
const port = 3000;

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.listen(port, function (){
    console.log("Kết nối thành công, port ", port);
})

app.use("", indexRoute);

