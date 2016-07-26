var HomePage = (function() {
	'use strict';

	function demoAnimate ()
	{
		setTimeout(function () {
			$('h1').hide(400);
		}, 1000);
	}

	var HomePage = {
		init: demoAnimate
	};

	return HomePage;
}());

HomePage.init();