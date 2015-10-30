$(function(){
	var query = purl().attr('query');
	$('#start').on('click', function(){
		window.location.href = g.mPlayUrl + '?' + query;
	});
});
