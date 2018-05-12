if (!com)
	var com = {};
if (!com.logicpartners)
	com.logicpartners = {};
if (!com.logicpartners.designerTools)
	com.logicpartners.designerTools = {};
	
com.logicpartners.designerTools.text = function() {
	var self = this;
	this.counter = 1;
	this.button = $("<div></div>").addClass("designerToolbarText designerToolbarButton")
								  .attr("title", "Text")
								  .append($("<div></div>"));
	this.object = function(x, y, width, height, data) {
		this.uniqueID = self.counter;
		this.name = "Text" + self.counter++;
		this.x = x;
		this.y = y;
		this.width = 100;
		this.height = 0;
		this.data = data;
		
		this.datasourcefield = '';
		this.datasourcefield.editor = 'text';
		
		this.text = "TEXT";
		
		this.readonly = [ "width", "height", "data" ];
		this.hidden = [ "data", "uniqueID" ];
		
		this.fontSize = 36;
		this.fontType = "Zebra0";
		this.fontList = [
									{	name:'Zebra0',value:'Arial',zpl:'0'}, // STD
									
									{	name:'ZebraA',value:'Arial',zpl:'A'},
									{	name:'ZebraB',value:'B',zpl:'B'},
									{	name:'ZebraC',value:'C',zpl:'C'},
									{	name:'ZebraD',value:'D',zpl:'D'},
									{	name:'ZebraE',value:'E',zpl:'E'}, //OCR-B
									{	name:'ZebraF',value:'F',zpl:'F'},
									{	name:'ZebraG',value:'G',zpl:'G'},
									{	name:'ZebraH',value:'H',zpl:'H'},// OCR-A
									{	name:'ZebraO',value:'O',zpl:'O'}, 
									{	name:'ZebraP',value:'P',zpl:'P'},
									{	name:'ZebraQ',value:'Q',zpl:'Q'},
									{	name:'ZebraR',value:'R',zpl:'R'},
									{	name:'ZebraS',value:'S',zpl:'S'},
									{	name:'ZebraT',value:'T',zpl:'T'},
									{	name:'ZebraU',value:'U',zpl:'U'},
									{	name:'ZebraV',value:'V',zpl:'V'},
									
									{	name:'ZebraGS',value:'GS',zpl:'GS'}, // SYMBOL
								];
		this.SymbolList = [
									{	name:'€',value:'€',zpl:'\\15'}, 
									{	name:'é',value:'é',zpl:'\\82'},
									{	name:'è',value:'è',zpl:'\\8A'},
									{	name:'°',value:'°',zpl:'\\F8'},
								];					
		this.readonly = [ "width", "height" ];
		
		this.getFontHeight = function() {
			var textMeasure = $("<div></div>").css({
				"font-size" : this.fontSize + "px",
				"font-family" : this.fontType,
				"opacity" : 0,
			}).text("M").appendTo($("body"));
			
			var height = textMeasure.outerHeight();
			textMeasure.remove();
			return height;
		}
		
		this.getZPLData = function() {
			return "";
		}
		this.toZPL = function(labelx, labely, labelwidth, labelheight) {
			var textdesc = this.text;
			for (var i = 0; i < this.SymbolList.length; i++) {
				pos = textdesc.indexOf(this.SymbolList[i].value);
				if (pos>=0){
					textdesc = textdesc.replace(this.SymbolList[i].value,this.SymbolList[i].zpl);
				}
			}
			return "^FO" + (this.x - labelx) + "," + (this.y - labely) + "^FD" + textdesc + "^FS";
		}
		
		this.draw = function(context) {
			if (this.fontType == "") this.fontType = 'Zebra0';
			context.font = this.fontSize * 0.7 + "px " +  this.fontList.find(x => x.name == this.fontType).value;
			var oColor = context.fillStyle;
			context.fillStyle = "white";
			this.height = this.getFontHeight();
			var measuredText = context.measureText(this.text);
			this.width = measuredText.width;
			context.globalCompositeOperation = "difference";
			context.fillText(this.text, this.x, this.y + (this.height * 0.75));
			context.globalCompositeOperation = "source-over";
			context.fillStyle = oColor;
			//context.fillRect(this.x, this.y, this.width, this.height);
		}
		
		this.setWidth = function(width) {
			//this.width = width;
		}
		this.getWidth = function() {
			return this.width;
		}
		
		this.setdatasourcefield = function(datasourcefield) {
			this.datasourcefield = datasourcefield;
		}
		this.getdatasourcefield = function() {
			return datasourcefield;
		}
		
		this.setHeight = function(height) {
			//height = height;
		}
		this.getHeight = function() {
			return this.height * 0.75;
		}

		this.setHandle = function(coords) {
			this.handle = this.resizeZone(coords);
		}
		this.getHandle = function() {
			return this.handle;
		}

		this.drawActive = function(context) {
			context.dashedStroke(parseInt(this.x + 1), parseInt(this.y + 1), parseInt(this.x) + parseInt(this.width) - 1, parseInt(this.y) + parseInt(this.height * 0.9) - 1, [2, 2]);
		}

		this.hitTest = function(coords) {
			return (coords.x >= parseInt(this.x) && coords.x <= parseInt(this.x) + parseInt(this.width) && coords.y >= parseInt(this.y) && coords.y <= parseInt(this.y) + parseInt(this.height) * 0.75);
		}
	}
}