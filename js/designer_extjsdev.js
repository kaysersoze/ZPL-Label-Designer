var CurrentLayoutId = 0;
var CurrentLayoutName = '';
var CurrentLayoutViewType = '';
var CurrentLayoutJson = [];
var CurrentLayoutArray = [];
var CurrentLayoutSkin = "absolute";
var CurrentLayoutTemplate = "";
var CurrentLayoutJsonFilter = [];
var CurrentLayoutDataSource = '';
var CurrentLayoutDataSourceDBName = '';
var CurrentLayoutDataSourceType = '';
var CurrentLayoutDataSourceField = '';

//*************************************************************************************************************//
//				FORM 
function LayoutLoad(LayoutId) {
	CurrentLayoutDataSource = 'ESEMPIO';
	CurrentLayoutDataSourceType = 'ESEMPIO';
	CurrentLayoutDataSourceField = 'ID';
	CurrentLayoutDataSource = '';
	CurrentLayoutDataSourceDBName = ''
	CurrentLayoutViewType = 'form';
	CurrentLayoutSkin = 'absolute';
	CurrentLayoutJson = '';
	CurrentLayoutTemplate = "";
	
	$.ajax({
		type: "POST",
		async: false,
		url: "../includes/io/LayoutRead.php",
		data: {
			layoutid: LayoutId
		},
		success: function (JsonAppo) {
			if (JsonAppo.data[0].datasourcedbname !== undefined) {CurrentLayoutDataSourceDBName = JsonAppo.data[0].datasourcedbname;}
			if (JsonAppo.data[0].datasource !== undefined) {CurrentLayoutDataSource = JsonAppo.data[0].datasource;}
			if (JsonAppo.data[0].datasourcetype !== undefined) {CurrentLayoutDataSourceType = JsonAppo.data[0].datasourcetype;}
			if (JsonAppo.data[0].datasourcefield !== undefined) {CurrentLayoutDataSourceField = JsonAppo.data[0].datasourcefield;}
			if (JsonAppo.data[0].viewtype !== undefined) {CurrentLayoutViewType = JsonAppo.data[0].viewtype;}
			if (JsonAppo.data[0].layoutskin !== undefined) {CurrentLayoutSkin = JsonAppo.data[0].layoutskin;}
			if (JsonAppo.data[0].printertemplate !== undefined) {CurrentLayoutTemplate = JsonAppo.data[0].printertemplate;}       
        },
        error: function(jqXHR, textStatus, errorThrown) {
           console.log(textStatus, errorThrown);
        }
    });
}
function LayoutLoadRun(LayoutId) {
	CurrentLayoutDataSource = 'ESEMPIO';
	CurrentLayoutDataSourceType = 'ESEMPIO';
	CurrentLayoutDataSourceField = 'ID';
	CurrentLayoutDataSource = '';
	CurrentLayoutDataSourceDBName = ''
	CurrentLayoutViewType = 'form';
	CurrentLayoutSkin = 'absolute';
	CurrentLayoutJson = '';
	CurrentLayoutTemplate = "";
	
	$.ajax({
		type: "POST",
		async: false,
		url: "../includes/io/LayoutReadRun.php",
		data: {
			layoutid: LayoutId
		},
		success: function (JsonAppo) {
			if (JsonAppo.data[0].datasourcedbname !== undefined) {CurrentLayoutDataSourceDBName = JsonAppo.data[0].datasourcedbname;}
			if (JsonAppo.data[0].datasource !== undefined) {CurrentLayoutDataSource = JsonAppo.data[0].datasource;}
			if (JsonAppo.data[0].datasourcetype !== undefined) {CurrentLayoutDataSourceType = JsonAppo.data[0].datasourcetype;}
			if (JsonAppo.data[0].datasourcefield !== undefined) {CurrentLayoutDataSourceField = JsonAppo.data[0].datasourcefield;}
			if (JsonAppo.data[0].viewtype !== undefined) {CurrentLayoutViewType = JsonAppo.data[0].viewtype;}
			if (JsonAppo.data[0].layoutskin !== undefined) {CurrentLayoutSkin = JsonAppo.data[0].layoutskin;}
			if (JsonAppo.data[0].layoutjson !== undefined) {CurrentLayoutJson = JsonAppo.data[0].layoutjson;}   
			if (JsonAppo.data[0].printertemplate !== undefined) {CurrentLayoutTemplate = JsonAppo.data[0].printertemplate;}
        },
        error: function(jqXHR, textStatus, errorThrown) {
           console.log(textStatus, errorThrown);
        }
    });
}
function LayoutSave(LayoutId, LayoutJson){
	$.ajax({
		type: "POST",
		async: false,
		url: "../includes/io/LayoutWrite.php",
		data: {
			layoutid: LayoutId,
			layoutjson: LayoutJson,
		},
		success: function (JsonAppo) {
			alert('Saved');             

        },
        error: function(jqXHR, textStatus, errorThrown) {
           console.log(textStatus, errorThrown);
        }
    });
}


//*************************************************************************************************************//
//				GENERIC
//*************************************************************************************************************//

function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}
function IsNullOrEmptyOrZeroString(obj){
	return (obj === "null" || obj === "undefined" || obj === null || obj === undefined || obj == '0' || obj == 0) ? true : false;
}
function IsNOTNullOrEmptyOrZeroString(obj){
    return !(Custom.IsNullOrEmptyOrZeroString(obj));
}
function isJson(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}
function isStore(store){
   return store && (store instanceof Ext.data.Store);

  //or pick a class method that any store should have
   return store && ('loadRecords' in store);
}
function isNotNull(obj) {
	return obj && obj !== "null" && obj!== "undefined";
}
function getURL(urlVarName) {
	var urlHalves = decodeURIComponent(String(document.location));
	urlHalves = urlHalves.split('?');
	return urlHalves[0];
}
function getURLVar(urlVarName) {
	var urlHalves = decodeURIComponent(String(document.location));
	urlHalves = urlHalves.split('?');
	var urlVarValue = '';
	if(urlHalves[1]) {var urlVars = urlHalves[1].split('&');for(i=0; i<=(urlVars.length); i++) {if(urlVars[i]) {var urlVarPair = urlVars[i].split('=');if (urlVarPair[0] && urlVarPair[0] == urlVarName) {urlVarValue = urlVarPair[1];}}}}
	return urlVarValue;
}
function openLinkInNewWindow(strUrl, strWindowName) {
	strUrl = strUrl + "&theme=classic%20azzurra";
	var windowObjectReference = window.open(strUrl, strWindowName, 'resizable,scrollbars,status');
	if (windowObjectReference == null)
		Ext.MessageBox.show({
			title : "Abilitazione PopUp",
			msg : 'Please change your popup settings ',
			icon : Ext.MessageBox.ERROR,
			buttons : Ext.Msg.OK
		});
	else  {
	  windowObjectReference.moveTo(0, 0);
	  windowObjectReference.resizeTo(screen.width, screen.height);
	}
}
function clone(obj) {
	if(obj == null || typeof(obj) != 'object') return obj;

	var temp = new obj.constructor(); 
	for(var key in obj)
		temp[key] = clone(obj[key]);
	return temp;
}
function count_obj(obj){
    var i = 0;
    for(var key in obj){
        ++i;
    }

    return i;
}
function sumArraysInObject(obj) {
	var result =[];
	Ext.Object.each(obj, function(key, value, myself) {
		if ((typeof value != 'object') && (typeof value != 'function')) {				
			result[key] = value;
		}else{
			result[key] = 'array';
		}
	})
    return result;
}
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
function strip(key) {
    if (key.indexOf('-----') !== -1) {
        return key.split('-----')[2].replace(/\r?\n|\r/g, '');
    }
}
function yyyymmdd(usrdate) {
	var yyyy = usrdate.getFullYear().toString();
	var mm = (usrdate.getMonth()+1).toString(); // getMonth() is zero-based
	var dd = usrdate.getDate().toString();
	return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]); // padding
}
function nvl(obj, defaultValue) {
	if (Custom.isNotNull(obj) == true) {return defaultValue;} else{ return obj;}
}
function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

var ExecuteOnObjectPropertyExist = function (subObjectItems, name, namefunction) {
	if (subObjectItems) {
		if ((subObjectItems.length === undefined) ) {
			var appo = subObjectItems;
			subObjectItems = [];
			subObjectItems[0] = appo;
		}
		for (var i = 0; i < subObjectItems.length; i++) {
			if (subObjectItems[i][name] !== undefined) {
				log('ExecuteOnObjectPropertyExist Obj:' + subObjectItems[i].name);
				if (namefunction.indexOf("(") > 0){
					namefunction = namefunction.replace('objparam', 'subObjectItems[i]');
					eval(namefunction + ';');
				}else{
					eval(namefunction + '(subObjectItems[i]);');
				}
				//return subObjectItems[i];
			}
			var found = ExecuteOnObjectPropertyExist(subObjectItems[i].items, name, namefunction);
			if (found) return found;
		}
	}
};
var ExecuteOnObjectPropertyValue = function (subObjectItems, name, valuekey, namefunction) {
	if (subObjectItems) {
		if ((subObjectItems.length === undefined) ) {
			var appo = subObjectItems;
			subObjectItems = [];
			subObjectItems[0] = appo;
		}
		for (var i = 0; i < subObjectItems.length; i++) {
			if (subObjectItems[i][name] == valuekey) {
				log('ExecuteOnObjectPropertyValue Obj:' + subObjectItems[i].name + ' Property: ' + name);
				if (namefunction.indexOf("(") > 0){
					namefunction = namefunction.replace('objparam', 'subObjectItems[i]');
					eval(namefunction + ';');
				}else{
					eval(namefunction + '(subObjectItems[i]);');
				}
				//return subObjectItems[i];
			}
			var found = ExecuteOnObjectPropertyValue(subObjectItems[i].items, name, valuekey, namefunction);
			if (found) return found;
		}
	}
};
var getSubItemFromName = function (subItems, name) {
	if (subItems) {
		if ((subItems.length === undefined) ) {
			var appo = subItems;
			subItems = [];
			subItems[0] = appo;
		}
		for (var i = 0; i < subItems.length; i++) {
			if (subItems[i].name == name) {
				return subItems[i];
			}
			var found = getSubItemFromName(subItems[i].items, name);
			if (found) return found;
		}
	}
};
var getSubItemFromDataSourceField = function (subItems, datasourcefield) {
	if (subItems) {
		for (var i = 0; i < subItems.length; i++) {
			if (subItems[i].datasourcefield == datasourcefield) {
				return subItems[i];
			}
			var found = getSubItemFromDataSourceField(subItems[i].items, datasourcefield);
			if (found) return found;
		}
	}
};
var removeSubItemFromName = function (subItems, name) {
	if (subItems) {
		for (var i = 0; i < subItems.length; i++) {
			if (subItems[i].name == name) {
				subItems.splice(i,1);
				return subItems[i];
			}
			var found = removeSubItemFromName(subItems[i].items, name);
			if (found) return found;
		}
	}
};

function getUrlVars(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}