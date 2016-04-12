var Carousel = function($target)
{
	console.log($target);
};

Carousel.prototype.index=0;
Carousel.prototype.count=0;

Carousel.prototype.go_to = function(index){};
Carousel.prototype.next = function(){};
Carousel.prototype.prev = function(){};


var carousel = new Carousel($('.carousel'))

carousel.next();

var x_y = document.querySelector('.x_y')


objet.x_y = new Object; 