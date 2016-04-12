var socket = io.connect(),
	key   = key(4),
	session_results = {};


function key(size){
	var key='';
	for(i=0; i<size; i++){
		var alea = String(Math.floor(Math.random()*10));
		key = key+alea;
	}
	return key;
}

if (Modernizr.touchevents) { 
    document.location.href="/../../mobile.html";
} else { 
    socket.emit('desktop-key', key);
    $('.connection p').html(key);
}

socket.on('question', function(question, number){
	$('.connection').hide();
	$('.question').show();

	$('.question').html(question)
});

socket.on('results', function(results){
	session_results = results;
	$('.question').hide();
	$('.results').show();

	$('.results .question-0').html('a :'+session_results.question_0.a+' b:'+session_results.question_0.b);
	$('.results .question-1').html('a :'+session_results.question_1.a+' b:'+session_results.question_1.b);
	$('.results .question-2').html('a :'+session_results.question_2.a+' b:'+session_results.question_2.b);
	$('.results .question-3').html('a :'+session_results.question_3.a+' b:'+session_results.question_3.b);
});