// Thanks to https://github.com/meemoo/iframework/blob/gh-pages/src/nodes/image-monochrome-worker.js

var bayerThresholdMap = [
	[  15, 135,  45, 165 ],
	[ 195,  75, 225, 105 ],
	[  60, 180,  30, 150 ],
	[ 240, 120, 210,  90 ]
];

var lumR = [];
var lumG = [];
var lumB = [];
for (var i=0; i<256; i++) {
	lumR[i] = i*0.299;
	lumG[i] = i*0.587;
	lumB[i] = i*0.114;
}

var braille_cars = '⠀⠁⠈⠉⠂⠃⠊⠋⠐⠑⠘⠙⠒⠓⠚⠛⠄⠅⠌⠍⠆⠇⠎⠏⠔⠕⠜⠝⠖⠗⠞⠟⠠⠡⠨⠩⠢⠣⠪⠫⠰⠱⠸⠹⠲⠳⠺⠻⠤⠥⠬⠭⠦⠧⠮⠯⠴⠵⠼⠽⠶⠷⠾⠿⡀⡁⡈⡉⡂⡃⡊⡋⡐⡑⡘⡙⡒⡓⡚⡛⡄⡅⡌⡍⡆⡇⡎⡏⡔⡕⡜⡝⡖⡗⡞⡟⡠⡡⡨⡩⡢⡣⡪⡫⡰⡱⡸⡹⡲⡳⡺⡻⡤⡥⡬⡭⡦⡧⡮⡯⡴⡵⡼⡽⡶⡷⡾⡿⢀⢁⢈⢉⢂⢃⢊⢋⢐⢑⢘⢙⢒⢓⢚⢛⢄⢅⢌⢍⢆⢇⢎⢏⢔⢕⢜⢝⢖⢗⢞⢟⢠⢡⢨⢩⢢⢣⢪⢫⢰⢱⢸⢹⢲⢳⢺⢻⢤⢥⢬⢭⢦⢧⢮⢯⢴⢵⢼⢽⢶⢷⢾⢿⣀⣁⣈⣉⣂⣃⣊⣋⣐⣑⣘⣙⣒⣓⣚⣛⣄⣅⣌⣍⣆⣇⣎⣏⣔⣕⣜⣝⣖⣗⣞⣟⣠⣡⣨⣩⣢⣣⣪⣫⣰⣱⣸⣹⣲⣳⣺⣻⣤⣥⣬⣭⣦⣧⣮⣯⣴⣵⣼⣽⣶⣷⣾⣿';

function monochrome(imageData, threshold, type) {
	var imageDataLength = imageData.data.length;
	
	// Greyscale luminance (sets r pixels to luminance of rgb)
	for (var i = 0; i <= imageDataLength; i += 4) {
		imageData.data[i] = Math.floor(lumR[imageData.data[i]] + lumG[imageData.data[i+1]] + lumB[imageData.data[i+2]]);
	}

	var w = imageData.width;
	var newPixel, err;

	var line = '';
	
	for (var currentPixel = 0; currentPixel <= imageDataLength; currentPixel+=4) {

		var x = currentPixel/4 % w;
		var y = Math.floor(currentPixel/4 / w);

		if (type === 'none') {
			// No dithering
			imageData.data[currentPixel] = imageData.data[currentPixel] < threshold ? 0 : 255;
		} else if (type === 'bayer') {
			// 4x4 Bayer ordered dithering algorithm
			var map = Math.floor( (imageData.data[currentPixel] + bayerThresholdMap[x%4][y%4]) / 2 );
			imageData.data[currentPixel] = (map < threshold) ? 0 : 255;
		} else if (type === 'floyd') {
			// Floyd–Steinberg dithering algorithm
			newPixel = imageData.data[currentPixel] < 129 ? 0 : 255;
			err = Math.floor((imageData.data[currentPixel] - newPixel) / 16);
			imageData.data[currentPixel] = newPixel;

			imageData.data[currentPixel       + 4 ] += err*7;
			imageData.data[currentPixel + 4*w - 4 ] += err*3;
			imageData.data[currentPixel + 4*w     ] += err*5;
			imageData.data[currentPixel + 4*w + 4 ] += err*1;
		} else {
			// Bill Atkinson's dithering algorithm
			newPixel = imageData.data[currentPixel] < 129 ? 0 : 255;
			err = Math.floor((imageData.data[currentPixel] - newPixel) / 8);
			imageData.data[currentPixel] = newPixel;

			imageData.data[currentPixel       + 4 ] += err;
			imageData.data[currentPixel       + 8 ] += err;
			imageData.data[currentPixel + 4*w - 4 ] += err;
			imageData.data[currentPixel + 4*w     ] += err;
			imageData.data[currentPixel + 4*w + 4 ] += err;
			imageData.data[currentPixel + 8*w     ] += err;
		}

		// Set g and b pixels equal to r
		imageData.data[currentPixel + 1] = imageData.data[currentPixel + 2] = imageData.data[currentPixel];
		
		// --------------------- TODO ---------------------
		
		/*if(currentPixel%4 == 0) {
			line += (imageData.data[currentPixel] == 0) ? '-' : 'o';
			if(x == w-1) { // end of line
				$('#text-content').append('<p>' + line + '</p>');
				line = '';
			}
		}*/

		if(x == w-1 && y%4 == 3) { // at the en of each 4 lines blocks
			//$('#text-content').append('<p>x == w-1 && y%4 == 3</p>');
			// hard stuff here
			var line = '';
			for(var c = 0 ; c<w ; c+=2) {
				var i = currentPixel/4 + c;
				car = ((imageData.data[4*(i-4*w  )] == 0) ? 0:1)
				    + ((imageData.data[4*(i-4*w+1)] == 0) ? 0:2)

				    + ((imageData.data[4*(i-3*w  )] == 0) ? 0:4)
				    + ((imageData.data[4*(i-3*w+1)] == 0) ? 0:8)

				    + ((imageData.data[4*(i-2*w  )] == 0) ? 0:16)
				    + ((imageData.data[4*(i-2*w+1)] == 0) ? 0:32)

				    + ((imageData.data[4*(i-  w  )] == 0) ? 0:64)
				    + ((imageData.data[4*(i-  w+1)] == 0) ? 0:128);
					
					line += braille_cars[255-car];
			}
			$('#text-content').append('<p>' + line + '</p>');
		}
	}

	return imageData;
}
