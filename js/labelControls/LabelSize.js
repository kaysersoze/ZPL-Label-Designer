if (!com)
	var com = {};
if (!com.logicpartners)
	com.logicpartners = {};
if (!com.logicpartners.labelControl)
	com.logicpartners.labelControl = {};
	
com.logicpartners.labelControl.size = function(designer) {
	var self = this;
	this.designer = designer;
	this.workspace = $("<div></div>").addClass("designerLabelControl").attr("title", "Label Size");
	
	this.widthContainer = $("<div>Width: </div>").addClass("designerLabelControlContainer").appendTo(this.workspace);
	this.widthController = $("<input type=\"text\" />")
		.addClass("designerLabelControlElement")
		.css({
			width : "50px"
			
		})
		.val(this.designer.labelWidth)
		.appendTo(this.widthContainer)
		.on("blur", function() {
			self.updateDesigner();
		})
		.on("keypress", function(e) {
			if (e.which == 13) {
				e.preventDefault();
				self.updateDesigner();
			}
		});
		
	this.heightContainer = $("<div>Height: </div>").addClass("designerLabelControlContainer").appendTo(this.workspace);
	this.heightController = $("<input type=\"text\" />")
		.addClass("designerLabelControlElement")
		.css({
			width : "50px"
			
		})
		.val(this.designer.labelHeight)
		.appendTo(this.heightContainer)
		.on("blur", function() {
			self.updateDesigner();
		})
		.on("keypress", function(e) {
			if (e.which == 13) {
				e.preventDefault();
				self.updateDesigner();
			}
		});
		
	this.dpiContainer = $("<div>DPI: </div>").addClass("designerLabelControlContainer").appendTo(this.workspace);
	this.dpiController = $("<select> <option value='152'>152 dpi6</option><option value='203'>203 dpi8</option><option value='300'>300 dpi12</option><option value='600'>600 dpi24</option></select>")
	//this.dpiController = $("<input type=\"text\" />")
		.addClass("designerLabelControlElement")
		.css({
			width : "100px"
		})
		.val(this.designer.dpi)
		.appendTo(this.dpiContainer)
		.on("blur", function() {
			self.updateDesigner();
		})
		.on("keypress", function(e) {
			if (e.which == 13) {
				e.preventDefault();
				self.updateDesigner();
			}
		});
		
	this.zoomContainer = $("<div>Zoom: </div>").addClass("designerLabelControlContainer").appendTo(this.workspace);
	this.zoomController = $("<input type=\"text\" />")
		.addClass("designerLabelControlElement")
		.css({
			width : "50px"
		})
		.val(this.designer.zoom)
		.appendTo(this.zoomContainer)
		.on("blur", function() {
			self.updateDesigner();
		})
		.on("keypress", function(e) {
			if (e.which == 13) {
				e.preventDefault();
				self.updateDesigner();
			}
		});
		
	this.updateDesigner = function() {
		var width = this.designer.labelWidth;
		var height = this.designer.labelHeight;
		var zoom = this.designer.zoom;
		var dpi = this.designer.dpi;
		
		if (!isNaN(this.dpiController.val())) dpi = this.dpiController.val();
		if (!isNaN(this.widthController.val())) width = this.widthController.val();
		if (!isNaN(this.heightController.val())) height = this.heightController.val();
		if (!isNaN(this.zoomController.val())) zoom = this.zoomController.val();
		
		this.dpiController.dpi = dpi;
		this.widthController.val(width);
		this.heightController.val(height);
		this.designer.updateLabelSize(width, height, dpi, zoom);
	}
		
	this.update = function() {
		this.widthController.val(this.designer.labelWidth);
		this.heightController.val(this.designer.labelHeight);
		this.dpiController.val(this.designer.dpi);
		this.zoomController.val(this.designer.zoom);
	}
}