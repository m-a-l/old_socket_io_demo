//SERVER INITIALISATION
var express = require('express'),
    app     = express(),
    server  = require('http').Server(app),
    io      = require('socket.io').listen(server);

app.use(express.static('src')); // allows to import css images and javascript

server.listen(process.env.PORT || 8080, function () {
  console.log('Example app listening on port 8080!');
});

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});
///////////////////////////////////////////////////////////////
//Connection variables
var pickit = {};

pickit.key     = '';
pickit.players = {};
pickit.players_number = 2;

pickit.questions = ['question 1', 'question 2', 'question 3', 'question 4'];
pickit.current_question = 0;
pickit.number_of_answers = 0;

pickit.results = {};


io.sockets.on('connection', function (socket){
	console.log('connection');
    console.log('socket', socket.id);

    socket.on('desktop-key', function(key) {

    	pickit.key = key;
        console.log('key : ' + key);

    });

    socket.on('mobile-key', function(mobile_key) {

    	if(pickit.key == mobile_key){
    		var size = Object.keys(pickit.players).length;
    		if(size<pickit.players_number){
    			pickit.players['player_'+size]         = {};
    			pickit.players['player_'+size].id      = socket.id;
    			pickit.players['player_'+size].number  = size;
    			pickit.players['player_'+size].answers = {};
    			pickit.players['player_'+size].online  = false;

    			io.to(pickit.players['player_'+size].id).emit('access-granted', pickit.players['player_'+size], pickit);
 	
    		}
    		else{
    			console.log('too many');
    		}
    		
    	}
    	else{
    		console.log('go home you noob');
    	}
        console.log(' mobile key : ' + mobile_key);

    });

	socket.on('connected', function(player){
    	pickit.players['player_'+player.number] = player;

    	if(pickit.players['player_'+player.number].number+1 == pickit.players_number){
    		console.log('everybody here !');
    		questions(pickit.current_question);
    	}
    });

    socket.on('answer', function(player){
    	pickit.number_of_answers++;
    	pickit.players['player_'+player.number] = player;

    	if(pickit.number_of_answers == pickit.players_number){
    		pickit.number_of_answers=0;
    		pickit.current_question++;
    		questions(pickit.current_question);
    	}
    });
});

function questions(number){
	var size = pickit.questions.length;

    if(number == size){
    	results();
    	io.sockets.emit('results', pickit.results);

    }
    else{
    	 io.sockets.emit('question', pickit.questions[number], number);
    }
};

function results(){
	var size = Object.keys(pickit.players).length;

		for(var j=0; j<pickit.current_question; j++){ //current question
				pickit.results['question_'+j] = {};
				pickit.results['question_'+j].a =0;
				pickit.results['question_'+j].b =0;

				for(var i=0; i<size;i++){
					if(pickit.players['player_'+i].answers['question_'+j]=='a')
						pickit.results['question_'+j].a++
					else if(pickit.players['player_'+i].answers['question_'+j]=='b')
						pickit.results['question_'+j].b++
				}
				
		
			}


	console.log(pickit.results);
	
}


