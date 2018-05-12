if (!com)
	var com = {};
if (!com.logicpartners)
	com.logicpartners = {};


// http://stackoverflow.com/a/5932203/697477
HTMLCanvasElement.prototype.RelativeMouse = function(event) {
	var totalOffsetX = 0;
	var totalOffsetY = 0;
	var canvasX = 0;
	var canvasY = 0;
	var currentElement = this;

	do {
		totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
		totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
	}
	while (currentElement = currentElement.offsetParent)

	canvasX = event.clientX - totalOffsetX;
	canvasY = event.clientY - totalOffsetY;

	return {x: canvasX, y: canvasY}
}

// From http://stackoverflow.com/a/4577326/697477
var CP = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
if (CP && CP.lineTo) {
	CP.dashedLine = function(x, y, x2, y2, dashArray) {
		if (!dashArray)
			dashArray = [10, 5];
		if (dashLength == 0)
			dashLength = 0.001; // Hack for Safari
		var dashCount = dashArray.length;
		this.moveTo(x, y);
		var dx = (x2 - x), dy = (y2 - y);
		var slope = dx ? dy / dx : 1e15;
		var distRemaining = Math.sqrt(dx * dx + dy * dy);
		var dashIndex = 0, draw = true;
		while (distRemaining >= 0.1) {
			var dashLength = dashArray[dashIndex++ % dashCount];
			if (dashLength > distRemaining)
				dashLength = distRemaining;
			var xStep = Math.sqrt(dashLength * dashLength / (1 + slope * slope));
			if (dx < 0)
				xStep = -xStep;
			x += xStep
			y += slope * xStep;
			this[draw ? 'lineTo' : 'moveTo'](x, y);
			distRemaining -= dashLength;
			draw = !draw;
		}

		// Ensure that the last segment is closed for proper stroking
		this.moveTo(0, 0);
	}

	CP.dashedStroke = function(x, y, x2, y2, dashArray) {
		this.beginPath();
		this.dashedLine(x, y, x2, y, dashArray);
		this.dashedLine(x2, y, x2, y2, dashArray);
		this.dashedLine(x2, y2, x, y2, dashArray);
		this.dashedLine(x, y, x, y2, dashArray);
		this.stroke();
	}
}

com.logicpartners.labelDesigner = function(canvasid, labelWidth, labelHeight, dpi = 203, zoom = 1) {
	this.canvas = document.getElementById(canvasid);
	this.canvasElement = $(this.canvas);

	this.dpi = dpi;
	this.zoom = zoom;
	this.labelWidth = labelWidth * this.dpi;
	this.labelHeight = labelHeight * this.dpi;
	this.propertyInspector = new com.logicpartners.propertyInspector(this, this.canvas);
	this.toolbar = new com.logicpartners.toolsWindow(this, this.canvas);
	this.labelInspector = new com.logicpartners.labelInspector(this, this.canvas);

	this.drawingContext = this.canvas.getContext("2d");
	this.elements = [];
	this.currentLayer = 0;
	this.activeElement = null;
	this.activeTool = null;
	
	this.labelX = this.canvas.width / 2 - this.labelWidth / 2;
	this.labelY = 5;

	this.newObject = null;
	this.dragStartPosition = {x: 0, y: 0};
	this.dragStartTime = 0;
	this.dragLastPosition = {x: 0, y: 0};
	this.dragElementOffset = {x: 0, y: 0};
	this.dragAction = 0;
	this.dragging = false;

	var self = this;
	
	this.updateLabelSize = function(width, height) {
		this.labelWidth = width * this.dpi;
		this.labelHeight = height * this.dpi;
		var xchange = (this.labelWidth + 10) - parseInt(this.canvasElement.prop("width"));
		this.canvasElement.prop("width", this.labelWidth + 10).prop("height", this.labelHeight + 10);
		this.labelX = this.canvas.width / 2 - this.labelWidth / 2;
		this.labelY = 5;
		console.log(xchange);
		this.propertyInspector.updatePosition(xchange);
		this.labelInspector.updatePosition(xchange);
		//this.labelInspector.size.update();
		this.updateCanvas();
	}

	this.canvasElement.on("click", function() {
		self.setActiveElement();
	})
			.on("mousedown", function() {
				self.dragStartPosition = self.canvas.RelativeMouse(event);
				self.dragLastPosition = self.dragStartPosition;
				
				if (self.newObject) {
					// Create new object.
					self.elements[self.currentLayer++] = new self.newObject(self.dragStartPosition.x, self.dragStartPosition.y, 1, 1);
					self.dragAction = 8;
					self.activeElement = self.elements[self.currentLayer - 1];
					self.newObjectController.button.removeClass("designerToolbarButtonActive");
					self.newObject = null;
					self.newObjectController = null;
				}
				else {
					self.dragAction = 0;

					self.setActiveElement();

					if (self.activeElement) {
						self.dragElementOffset = {
							x: self.activeElement.x - self.dragStartPosition.x,
							y: self.activeElement.y - self.dragStartPosition.y
						};

						self.setActiveHandle(self.dragStartPosition);
					}
				}
				self.dragging = true;
			})
			.on("mouseup", function() {
				self.dragging = false;
			})
			.on("mouseout", function() {
				self.dragging = false;
			})
			.on("mousemove", function() {
				if (self.dragging && self.activeElement) {
					var coords = self.canvas.RelativeMouse(event);
					//console.log(self.dragAction);
					switch (self.dragAction) {
						case 0:
							self.move(coords.x + self.dragElementOffset.x, coords.y + self.dragElementOffset.y);
							break;
						default:
							self.resize(coords.x - self.dragLastPosition.x, coords.y - self.dragLastPosition.y, self.dragAction);
							break;
					}
					self.updateCanvas();
					self.dragLastPosition = coords;
				}
				else if (self.newObject != null) {
					self.canvasElement.css({ cursor: "crosshair" });
				}
				else if (self.activeElement) {
					var coords = self.canvas.RelativeMouse(event);
					// If cursor is within range of edge, show resize handles
					var location = self.getHandle(coords);
					var style = "default";
					switch (location) {
						case 0:
							style = "default";
							break;
						case 1:
							style = "nw-resize";
							break;
						case 2:
							style = "n-resize";
							break;
						case 3:
							style = "ne-resize";
							break;
						case 4:
							style = "w-resize";
							break;
						case 5:
							style = "e-resize";
							break;
						case 6:
							style = "sw-resize";
							break;
						case 7:
							style = "s-resize";
							break;
						case 8:
							style = "se-resize";
							break;
					}
					self.canvasElement.css({cursor: style});
				}
			})
			.on("keydown", function(event) {
				event = event || window.event;

				var handled = false;
				switch (event.keyCode) {
					case 37: // Left arrow
						if (self.activeElement)
							self.activeElement.x -= 1;
						handled = true;
						break;
					case 38: // Up arrow
						if (self.activeElement)
							self.activeElement.y -= 1;
						handled = true;
						break;
					case 39: // Right arrow
						if (self.activeElement)
							self.activeElement.x += 1;
						handled = true;
						break;
					case 40: // Down arrow
						if (self.activeElement)
							self.activeElement.y += 1;
						handled = true;
						break;
					case 46:
						if (self.activeElement) {
							self.deleteActiveElement();
							handled = true;
						}
						break;
					case 80:
						if (event.ctrlKey) {
							self.generateZPL();
							handled = true;
						}
						break;
				}

				if (handled) {
					self.updateCanvas();
					event.preventDefault();
					event.stopPropagation();
				}
			});
			
	this.addObject = function(object) {
		this.elements[this.currentLayer++] = object;
		this.activeElement = this.elements[this.currentLayer - 1];
		this.updateCanvas();
	}
			
	this.deleteActiveElement = function() {
		if (this.activeElement) {
			for (var i = 0; i < this.currentLayer; i++) {
				if (this.elements[i] && this.elements[i] == this.activeElement) {
					this.elements[i] = null;
					this.activeElement = null;
				}
			}
		}
	}

	this.setActiveElement = function() {
		var coordinates = this.canvas.RelativeMouse(event);
		if (!this.activeElement || this.getHandle(coordinates) == 0) {
			this.activeElement = null;
			for (var i = this.currentLayer - 1; i >= 0; i--) {
				if (this.elements[i] && this.elements[i].hitTest(coordinates)) {
					this.activeElement = this.elements[i];
					break;
				}
			}
		}

		this.updateCanvas();
	}

	/**
	 * Parameters: Coordinates on canvas.
	 * 
	 * Returns: 0 if not on resize zone.
	 *          1 top left     2 top     3 top right
	 *          4 left                   5 right
	 *          6 bottom left  7 bottom  8 bottom right
	 */
	this.setActiveHandle = function(coords) {
		this.dragAction = this.getHandle(coords);
	}

	this.getHandle = function(coords) {
		var result = 0;

		var leftEdge = coords.x > this.activeElement.x - 5 && coords.x < this.activeElement.x + 5;
		var rightEdge = coords.x > this.activeElement.x + this.activeElement.getWidth() - 5 && coords.x < this.activeElement.x + this.activeElement.getWidth() + 5;
		var topEdge = coords.y > this.activeElement.y - 5 && coords.y < this.activeElement.y + 5;
		var bottomEdge = coords.y > this.activeElement.y + this.activeElement.getHeight() - 5 && coords.y < this.activeElement.y + this.activeElement.getHeight() + 5;

		var verticalHit = coords.y > this.activeElement.y && coords.y < this.activeElement.y + this.activeElement.getHeight();
		var horizontalHit = coords.x > this.activeElement.x && coords.x < this.activeElement.x + this.activeElement.getWidth();

		if (leftEdge && topEdge)
			result = 1;
		else if (rightEdge && topEdge)
			result = 3;
		else if (leftEdge && bottomEdge)
			result = 6;
		else if (rightEdge && bottomEdge)
			result = 8;
		else if (topEdge && horizontalHit)
			result = 2;
		else if (leftEdge && verticalHit)
			result = 4;
		else if (rightEdge && verticalHit)
			result = 5;
		else if (bottomEdge && horizontalHit)
			result = 7;

		return result;
	}

	this.move = function(x, y) {
		this.activeElement.x = x;
		this.activeElement.y = y;
	}

	this.resize = function(xchange, ychange) {
		switch (this.dragAction) {
			case 1: // Top Left
				this.activeElement.x += xchange;
				this.activeElement.y += ychange;
				this.activeElement.setWidth(this.activeElement.getWidth() - xchange);
				this.activeElement.setHeight(this.activeElement.getHeight() - ychange);
				break;
			case 2: // Top
				this.activeElement.y += ychange;
				this.activeElement.setHeight(this.activeElement.getHeight() - ychange);
				break;
			case 3: // Top Right
				this.activeElement.setWidth(this.activeElement.getWidth() + xchange);
				this.activeElement.y += ychange;
				this.activeElement.setHeight(this.activeElement.getHeight() - ychange);
				break;
			case 4: // Left
				this.activeElement.x += xchange;
				this.activeElement.setWidth(this.activeElement.getWidth() - xchange);
				break;
			case 5: // Right
				this.activeElement.setWidth(this.activeElement.getWidth() + xchange);
				break;
			case 6: // Bottom Left
				this.activeElement.x += xchange;
				this.activeElement.setWidth(this.activeElement.getWidth() - xchange);
				this.activeElement.setHeight(this.activeElement.getHeight() + ychange);
				break;
			case 7: // Bottom
				this.activeElement.setHeight(this.activeElement.getHeight() + ychange);
				break;
			case 8: // Bottom Right
				this.activeElement.setWidth(this.activeElement.getWidth() + xchange);
				this.activeElement.setHeight(this.activeElement.getHeight() + ychange);
				break;
		}

		if (this.activeElement.getWidth() == 0) {
			this.activeElement.setWidth(-1);
			this.activeElement.x += 1;
		}

		if (this.activeElement.getHeight() == 0) {
			this.activeElement.setHeight(-1);
			this.activeElement.y += 1;
		}

		if (this.activeElement.width < 0) {
			this.activeElement.x = this.activeElement.x + this.activeElement.getWidth();
			this.activeElement.setWidth(parseInt(this.activeElement.getWidth() * -1));
			this.swapActionHorizontal();
		}

		if (this.activeElement.height < 0) {
			this.activeElement.y = this.activeElement.y + this.activeElement.getHeight();
			this.activeElement.setHeight(this.activeElement.getHeight() * -1);
			this.swapActionVertical();
		}
	}

	this.swapActionVertical = function() {
		switch (this.dragAction) {
			case 1:
				this.dragAction = 6;
				break;
			case 2:
				this.dragAction = 7;
				break;
			case 3:
				this.dragAction = 8;
				break;
			case 6:
				this.dragAction = 1;
				break;
			case 7:
				this.dragAction = 2;
				break;
			case 8:
				this.dragAction = 3;
				break;
		}
	}

	this.swapActionHorizontal = function() {
		switch (this.dragAction) {
			case 1:
				this.dragAction = 3;
				break;
			case 3:
				this.dragAction = 1;
				break;
			case 4:
				this.dragAction = 5;
				break;
			case 5:
				this.dragAction = 4;
				break;
			case 6:
				this.dragAction = 8;
				break;
			case 8:
				this.dragAction = 6;
				break;
		}
	}

	this.update = function() {
		this.propertyInspector.update(this.activeElement);
	}

	this.updateCanvas = function() {
		this.update();
		//var self = this;
		
		//DRAW RECTANGLE LABEL BORDER

		self.drawingContext.fillStyle = "#FFFFFF";
		self.drawingContext.fillRect(0, 0, self.canvas.width, self.canvas.height);
		
		//self.drawingContext.fillStyle = "rgba(255, 255, 255, 0)";
		//self.drawingContext.fillRect(0, 0, self.canvas.width, self.canvas.height);

		// Draw the boundary.
		self.drawingContext.strokeStyle = "#FF0000";
		self.drawingContext.lineWidth = 2;
		self.drawingContext.strokeRect(self.labelX, self.labelY, self.labelWidth, self.labelHeight);

		self.drawingContext.strokeStyle = "#000000";
		self.drawingContext.fillStyle = "#000000";
		
		//DRAW TEMPLATE
		//CurrentLayoutTemplate = '';
		if (CurrentLayoutTemplate != ''){
			var img = new Image();
			img.onload = function() {
				//self.drawingContext.drawImage(img, 0, 0);
				self.drawingContext.drawImage(img, 0, 0, self.labelWidth,self.labelHeight);
				self.drawingContext.beginPath();
				self.updateCanvasAfterTemplate();
			};
			img.src = '/repository/' + CurrentLayoutTemplate ;
			var timeOut = 5*1000; //ms - waiting for max 5s to laoad
				
		}else{
			self.updateCanvasAfterTemplate();
		}
	}
	
	this.updateCanvasAfterTemplate = function(){
		
		//self.drawingContext.globalCompositeOperation = "difference";
		for (var i = 0; i < self.currentLayer; i++) {
			if (self.elements[i]) {
				self.elements[i].draw(self.drawingContext, self.canvas.width, self.canvas.height);
			}
		}

		self.drawingContext.strokeStyle = "#FF0000";
		self.drawingContext.lineCap = 'butt';
		self.drawingContext.lineWidth = 2;
		if (self.activeElement) self.activeElement.drawActive(self.drawingContext);
	}
	
	this.generateZPL = function() {
		var data = "^XA\r\n" +
				   "^CFd0,10,18\r\n" +
				   "^PR12\r\n" +
				   "^LRY\r\n" +
				   "^MD30\r\n" +
				   "^PW" + this.labelWidth + "\r\n" +
				   "^LL" + this.labelHeight + "\r\n" +
				   "^PON\r\n";
	    var bufferData = "";
		
		for (var i = 0; i < this.currentLayer; i++) {
			if (this.elements[i]) {
				bufferData += this.elements[i].getZPLData();
				data += this.elements[i].toZPL(this.labelX, this.labelY, this.labelHeight, this.labelWidth);
			}
		}
		
		data += "^PQ1\r\n" +
				"^XZ\r\n";
				
		console.log(bufferData + data);
		return { "data" : bufferData, "zpl" : data };
	}
	
	this.decodeZPL = function(streamZPL) {
		var self = this;
		var x = 1;
		var y = 1;
		var typeobj = 'text';
		var font = '';
		var fontsize = '';
		var x1 = 1;
		var y1 = 1;
		var lblWidth = 1;
		var lblHeight = 1;
		
		streamZPL = streamZPL.replace("\n","");
		streamZPL = streamZPL.replace("\r","");
		var arrayZPL = streamZPL.split("^");
		
		for (var i=0; i<arrayZPL.length; i++) {
			line = arrayZPL[i];
			lineparam = line.substring(2);
			lineparams = line.substring(2).split(',');
			linecommandgroup = line.substring(0, 1);
			linecommand = line.substring(0, 2);
			
			if (linecommandgroup == 'A'){
				//font typeset 			^A font, height, width
				fontName = linecommand.substring(1, 1);
				fontOrientation = lineparams[0]; //ORIENTATION 
												//N = normal
												//R = rotated 90 degrees (clockwise)
												//I = inverted 180 degrees
												//B = read from bottom up, 270 degrees
				fontHeight = lineparams[1]; 
				fontWidth = lineparams[2];
			}
			if (linecommandgroup == 'B'){
				typeobj = 'barcode';
				//^B3N,N,33N,N
				fontName = linecommand.substring(1, 1);
				fontOrientation = lineparams[0]; //ORIENTATION 
												//N = normal
												//R = rotated 90 degrees (clockwise)
												//I = inverted 180 degrees
												//B = read from bottom up, 270 degrees
				fontHeight = lineparams[1]; 
				fontWidth = lineparams[2];
				
			}
			if (linecommandgroup == 'F'){
				//imposta field origin xy	^FO x, y, alignment
				if (linecommand == 'FO') {x=lineparams[0]; y=lineparams[1];}
				//Field separator			^FS
				if (linecommand == 'FS') {
					x  = parseInt(x);
					x1 = parseInt(x1);
					y  = parseInt(y);
					y1 = parseInt(y1);
					
					if (typeobj == 'text') {self.setNewObject(canvasDesignerText);}
					if (typeobj == 'rectangle') {self.setNewObject(canvasDesignertRectangle);}
					if (typeobj == 'barcode') {self.setNewObject(canvasDesignerBarcode);}
					if (typeobj == 'image') {self.setNewObject(canvasDesignerImage);}
					
					console.log(typeobj + x + y + x1 + y1 );
					//x = self.labelWidth - x;
					//y = self.labelHeight - y;
					//x1 = self.labelWidth - x1;
					//y1 = self.labelHeight - y1;
					
					if ((typeobj == 'text') || (typeobj == 'rectangle')) {
						self.elements[self.currentLayer++] = new self.newObject(x, y, 1, 1);
					}else if (typeobj == 'barcode'){
						y1 = fontHeight;
						self.elements[self.currentLayer++] = new self.newObject(x, y, x1, y1);
					}else{
						self.elements[self.currentLayer++] = new self.newObject(x, y, x1, y1);
					}
					self.dragAction = 8;
					self.activeElement = self.elements[self.currentLayer - 1];
					if (typeobj == 'text') {
						self.activeElement.fontType = fontName ;
						self.activeElement.fontSize = fontHeight;
						
						while(true){
							pos = textdesc.indexOf('\\');
							if (pos>=0){
								strToFind = textdesc.substr(pos, 3);
								strToReplace = self.activeElement.SymbolList.find(x => x.zpl == strToFind).value;
								textdesc = textdesc.replace(strToFind,strToReplace);
							}else{
								break;
							}
						}
						self.activeElement.text = textdesc;
					
					}else if (typeobj == 'barcode') {
						self.activeElement.text = textdesc;
						self.activeElement.fontType = fontName ;
						self.activeElement.fontSize = fontHeight;
					}else{
					}
					self.activeElement.x = x;
					self.activeElement.y = y;
					self.newObject = null;
					self.newObjectController = null;
					
					//reset
					x = 1;
					y = 1;
					typeobj = 'text';
					textdesc = '';
					x1 = 1;
					y1 = 1;
				}
				//Field typeset			^FT x, y, alignment
				if (linecommand == 'FT') { x=lineparams[0]; y=lineparams[1];}
				//Field clock			^FC indicator1, indicator2, indicator3
				if (linecommand == 'FC') {x=x;}
				//Field data			^FD data
				if (linecommand == 'FD') {  textdesc = lineparam; }
				
			}
			if (linecommandgroup == 'G'){
				//imposta immagine		^GF format, dataBytes, totalBytes, rowBytes, data
				if (linecommand == 'GF') {x=x;}
				//imposta rettangolo	^GB width, height, thickness, color, rounding
				if (linecommand == 'GB') { typeobj = 'rectangle'; x1 = lineparams[0]; y1 = lineparams[1];}
			}
			if (linecommandgroup == 'S'){
				//Field separator 			^SL mode, language
				if (linecommand == 'SL')  {x=0; y=0;}
				//imposta clock				^SO clock, months, days, years, hours, minutes, seconds
				if (linecommand == 'SO')  {x=x;}
			}
			
			if (linecommand == 'PW') { 
				lblWidth = parseInt(lineparam) / self.dpi;
				self.updateLabelSize(lblWidth, lblHeight, 203, 1);  
			}
			
			if (linecommand == 'PQ') { 
				//label number
				//^PQ1,0,1,Y^XZ
				//^PQnnnnnn,0,1,Y^XZ
			}
			
			if (linecommandgroup == 'L'){
				if (linecommand == 'LL')  { 
					//Label Height 				^LL labelHeight
					lblHeight = parseInt(lineparam)  / self.dpi;
					self.updateLabelSize(lblWidth, lblHeight); 
				}	
				if (linecommand == 'LS')  { 
					//Label shift 				^LS shift
					lineparam = lineparam;
				}
			}
			
			if (linecommandgroup == 'M'){
				if (linecommand == 'MM')  { 
				/*
					T = Tear-off n
					P = Peel-off (not available on S-300) n
					R = Rewind (depends on printer model)
					A = Applicator (depends on printer model) n
					C = Cutter (depends on printer model)
					D = Delayed cutter n
					F = RFID n
					L = Reserved n, o
					U = Reserved n, o
					K = Kiosk p
				*/
				}	
				if (linecommand == 'MT')  { 
					//MTT;  transfer
					//MTD;  direct
				}
			}	
			//^FO188,1125^GB656,656,2,B,0^FS
			//^FO-6,0^GB656,656,2,B,0^FS
			
		}
		
		self.updateCanvas();
		
	}
	
	this.saveLayout = function(){
		for (var i = 0; i < this.currentLayer; i++) {
			if (this.elements[i]) {
				bufferElements += this.elements[i];
			}
		}
		console.log(bufferElements);
		return bufferElements;
	}
	
	this.setNewObject = function(controller) {
		if (controller) {
			this.newObject = controller.object;
			this.newObjectController = controller;
		}
		else {
			this.newObject = null;
			this.newObjectController = null;
		}
	}

	this.updateLabelSize(labelWidth, labelHeight);
	
	this.updateCanvas();
}