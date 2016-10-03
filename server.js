require('colors');

var express = require('express'),
	app = express(),
	logger = require('morgan'),
	bodyParser = require('body-parser'),
	port = process.env.PORT || 1337,
	Routes = require('./routes/index.js');
	path = require('path');

app.use(express.static(path.join(__dirname,'/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(logger('dev'));

Routes(app);

app.listen(port, (err)=>{
	if(err){
		console.log("There's errors, yo:", err)
	} else {
		console.log('Lemme show you my: '.cyan + port + ' skeelz.'.cyan);
	}
});

// Colors module: Emphasis: bold, italic, underline, inverse. Colors: yellow, cyan, white, magenta, green, red, grey, blue.
