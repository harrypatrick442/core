var ImageProcessing= new (function(){
	this[S.CROP] = function(params){
		var img = params[S.IMG];
		var imgWidthRaw = params[S.IMAGE_WIDTH_RAW];
		var imgHeightRaw= params[S.IMAGE_HEIGHT_RAW];
		var cropperWidth = params[S.CROPPER_WIDTH];
		var cropperHeight = params[S.CROPPER_HEIGHT];
		var cropperLeft= params[S.CROPPER_LEFT];
		var cropperTop = params[S.CROPPER_TOP];
		var format = params[S.FORMAT];
		var quality = params[S.QUALITY];
		var portionCanvas = E.CANVAS();	
		var portionCanvasContext = portionCanvas.getContext('2d');
		var finalCroppedDimensions = getFinalCroppedDimensions(params, cropperWidth, cropperHeight);
		var finalCroppedWidth = finalCroppedDimensions[S.WIDTH];
		var finalCroppedHeight = finalCroppedDimensions[S.HEIGHT];
		portionCanvas.width = finalCroppedWidth;
		portionCanvas.height = finalCroppedHeight;
		var bufferCanvas = E.CANVAS();
		var bufferCanvasContext = bufferCanvas.getContext('2d');
		bufferCanvas.width = img.width;
		bufferCanvas.height = img.height;
		bufferCanvasContext.drawImage(img, 0, 0,imgWidthRaw, imgHeightRaw,0,0, img.width, img.height);
		portionCanvasContext.drawImage(bufferCanvas, cropperLeft, cropperTop, cropperWidth, cropperHeight, 0, 0,
		finalCroppedWidth,
		finalCroppedHeight);
		/*
		document.documentElement.appendChild(bufferCanvas);
	bufferCanvas.style='poition:absolute; width:100px; height:100px; z-index:1000;';
		document.documentElement.appendChild(portionCanvas);
	portionCanvas.style='poition:absolute; width:100px; height:100px; z-index:1000;';*/
		return portionCanvas.toDataURL(format, quality);
	};
	function getFinalCroppedDimensions(params, canvasWidth, canvaHeight){
		var finalCroppedWidth;
		var finalCroppedHeight;
		if(params[S.DESIRED_WIDTH]){
			finalCroppedWidth = params[S.DESIRED_WIDTH];
			if(params[S.ASPECT_RATIO]){
				finalCroppedHeight = finalCroppedWidth/params[S.ASPECT_RATIO];
			}
			else if(params[S.DESIRED_HEIGHT]){
				finalCroppedHeight = params[S.DESIRED_HEIGHT];
			}
		}
		else{
			if(params[S.DESIRED_HEIGHT]){
				finalCroppedHeight = params[S.DESIRED_HEIGHT];
				if(params[S.ASPECT_RATIO]){
					finalCroppedWidth = finalCroppedHeight * params[S.ASPECT_RATIO];
				}
			}
		}
		return {[S.WIDTH]:finalCroppedWidth, [S.HEIGHT]:finalCroppedHeight};
	}
})();