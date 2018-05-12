<?php 
	session_start(); 
	if (isset($_SESSION['UserId']) === false) header("location: ../index.php"); 
?>
<!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />
		<meta http-equiv="Cache-control" content="public">
		<meta http-equiv="expires" content="never"/>
		<meta http-equiv="content-language" content="it"/>
		<meta lang="it" />
		<title>ExtjsDEV Label Editor</title>
		
		<!-- ** Ext CSS	** -->
		
		<link rel="stylesheet" href="css/designer.css">
        <script language="javascript" type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
        <script language="javascript" type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"></script>
		<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/themes/smoothness/jquery-ui.css">
		
		<link rel="stylesheet" href="ruler.css">
		
		<!-- ** Sencha ExtJS ** 
		<script type="text/javascript" src="../includes/extjs/include-ext.js"></script>
		-->
    </head>
    <body>
		<!-- ** LAbelDesginer ExtJS ** -->
        <script language="javascript" type="text/javascript" src="js/designer_extjsdev.js"></script>
        <script language="javascript" type="text/javascript" src="js/designer.js"></script>
        <script language="javascript" type="text/javascript" src="js/designer_propertyInspector.js"></script>
        <script language="javascript" type="text/javascript" src="js/designer_toolbar.js"></script>
        <script language="javascript" type="text/javascript" src="js/designer_labelInspector.js"></script>
        <script language="javascript" type="text/javascript" src="js/labelControls/LabelSize.js"></script>
        <script language="javascript" type="text/javascript" src="js/labelControls/GenerateZPL.js"></script>
		<script language="javascript" type="text/javascript" src="js/labelControls/layoutSave.js"></script>
        <script language="javascript" type="text/javascript" src="js/lindell-barcode/JsBarcode.all.js"></script>
        <script language="javascript" type="text/javascript" src="js/tools/rectangle.js"></script>
        <script language="javascript" type="text/javascript" src="js/tools/barcode.js"></script>
        <script language="javascript" type="text/javascript" src="js/tools/text.js"></script>
        <script language="javascript" type="text/javascript" src="js/tools/image.js"></script>
		
		<script language="javascript" type="text/javascript" src="js/ruler.js"></script>
        <canvas id="labelDesigner" tabindex="1" width="800" height="800" style="margin-left: 100px; margin-top: 50px; border: 1px solid #000000;"></canvas>
		
        <script>
			var canvasDesigner = null;
			var canvasDesignerText = null;
			var canvasDesignertRectangle = null;
			var canvasDesignerBarcode = null;
			var canvasDesignerImage = null;
			var LayoutID = 0;
			
            $(document).ready(function() {
				
				var myRuler = new ruler({
					container: document.getElementById('labelDesigner'),
					rulerHeight: 15, // thickness of ruler
					fontFamily: 'arial',// font for points
					fontSize: '7px', 
					strokeStyle: 'black',
					lineWidth: 1,
					enableMouseTracking: true,
					enableToolTip: true
				});
				
                canvasDesigner = new com.logicpartners.labelDesigner('labelDesigner', 4, 3, 203, 1);
				
				canvasDesigner.labelInspector.addTool(new com.logicpartners.labelControl.size(canvasDesigner));
				canvasDesigner.labelInspector.addTool(new com.logicpartners.labelControl.generatezpl(canvasDesigner));
				canvasDesigner.labelInspector.addTool(new com.logicpartners.labelControl.layoutSave(canvasDesigner));
				
				canvasDesignerText = new com.logicpartners.designerTools.text();
				canvasDesignertRectangle = new com.logicpartners.designerTools.rectangle();
				canvasDesignerBarcode = new com.logicpartners.designerTools.barcode();
				canvasDesignerImage = new com.logicpartners.designerTools.image();
				
				canvasDesigner.toolbar.addTool(canvasDesignerText);
				canvasDesigner.toolbar.addTool(canvasDesignertRectangle);
				canvasDesigner.toolbar.addTool(canvasDesignerBarcode);
				canvasDesigner.toolbar.addTool(canvasDesignerImage);
				
				LayoutID = getUrlVars()['id'];
				if (LayoutID != undefined) {
					console.log('LayoutID=' + LayoutID);
					//LayoutLoad(LayoutID);
					LayoutLoadRun(LayoutID);
					canvasDesigner.decodeZPL(CurrentLayoutJson);
				}
            });
        </script>
    </body>
</html>
