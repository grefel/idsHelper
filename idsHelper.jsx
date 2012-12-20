/** 
* License: Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0) http://creativecommons.org/licenses/by-sa/3.0/
* @fileoverview InDesign JavaScript Extension Library ...
 * {@link http://gisbert.wikisquare.de/indesignjs/} 
 *
 * @author Gregor Fellenz
 * @version 0.3
 * @date 10.10.2011
 */


/**
* Helper and tools for common InDesign scripting tasks
* @class <b>idsTools</b> contains InDesign JavaScript Extensions. Include this library and use the idsTools object in your script.<br/><br/><code>#include "idsHelper.jsx"<br/>[...]<br/>_ids = idsTools()<br/>_ids.getPageByObject(_pageItem)</code><br/>
*/
var idsTools = function () {
	return { 
		/**
		* Returns the <b>Page</b> which contains the Object
		* @param {Object} _object PageItem, Text or Object
		* @return the <b>Page</b> containing the object, if no <b>Page</b> can be determined <b>null</b>
		*/
		getPageByObject : function (_object) {
			if (_object != null) {
				_object = _object.getElements ()[0]; // Problems with Baseclass Objects like PageItem in CS5!
				if (_object.hasOwnProperty("baseline")) {
					_object = _object.parentTextFrames[0];
				}
				while (_object != null) {
					if (_object.hasOwnProperty ("parentPage")) return _object.parentPage;
					var whatIsIt = _object.constructor;
					switch (whatIsIt) {
						case Page : return _object;
						case Character : _object = _object.parentTextFrames[0]; break;
						case Footnote :; // drop through
						case Cell : _object = _object.insertionPoints[0].parentTextFrames[0]; break;
						case Note : _object = _object.storyOffset.parentTextFrames[0]; break;
						case XMLElement : if (_object.insertionPoints[0] != null) { _object = _object.insertionPoints[0].parentTextFrames[0]; break; }
						case Application : return null;
						default: _object = _object.parent;
					}
					if (_object == null) return null;
				}
				return _object;	
			} 
			else {
				return null;
			}
		},
		/**
		* Returns the <b>Spread</b> which contains the Object
		* @param {Object} _object PageItem, Text or Object
		* @return The <b>Spread</b> containing the Object, if no <b>Spread</b> can be determined <b>null</b>
		*/
		getSpreadByObject : function (_object) {
			if (_object != null) {
				_object = _object.getElements ()[0]; // Problems with Baseclass Objects like PageItem in CS5!
				if (_object.hasOwnProperty("baseline")) {
					_object = _object.parentTextFrames[0];
				}
				while (_object != null) {
					var whatIsIt = _object.constructor;
					switch (whatIsIt) {
						case Spread : return _object;
						case MasterSpread : return _object;
						case Character : _object = _object.parentTextFrames[0]; break;
						case Footnote :; // drop through
						case Cell : _object = _object.insertionPoints[0].parentTextFrames[0]; break;
						case Note : _object = _object.storyOffset.parentTextFrames[0]; break;
						case XMLElement : if (_object.insertionPoints[0] != null) { _object = _object.insertionPoints[0].parentTextFrames[0]; break; }
						case Application : return null;
						default: _object = _object.parent;
					}
					if (_object == null) return null;
				}
				return _object;
					} 
			else {
				return null;
			}
		},

		/**
		* Selects the given Object, shows the page and centers the view.
		* @param {Object} _object PageItem, Text or Object to show
		* @return {Bool} Status of execution: <b>true</b> everything ok, <b>false</b> something went wrong
		*/
		showIt : function (_object) {
			if (_object != null) {
				var _spread = this.getSpreadByObject (_object);
				if (_spread != null) {
					var _dok = _spread.parent;
					if (_dok.layoutWindows.length > 0 && (app.activeWindow.parent != _dok || app.activeWindow.constructor.name == "StoryWindow" )) {
						app.activeWindow = _dok.layoutWindows[0];
					}
					app.activeWindow.activeSpread = _spread;
				}
				app.select(_object);
				var myZoom = app.activeWindow.zoomPercentage; 
				app.activeWindow.zoom(ZoomOptions.showPasteboard); 
				app.activeWindow.zoomPercentage = myZoom;
				return true;
			}
			else {
				return false;
			}
		},


		/**
		* Creates a new Page and TextFrame. The TextFrame fits into the page margins
		* @param {Page} _page The reference page
		* @param {MasterSpread} [_master] The MasterSpread for the new page. If no value is given, the MasterSpread from <code>_page</code> is applied.
		* @return {TextFrame} The new TextFrame
		*/
		addPageTextFrame : function(_page, _master) {
			var _dok = _page.parent.parent;
			var _newPage = _dok.pages.add(LocationOptions.AFTER, _page);
			if (_master == undefined) _newPage.appliedMaster = _page.appliedMaster;
			else _newPage.appliedMaster = _master;
			var _y1 = _newPage.marginPreferences.top;
			var _y2 = _dok.documentPreferences.pageHeight - _newPage.marginPreferences.bottom;
			if (_newPage.side == PageSideOptions.LEFT_HAND) {
				var _x1 = _newPage.marginPreferences.right;
				var _x2 = _dok.documentPreferences.pageWidth - _newPage.marginPreferences.left;
			} 
			else {
				var _x1 = _newPage.marginPreferences.left;
				var _x2 = _dok.documentPreferences.pageWidth - _newPage.marginPreferences.right;
			}
			var _tf = _newPage.textFrames.add();
			_tf.geometricBounds = [_y1 , _x1 , _y2 , _x2];
			return _tf;
		},


		/**
		* Try to find and override a labeled (CS3/CS4) or named (CS5) MasterPageItem on a Page
		* @param {String} _label The name/label of the PageItem
		* @param {Page} _page The Page 
		* @return {PageItem} The PageItem or <b>null</b>
		*/
		getMasterPageItem : function (_label, _page) {
			if (_page.appliedMaster == null ) return null; // No MasterPage applied 
			var _pi = _page.pageItems.itemByName(_label);
			if (_pi == null ) {
				if (_page.side == PageSideOptions.RIGHT_HAND) {
					var _mpi = _page.appliedMaster.pages[1].pageItems.itemByName(_label);
					try { // Try to release the object
						return _mpi.override(_page);
					} catch (e) { // Object was already released but was deleted as it is also included in _pi!
						return null;
					}
				} else { // Left or Single
					var _mpi = _page.appliedMaster.pages[0].pageItems.itemByName(_label);
					try {
						return _mpi.override(_page);
					} catch (e) {
						return null;
					}
				}
			}
			else { // Object has already been released ...
				return _pi;
			}
		},

		/**
		* Resolves the next Paragraph object. Use this function instead of <code>nextItem()</code> 
		* from the collection Paragraphs as this method is much quicker with long Text objects.
		* @param {Paragraph} _par The reference Paragraph 
		* @return {Paragraph} The next Paragraph or null
		*/
		nextParagraph : function (_par) {
			var _lastCharLetzterIndex = _par.characters[-1].index;
			var _firstCharNaechster = _par.parentStory.characters[_lastCharLetzterIndex + 1];
			if (_firstCharNaechster != null ) return _firstCharNaechster.paragraphs[0];
			else return null;
		},

		/**
		* Resolves the next Character object. Use this function instead of <code>nextItem()</code> 
		* from the collection Characters as this method is much quicker with long Text objects.
		* @param {Character} _char The reference Character
		* @return {Character} The next Character or null
		*/
		nextChar : function (_char) {
			var _lastCharLetzterIndex = _char.index;
			var _firstCharNaechster = _char.parentStory.characters[_lastCharLetzterIndex + 1];
			if (_firstCharNaechster != null ) return _firstCharNaechster;
			else return null;
		},


		/** 
		* Calculates the cap height 
		* @param {Character} _char A reference character for font style and size
		* @return {Number} The cap height relative to the current MeasurementUnit
		*/
		getCapHeight : function (_char) {
			var _tf = app.activeDocument.textFrames.add();
			_tf.geometricBounds = [0,-100,100,-200];
			_tf.textFramePreferences.insetSpacing = [0,0,0,0];
			var _checkChar = _char.duplicate(LocationOptions.AT_BEGINNING, _tf);
			_checkChar.contents = "H";
			_checkChar.alignToBaseline = false;
			_tf.textFramePreferences.firstBaselineOffset = FirstBaseline.CAP_HEIGHT; 
			var _versalHoehe = _checkChar.baseline;
		//~ 	$.writeln("Versahlhöhe ist: " + _versalHoehe);
			_tf.remove();
			return _versalHoehe;
		},

		/**
		* Checks the last TextFrame of the Story. If there is an overflow new Pages and TextFrames are added.
		* @param {Story} _story The Story to check
		* @return {TextFrame} The last TextFrame
		*/
		checkOverflow : function (_story) {
			var _lastTC = _story.textContainers[_story.textContainers.length - 1];
			var _run = true;
			while (_lastTC.overflows && _run) {
				var _last = _story.textContainers.length -1;
				if (_story.textContainers[_last].characters.length == 0 && _story.textContainers[_last -1].characters.length == 0 && _story.textContainers[_last -2].characters.length ==0 ) _run = false;
				var _page = this.getPageByObject(_lastTC);
				var _tf = this.addPageTextFrame(_page);
				_lastTC.nextTextFrame = _tf;
				_lastTC = _tf;
			}
			while (_lastTC.characters.length == 0) {
				var _page = this.getPageByObject(_lastTC);
				_page.remove();
				_lastTC = _story.textContainers[_story.textContainers.length - 1];
			}
			return _lastTC;
		},


		/**
		* Fits an two or more column TextFrame.
		* @param {Story} _tf The TextFrame
		* @param {Number} [_step] The step size in current MeasurementUnits, defaults to 1
		* @return {Bool} <b>true</b> everything worked fine, <b>false</b> cannot fit the TextFrame - too big?
		*/
		fitTextFrame : function (_tf, _step) {
			try {
				if (_step == undefined) _step = 1
				while (_tf.overflows) {
					var _bounds = _tf.geometricBounds;
					_tf.geometricBounds = [_bounds[0],_bounds[1],_bounds[2] + _step,_bounds[3]];
				}
			} catch (e) {
				return false;		
			}
			return true;
		},

		/** 
		* Array sort (according to DIN 5007 Variante 1) includes German umlauts. <code>_array.sort(idsTools.sort_DE)</code>
		*/ 	
		sort_DE : function (a, b) {
			a = removeUmlaut (a);
			b = removeUmlaut (b);
			if (a==b) return 0;
			if (a > b) return 1;
			else return -1;
			// Replace german umlauts
			function removeUmlaut (a) {
				a = a.toLowerCase();
				a = a.replace(/ä/g,"a");
				a = a.replace(/ö/g,"o");
				a = a.replace(/ü/g,"u");
				a = a.replace(/ß/g,"s");	
				return a;
			}	
		},
		/**
		* Reads a File and returns the String
		* @param {File} _file The File to read
		* @return {String} The content of the File or <b>false</b>
		*/
		readTextFile : function (_file, _encoding) {
			if (_file.constructor.name == "File" && _file.exists) {
				try {
					if (_encoding != undefined) _file.encoding = _encoding;
					_file.open("r");
					var _res = _file.read(); 
					_file.close();
					return _res;
				} catch (e) {return e}
			} 
			else {
				return Error ("This is not a File");
			}
		},
		/**
		* Writes a String to a UTF-8 encoded File
		* @param {File} _file The File
		* @param {String} _string The String to write
		* @return {Bool} <b>true</b> everything worked fine, {Error} something went wrong
		*/
		writeTextFile : function (_file, _string) {
			if (_file.constructor.name == "File") {
				try {
					_file.encoding = "UTF-8";
					_file.open( "w" );
					_file.writeln (_string);
					_file.close ();
					return true;
				} catch (e) {return e}
			} 
			else {
				return Error ("This is not a File");
			}
		},
		/**
		* Returns a File-Filter for a File-Dialog
		* @param {String} _ext The File Extension
		* @param {String} _string The Information Text 
		* @return {String|Function} The Filter String for Windows, the Filter Function for MacOS
		*/
		getFileFilter : function (_ext, _string) {
			if (File.fs == "Windows") {
				_ext =_ext.replace(/\*/g, "");
				_string =_string.replace(/:/g, "");
				var _filter = _string + ":*"+ _ext;
			} 
			else {
				function _filterFilesMac(file) {
					while (file.alias) {
						file = file.resolve();
						if (file == null) { return false }
					}
					if (file.constructor.name == "Folder") return true;
					var _extension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
					if (_extension.indexOf (_ext) > -1 ) return true;
					else return false
				}
				var _filter = _filterFilesMac;
			} 
			return _filter;
		},
		// Thanks @Marc Autret http://forums.adobe.com/message/3152162#3152162
		getProgressBar : function (title) { 
			var windowSUI = new Window('palette', ' '+title, {x:0, y:0, width:340, height:60});
			var  pb = windowSUI.add('progressbar', {x:20, y:12, width:300, height:12}, 0, 100);
			var st = windowSUI.add('statictext', {x:10, y:36, width:320, height:20}, '');
			st.justify = 'center';
			windowSUI.center();
			windowSUI.reset = function (msg, maxValue) {
				st.text = msg;
				pb.value = 0;
				pb.maxvalue = maxValue||0;
				pb.visible = !!maxValue;
				this.show();
			}
			 windowSUI.hit = function() {
				 ++pb.value;
			}
			return windowSUI;
		}
	}
}

/**
* Hashmap for JavaScript
* @class <b>idsMap</b> implements a straightforward HashMap based on <a href="http://www.mojavelinux.com/articles/javascript_hashes.html">http://www.mojavelinux.com/articles/javascript_hashes.html</a> by Dan Allen.<br/><br/><code>#include "idsHelper.jsx"<br/>[...]<br/>var _map = idsMap();<br/>_map.pushItem ("key1", "value1");<br/>_map.getItem ("key1");</code>
 * @property {number} length The number of items in the map.
*/	 
var idsMap = function () {
	return { 
		length : 0,
		items : [],
		/**
		* Remove an entry
		* @param {String} _key The key 
		* @return {Object} The removed value
		*/		
		removeItem : function(_key) {
			var _previous;
			if (typeof(this.items[_key]) != 'undefined') {
				this.length--;
				var _previous = this.items[_key];
				delete this.items[_key];
			}
			return _previous;
		},

		/**
		* Get an entry
		* @param {String} _key The key 
		* @return {Object} The value
		*/		
		getItem : function(_key) {
			return this.items[_key];
		},

		/**
		* Push an entry
		* @param {String} _key The (new) key 
		* @param {String} _key The new value 
		* @return {Object} The previous value (if any) or undefined
		*/		
		pushItem : function(_key, _value) {
			var _previous;
			if (typeof(_value) != 'undefined') {
				if (typeof(this.items[_key]) == 'undefined') {
					this.length++;
				}
				else {
					_previous = this.items[_key];
				}
				this.items[_key] = _value;
			}
			return _previous;
		},

		/**
		* Test if the map has an entry
		* @param {String} _key The key 
		* @return {Bool} <b>true</b> everything worked fine, <b>false</b> something went wrong
		*/
		hasItem : function(_key) {
			return typeof(this.items[_key]) != 'undefined';
		},

		/**
		* Removes every entry in the map
		*/
		clear : function() {
			for (var i in this.items) {
				delete this.items[i];
			}
			this.length = 0;
		}
	}
}

// By Harbs http://forums.adobe.com/message/2800152#2800152
//~ function GetItemFromCollection(label,collection){
//~   var scriptVersion = app.scriptPreferences.version;
//~   if( parseFloat(scriptVersion) > 6){app.scriptPreferences.version = 6}
//~   var items = collection.item(label).getElements();
//~   app.scriptPreferences.version = scriptVersion;
//~   if(items.length==0){return null}
//~   if(items.length==1){return items[0]}
//~   return items;
//~ }

/**
* Logging Class
* @class <b>idsLog</b> contains a JavaScript Loggin Extensions. Include this library and use the idsLog object in your script.<br/><br/><code>#include "idsHelper.jsx"<br/>[...]<br/>_log = idsLog(FILE, "DEBUG")<br/>_log.debug("Log me")</code><br/>
* @param {File} _logFile  The Logfile as File-Object.
* @param {String} _logLevel One of the "OFF" "ERROR", "WARN", "INFO", "DEBUG", sets the current Logger to log only Events more or equal severe than the Loglevel.
*/
var idsLog = function (_logFile, _logLevel) {
	if (_logFile.constructor.name == "String") {
		this.logFile = File (_logFile);
	}
	this.logFile = _logFile;
	this.SEVERITY = [];
	this.SEVERITY["OFF"] = 4;
	this.SEVERITY["ERROR"] = 3;
	this.SEVERITY["WARN"] = 2;
	this.SEVERITY["INFO"] = 1;
	this.SEVERITY["DEBUG"] = 0;
	this.logLevel = (_logLevel == undefined) ? 0 : SEVERITY[_logLevel];
	this.writeLog = function (_message, _severity) {
		logFile.open("e");
		logFile.seek(logFile.length);	
		try {
			logFile.writeln(Date() + " [" + _severity + "] " + ((_severity.length == 4) ? " [" : "[")  + app.activeScript.name + "] " + _message);
		} catch (e) {
			//We're running from ESTK 
			logFile.writeln(Date() + " [" + _severity + "] " + ((_severity.length == 4) ? " [" : "[")  + "ESTK] " + _message);
		}
		logFile.close();
	}

	return { 
		/**
		* Writes a debug log message
		* @param {String} _message Message to log.
		*/
		debug : function (_message) {
			if (logLevel <= 0)  writeLog(_message, "DEBUG"); 
		},
		/**
		* Writes a info log message
		* @param {String} _message Message to log.
		*/
		info : function (_message) {
			if (logLevel <= 1)  writeLog(_message, "INFO"); 
		},
		/**
		* Writes a warn log message
		* @param {String} _message Message to log.
		*/
		warn : function (_message) {
			if (logLevel <= 2)  writeLog(_message, "WARN"); 
		},
		/**
		* Writes a warn log message und displays an Alert-Window
		* @param {String} _message Message to log.
		*/
		warnAlert : function (_message) {
			if (logLevel <= 2) {
				writeLog(_message, "WARN"); 
				alert ("PROBLEM [WARN]\n" + _message + "\n\nThere might be more information in the logfile:\n" + logFile);
			}
		},
	
		
		/**
		* Writes a warn log message
		* @param {String} _message Message to log.
		*/
		error : function (_message) {
			if (logLevel <= 3)  writeLog(_message, "ERROR"); 
		}
	} //  return 
}

"idsHelper.jsx loaded.";