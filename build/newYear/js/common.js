(function(){
	$('.hm-audio').on('touchstart',function(){
		if($(this).hasClass('rotate')){
			$(this).removeClass('rotate');
			$(this).find('audio').get(0).pause();
		}
		else{
			$(this).addClass('rotate');
			$(this).find('audio').get(0).play();
		}
	})
})()