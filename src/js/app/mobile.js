var socket = io(),
	mobile_key,
	current_player = {},
	lol=0;

console.log(lol);
$('.mobile_key').submit(function(e){
	mobile_key = $('.key').val();


	socket.emit('mobile-key', mobile_key);

	e.preventDefault();
	$('.key').val('');
  	return false;
});

socket.on('access-granted', function(player, pickit){
	current_player = player;

	current_player.online  = true;

	$('.mobile_key').hide();
	$('.waiting').show();
	socket.emit('connected', current_player);
});

socket.on('access-denied', function(player, pickit){
	$('.waiting').hide();
	$('.results').hide();
    $('.answer').hide();

	$('.mobile_key').show();
});

socket.on('question', function(question, number){
	$('.waiting').hide();

	answer(number);	
});

socket.on('results', function(results){
	$('.waiting').hide();
	$('.results').show();

	$('div').off();
});

function answer(number){
	console.log('.answers-'+number);

	$('.answers-'+number).show();	

	$('.answers-'+number+' .choice').on('click', function(){
		console.log('click');
		current_player.answers['question_'+number] = $(this).attr('name');

		$('.answers-'+number).hide();
		$('.waiting').show();
	
		socket.emit('answer', current_player);
	});	
};