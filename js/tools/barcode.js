if (!com)
	var com = {};
if (!com.logicpartners)
	com.logicpartners = {};
if (!com.logicpartners.designerTools)
	com.logicpartners.designerTools = {};
	
com.logicpartners.designerTools.barcode = function() {
	var self = this;
	this.counter = 1;
	this.button = $("<div></div>").addClass("designerToolbarBarcode designerToolbarButton").attr("title", "Barcode").append($("<div></div>"));
	this.object = function(x, y, width, height, data) {
		this.uniqueID = self.counter;
		this.name = "Barcode" + self.counter++;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.data = data;
		
		this.datasourcefield = '';
		this.datasourcefield.editor = 'text';
		
		this.text = "BARCODE";
		this.canvasHolder = $("<canvas></canvas>").prop("width", "100").prop("height", "1");
		
		this.fontSize = 36;
		this.fontType = "CODE128";
		this.fontType.list = [
									{	name:'code11',value:'code11',zpl:'B1'},
									{	name:'interleaved25',value:'interleaved25',zpl:'B2'},
									{	name:'code39',value:'code39',zpl:'B3'},
									{	name:'code49',value:'code49',zpl:'B4'},
									{	name:'ean8',value:'ean8',zpl:'B7'},
									{	name:'upce',value:'upce',zpl:'B8'},
									{	name:'code93',value:'code93',zpl:'B9'},
									{	name:'codablock',value:'codablock',zpl:'BA'},
									{	name:'code128',value:'code128',zpl:'BB'},
									{	name:'maxicode',value:'maxicode',zpl:'BC'},
									{	name:'ean13',value:'ean13',zpl:'BD'},
									{	name:'pdf417',value:'pdf417',zpl:'BE'},
									{	name:'industrial25',value:'industrial25',zpl:'BF'},
									{	name:'standard25',value:'standard25',zpl:'BI'},
									{	name:'ansi',value:'ansi',zpl:'BJ'},
									{	name:'logmars',value:'logmars',zpl:'BK'},
									{	name:'msi',value:'msi',zpl:'BL'},
									{	name:'plessy',value:'plessy',zpl:'BM'},
									{	name:'qr',value:'qr',zpl:'BP'},
									{	name:'upcean',value:'upcean',zpl:'BQ'},
									{	name:'upca',value:'upca',zpl:'BS'},
									{	name:'datamatrix',value:'datamatrix',zpl:'BU'},
									{	name:'postnet',value:'postnet',zpl:'BZ'}
								];
		
		this.displayValue = false;
	
		this.readonly = [ "width", "height", "data" ];
		this.hidden = [ "data", "uniqueID","canvasHolder" ];
		
		this.getZPLData = function() {
			return "";
		}

		this.toZPL = function(labelx, labely, labelwidth, labelheight) {
			return "^FO" + (this.x - labelx) + "," + (this.y - labely) + "^BY1^B3N,N," + this.height + "N,N^FD" + this.text + "^FS";
		}

		this.draw = function(context) {
			console.log(this.text);
			if (this.text == '') this.text = '123456789012';
			
			/*
			JsBarcode(this.canvasHolder, this.text, { 
														format : this.fontType,
														font: "OCR-B"
														width: 1, 
														height : 1, 
														displayValue: this.displayValue,
														}
				);
				*/
			JsBarcode(this.canvasHolder, "1234", {
					format: "pharmacode",
				  lineColor: "#0aa",
				  width:4,
				  height:40,
				  displayValue: false
				});
				
			var cwidth = this.canvasHolder[0].width;
			var cheight = this.canvasHolder[0].height;
			var ctx = this.canvasHolder[0].getContext('2d');
			this.width = cwidth;
			if (this.height < 10) this.height=10;
			
			var cData = ctx.getImageData(0, 0, cwidth, cheight);
			/*
			for (var i = 0; i < cwidth; i++) {
				if (cData.data[i * 4 + 3] == 255) { // Black (barcode = black or white)
					// Draw a black rectangle at this point.
					context.fillRect(this.x + i, this.y, 1, this.height);
				}
			}
			*/
			context.fillRect(this.x, this.y, this.width +100, this.height);
		}
		
		this.setWidth = function(width) {
			//this.width = width;
		}
		this.getWidth = function() {
			return width;
		}
		
		this.setdatasourcefield = function(datasourcefield) {
			this.datasourcefield = datasourcefield;
		}
		this.getdatasourcefield = function() {
			return datasourcefield;
		}
		
		this.setformat = function(format) {
			this.format = format;
		}
		this.getformat = function() {
			return format;
		}
		this.getListformat = function() {
			return this.formatstyle;
		}
		
		this.setHeight = function(height) {
			this.height = height;
		}
		this.getHeight = function() {
			return this.height;
		}

		this.setHandle = function(coords) {
			this.handle = this.resizeZone(coords);
		}
		this.getHandle = function() {
			return this.handle;
		}

		this.drawActive = function(context) {
			context.dashedStroke(parseInt(this.x + 1), parseInt(this.y + 1), parseInt(this.x) + parseInt(width) - 1, parseInt(this.y) + parseInt(this.height) - 1, [2, 2]);
		}

		this.hitTest = function(coords) {
			return (coords.x >= parseInt(this.x) && coords.x <= parseInt(this.x) + parseInt(width) && coords.y >= parseInt(this.y) && coords.y <= parseInt(this.y) + parseInt(this.height));
		}
	}
};