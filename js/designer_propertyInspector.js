if (!com)
	var com = {};
if (!com.logicpartners)
	com.logicpartners = {};
	
com.logicpartners.propertyInspector = function(designer, canvas) {
	this.canvas = canvas;
	this.canvasElement = $(canvas);
	this.labelDesigner = designer;
	this.activeElement = null;
	this.propertyNodes = {};
	this.boundingBox = null;
	var self = this;

	// Create the property window.
	this.propertyInspector = $('<div></div>')
			.addClass("designerUtilityWindow")
			.css({
				"left": this.canvas.getBoundingClientRect().right + 5,
				"top": this.canvas.getBoundingClientRect().top
			})
			//.draggable({handle: "div.designerPropertyTitle"})
			.insertAfter(this.canvasElement);
			
	this.updatePosition = function(xchange) {
		this.propertyInspector.css("left", parseInt(this.propertyInspector.css("left")) + xchange);
		this.boundingBox = this.propertyInspector[0].getBoundingClientRect();
	}


	this.propertyViewContainer = $('<div></div>')
			.addClass("designerPropertyContainer")
			.resizable({
				resize: function(event, ui) {
					ui.size.width = ui.originalSize.width;
				}
			})
			.appendTo(this.propertyInspector);

	this.titleBar = $('<div>Property Inspector</div>')
			.addClass("designerPropertyTitle")
			.prependTo(this.propertyInspector)
			.on("dblclick", function() {
				self.propertyViewContainer.toggle();
			});

	this.propertyView = $('<div></div>')
			.addClass("designerPropertyContent")
			.appendTo(this.propertyViewContainer);

	this.update = function(activeElement) {
		var self = this;
		var getType = {};
		var keys = [];
		
		if (this.activeElement == activeElement) {
			for (var key in activeElement) {
				if (!activeElement.hidden || key != "hidden" && $.inArray(key, activeElement.hidden) == -1) {
					if (!activeElement.readonly || key != "readonly" && $.inArray(key, activeElement.readonly) == -1) {
						if (getType.toString.call(activeElement[key]) != '[object Function]') {
							this.propertyNodes[key].val(activeElement[key]);
						}
					}
				}
			}
		} else {
			this.activeElement = activeElement;
			this.propertyView.html('');

			for (var key in activeElement) {
				if (!activeElement.hidden || key != "hidden" && $.inArray(key, activeElement.hidden) == -1) {
					if (getType.toString.call(activeElement[key]) != '[object Function]') {
						
						var elementKey = $('<div>' + key + '</div>')
								.css({
									"width": "70px",
									"height": "20px",
									"border": "1px solid #AAAAAA",
									"float": "left",
									"font-size": "12px",
									"line-height": "20px",
									"border-right": "none",
									"text-align": "right",
									"padding-right": "5px",
									"margin-left": "5px"
								});
								
						//editor object
						var elementValue;
						if (activeElement[key].hasOwnProperty('list')){
							var options = options + '<option value="CODE128">CODE128</option>';
							options = options + '<option value="CODE39">CODE39</option>';
							options = options + '<option value="EAN13">EAN13</option>';
							options = options + '<option value="EAN_UPC">EAN_UPC</option>';
							options = options + '<option value="ITF">ITF</option>';
							options = options + '<option value="pharmacode">pharmacode</option>';
							elementValue = $('<select name="' + key + '">' + options + '</select>')
									.css({
										"width": "100px",
										"float": "left",
										"height": "22px",
										"line-height": "20px",
										"padding-left": "5px"
									});
						}else if (getType.toString.call(activeElement[key]) == 'boolean') {	
							var options = options + '<option value="true">true</option>';
							options = options + '<option value="false">false</option>';
							elementValue = $('<select name="' + key + '">' + options + '</select>')
									.css({
										"width": "100px",
										"float": "left",
										"height": "22px",
										"line-height": "20px",
										"padding-left": "5px"
									});
							
						}else{		
							//other
							elementValue = $('<input type="text" name="' + key + '" value="' + activeElement[key] + '">')
									.css({
										"width": "100px",
										"float": "left",
										"height": "22px",
										"line-height": "20px",
										"padding-left": "5px"
									});
						}
						
						//readonly
						if (!activeElement.readonly || $.inArray(key, activeElement.readonly) == -1) {
							elementValue.on("keyup", {"objectProperty": key}, function(event) {
								var data = self.activeElement[event.data.objectProperty];
								self.activeElement[event.data.objectProperty] = (data === parseInt(data, 10)) ? parseInt($(this).val()) : $(this).val();
								self.labelDesigner.updateCanvas();
							});
							elementValue.on("change", {"objectProperty": key}, function(event) {
								var data = self.activeElement[event.data.objectProperty];
								self.activeElement[event.data.objectProperty] = (data === parseInt(data, 10)) ? parseInt($(this).val()) : $(this).val();
								self.labelDesigner.updateCanvas();
							});
						} else {
							// Draw readonly textbox.
							elementValue.prop("readonly", true).css({ "background-color" : "#DDDDDD", border : "1px solid #AAAAAA" });
						}
					
						this.propertyNodes[key] = elementValue;

						var elementContainer = $('<div></div>')
								.css({
									"clear": "both",
									"padding-top": "2px"
								})
								.append(elementKey).append(elementValue);
						this.propertyView.append(elementContainer);
					}
				}
			}
		}
	}
	
	this.updatePosition(0);
}