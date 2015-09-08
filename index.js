var imgWidth;
var imgHeight;

$('form').change( function() {
	file = $('#input-file').get(0).files[0];
	if(!file) return;
	
	tmpPath = URL.createObjectURL(file);
	var img = $('#thumbnail').attr('src', tmpPath).get(0);

	img.onload = function() {
		$('#text-content').empty();
		var img = new Image();
		img.src = tmpPath;
		
		imgWidth = img.width == 0 ? imgWidth : img.width;
		imgHeight = img.height == 0 ? imgHeight : img.height;
		
		// nb braille points we can draw on the screen
		var screenWidth  = $('#max-width').is(":checked") ? $(window).width() / 3.5 : $('#width').val();
		var screenHeight = ($(window).height() - $('form').height() - 10 ) / 3;
		$('#width').prop('max', $(window).width() / 3.5);
		var ratio = imgWidth / imgHeight;
		var width; var height;
		
		if (ratio > screenWidth/screenHeight) {
			width  = 2 * Math.floor(screenWidth / 2);
			height = 4 * Math.floor((width/ratio) / 4);
		} else {
			height = 4 * Math.floor(screenHeight / 4);
			width  = 2 * Math.floor(height*ratio / 2);
			$('#text-content').css('margin-top', (screenHeight*3 - height*3) / 2);
		}
		$('#text-content').css('margin-top', (screenHeight*3 - height*3) / 2);
		
		$('canvas').prop('width', width).prop('height', height);
		$('#text-content').css('width', width*3.5).css('height', height*3 + 2);
		
		var ctx = $('#original').get(0).getContext('2d');
		ctx.drawImage(img, 0, 0, width, height);
		
		try {
			var imageData = monochrome(ctx.getImageData(0, 0, width, height), $('#threshold').val(), $('#type').val());
			var canvas = $('#dither');
			var ctx = canvas.get(0).getContext('2d');

			ctx.putImageData(imageData, 0, 0);
			ctx.imageSmoothingEnabled = false;
		} catch(error) {
			console.log(error);
		}
	};
});

$(window).resize(function() {
	$('form').trigger('change');
});

// TODO: implémenter ordered ? https://en.wikipedia.org/wiki/Ordered_dithering
// cf. aussi code de machin

// 5. braille !

// 6. tester avec webcam ?
// https://github.com/idevelop/camera.js
// https://github.com/idevelop/ascii-camera
