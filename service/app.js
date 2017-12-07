'use strict';

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const configStore = require('./configStore/configStore');
const app = express();

app.use(morgan('dev'));

app.use(bodyParser.json());

app.use('/config',configStore);


app.get('/', function (request,response){
	response.send('Hello World');
});



const port = 3000;
app.listen(port,() => {
	console.log(`Server listening on port ${port}`);

});
