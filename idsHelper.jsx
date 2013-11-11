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
		* Ungroup recursively 
		* @param {Object} _object Document, Layer, Page or Group... 
		*/
		ungroupAll : function (_object) {
			while (_object.groups.length != 0) {
				_object.groups.everyItem().ungroup();
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
		* @param {_newPage} [Boolean]  Create a new page or not?
		* @return {TextFrame} The new TextFrame		
		*/
		addPageTextFrame : function(_page, _master, _newPage) {
			if (_newPage == undefined)  _newPage = true;
			var _dok = _page.parent.parent;
			if (_newPage ) {
				var _newPage = _dok.pages.add(LocationOptions.AFTER, _page);
				if (_master == undefined) _newPage.appliedMaster = _page.appliedMaster;
				else _newPage.appliedMaster = _master;
			}
			else {
				var _newPage = _page;
			}
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
			var oldV = this.resetDefaults();
//~ 			var _breite = _x2 -_x1;
//~ 			_breiteInPunkt = new UnitValue(  _breite+ "mm").as("pt");
//~ 			var _hoehe = _y2 -_y1;
//~ 			_hoeheInPunkt = new UnitValue( _hoehe + "mm").as("pt");	
//~ 			_tf.resize(BoundingBoxLimits.GEOMETRIC_PATH_BOUNDS, AnchorPoint.TOP_LEFT_ANCHOR , ResizeMethods.REPLACING_CURRENT_DIMENSIONS_WITH, [_breiteInPunkt, _hoeheInPunkt ]);
//~ 			_tf.move([_tf.geometricBounds[1] + _x1, _tf.geometricBounds[0] + _y1]);
			_tf.geometricBounds = [_y1 , _x1 , _y2 , _x2];
			
			_tf.textFramePreferences.textColumnCount = _newPage.marginPreferences.columnCount;
			_tf.textFramePreferences.textColumnGutter =  _newPage.marginPreferences.columnGutter
			
			this.setDefaults(oldV);
			return _tf;
		},

		/** Scales a frame to a given width 
			@param {PageItem} frame The frame to scale
			@param {Number} width The widht in millimeters
			@param {Boolean} maxImageSize is a maximum image size greater 100% allowed?
		*/
			
		scaleToWidth : function (frame, width, maxImageSize) {
			if (maxImageSize == undefined) maxImageSize == false;			
			var gb = frame.geometricBounds;
			frame.geometricBounds = [gb[0], gb[1], gb[0] + width, gb[1] + width];
			frame.fit(FitOptions.FILL_PROPORTIONALLY);
			if (frame.graphics != undefined && frame.graphics[0].isValid) {
				var graphic = frame.graphics[0];
				if (maxImageSize && frame.graphics[0].absoluteHorizontalScale > 100) {
					graphic.absoluteHorizontalScale = 100;
					graphic.absoluteVerticalScale = 100;
				}
				if ((frame.geometricBounds[3] - frame.geometricBounds[1]) < (graphic.geometricBounds[3] - graphic.geometricBounds[1]) ) {
					frame.fit(FitOptions.PROPORTIONALLY);
					frame.fit(FitOptions.FRAME_TO_CONTENT);
				} 
				else {
					frame.fit(FitOptions.FRAME_TO_CONTENT);
				}			
			}
		},
		/** Scales a frame to a given height 
			@param {PageItem} frame The frame to scale
			@param {Number} height The height in millimeters
			@param {Boolean} maxImageSize is a maximum image size greater 100% allowed?
		*/
			
		scaleToHeight : function (frame, height, maxImageSize) {
			if (maxImageSize == undefined) maxImageSize == false;			
			var gb = frame.geometricBounds;
			frame.geometricBounds = [gb[0], gb[1], gb[0] + width, gb[1] + width];
			frame.fit(FitOptions.FILL_PROPORTIONALLY);
			if (frame.graphics != undefined) {
				var graphic = frame.graphics[0];
				if (maxImageSize && frame.graphics[0].absoluteHorizontalScale > 100) {
					graphic.absoluteHorizontalScale = 100;
					graphic.absoluteVerticalScale = 100;
				}
				if ((frame.geometricBounds[2] - frame.geometricBounds[0]) < (graphic.geometricBounds[2] - graphic.geometricBounds[0]) ) {
					frame.fit(FitOptions.PROPORTIONALLY);
					frame.fit(FitOptions.FRAME_TO_CONTENT);
				} 
				else {
					frame.fit(FitOptions.FRAME_TO_CONTENT);
				}			
			}			
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
					var _mPage = _page.appliedMaster.pages[1];
					var _mpi = _mPage.pageItems.itemByName(_label);
					while (_mpi == null && _mPage.appliedMaster != null) {
						_mpi = _mPage.appliedMaster.pages[1].pageItems.itemByName(_label);
						_mPage = _mPage.appliedMaster.pages[1];
					}
					try { // Try to release the object
						var pageItem = _mpi.override(_page);
						var piBounds = pageItem.geometricBounds;
						var mpiBounds = _mpi.geometricBounds;
						if (piBounds[0]  != mpiBounds[0] ||  piBounds[1]  != mpiBounds[1] ) {
							pageItem.geometricBounds = mpiBounds;
						} 						
						return pageItem;
					} catch (e) { // Object was already released but was deleted as it is also included in _pi!
						return null;
					}
				} else { // Left or Single
					var _mPage = _page.appliedMaster.pages[0];
					var _mpi = _mPage.pageItems.itemByName(_label);
					while (_mpi == null && _mPage.appliedMaster != null) {
						_mpi = _mPage.appliedMaster.pages[0].pageItems.itemByName(_label);
						_mPage = _mPage.appliedMaster.pages[0];
					}					
					try {
						var pageItem = _mpi.override(_page);
						var piBounds = pageItem.geometricBounds;
						var mpiBounds = _mpi.geometricBounds;
						if (piBounds[0]  != mpiBounds[0] ||  piBounds[1]  != mpiBounds[1] ) {
							pageItem.geometricBounds = mpiBounds;
						} 						
						return pageItem;
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
			while (_story.textContainers.length > 1 && _lastTC.characters.length == 0) {
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
		* Removes all TextFrame but first from a Story.
		* @param {Story} The Story
		* @return {Story} The story
		*/
		
		removeContainerFromStory : function (story) {
			while (story.textContainers.length > 1) {
				story.textContainers[story.textContainers.length -1].remove();
			}
			return story;
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
		* Unique an Array 
		* @param {Array} The Array to unique
		* @return {Array} Array
		*/
		unique : function (arr) {
			var hash = {}, result = [];
			for ( var i = 0, l = arr.length; i < l; ++i ) {
				if ( !hash.hasOwnProperty(arr[i]) ) { //it works with objects! in FF, at least
					hash[ arr[i] ] = true;
					result.push(arr[i]);
				}
			}
			return result;
		},
		/**
		* Unique and count  Array 
		* @param {Array} Sorted Array
		* @return {Array} Array
		*/
		uniqueAndCount : function (array) {
			var arr = [], a = [], b = [], prev;
			
			for ( var i = 0; i < array.length; i++ ) {
				if (array[i] != "") arr.push(array[i]);
			}
			

			for ( var i = 0; i < arr.length; i++ ) {
				if ( arr[i] !== prev ) {
					a.push(arr[i]);
					b.push(1);
				} else {
					b[b.length-1]++;
				}
				prev = arr[i];
			}

			return [a, b];
		},
		/**
		* Locate a File   
		* @param {String} name The filename too look after 
		* @param {String} folderName 
		* @param {Boolean} recursive defaults to false
		* @param {Boolean} verbose defaults to false 
		* @return {File|null} The file 
		*/
		/*File */ getFile : function (name, folderName, recursive, verbose) {
			if (recursive == undefined)  recursive = false;
			if (verbose == undefined) verbose = false;
			if (folderName == undefined) {
				try {
					folderName  = app.activeScript.parent;
				} 
				catch (e) { 
					/* We're running from the ESTK*/
					folderName = File(e.fileName).parent;
				}
			}
			
			name =  name.replace (/file:\/\//, "");
			if (name == "") return null;
			var file =  File (folderName  + "/" + name);
			
			if (!file.exists && recursive) {
				var fileArray = this.getFilesRecursively (new Folder (folderName));
				for (var i = 0; i < fileArray.length; i++) {
					if (fileArray[i].name == name ) return fileArray[i];
					if (fileArray[i].displayName == name ) return fileArray[i];
				}
			}
			if (!file.exists &&  verbose) { 
				var file =  File.openDialog ("Bitte wählen Sie die Datei [" + name  + "] aus");
				if (!file || !file.exists) {
					return null;
				}
			}
			else {
				return null;
			}
		
			return file;
		},
		/**
		* Get Files Recursively
		* @param folder
		*/
		/* Array */ getFilesRecursively : function (folder, fileArray) {
			if (fileArray == undefined) fileArray = [];
			var children = folder.getFiles();
			for (var i = 0; i < children.length; i++) {
				var child = children[i];
				if (child instanceof File) {
					fileArray.push(child);
				}
				else if (child instanceof Folder) {
					fileArray = this.getFilesRecursively (child, fileArray);
				}
				else {
					throw new Error("The object at \"" + child.fullName + "\" is a child of a folder and yet is not a file or folder.");
				}
			}
			return fileArray;
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
		/**
		* Loads XMP Library 
		* @return {Boolean} Result
		*/		
		loadXMPLibrary : function () {
			if ( !ExternalObject.AdobeXMPScript ){
				try {
					ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
				}
				catch (e) {
//~ 					alert("Unable to load the AdobeXMPScript library!"); 
					return false;
				}
			}
			return true;
		},
		/**
		* Unloads XMP Library 
		* @return {Boolean} Result
		*/
		unloadXMPLibrary : function () { 
			if( ExternalObject.AdobeXMPScript ) { 
				try { 
					ExternalObject.AdobeXMPScript.unload(); 
					ExternalObject.AdobeXMPScript = undefined; 
				}
				catch (e) {
//~ 					alert("Unable to unload the AdobeXMPScript library!"); 
					return false;
				}
			}
			return true;
		},
		/** Finds a PageItem By Name via allPageItems ...  
		* 	
		*/
		getPageItemByName : function (page, name) {
			for (var i = 0; i < page.allPageItems.length; i++) {
				if (page.allPageItems[i].name == name) return page.allPageItems[i];
			}
			return null;
		},
		/**
		* Distributes the columns of a table relatively to the available width. TODO add support for borders
		* @param {Table} table The table 
		* @param {Number} width The desired width
		* @return {void} 
		*/		
		distributeColumns  : function (table, width) {
			var tableWidth = table.width;
			for (var i = 0; i < table.columns.length; i++) {
					var col = table.columns[i];
					var ratio = col.width/tableWidth;
					col.width = ratio * width;
			}
		},	
		/**
		* Returns a PageItem by give CoordinateRange
		* @param {Page} page The page to search on
		* @param {Array} x The horizontal range, Array with two values 
		* @param {Array} y The vertical range, Array with two values 
		* @return {PageItem|null} The PageItem
		*/
		/*   */
		getPageItemsByCoord : function (page, x , y ) {
			for (var i = 0; i < page.pageItems.length; i++) {
				var pItem = page.pageItems[i];
				var x1 = pItem.geometricBounds[1];
				var y1 = pItem.geometricBounds[0];		
				if (x1 >= x[0] && x1 <= x[1] && y1 >= y[0] && y1 <= y[1]) {
					return pItem;
				} 
			}
			return null;
		},
	
		/* Finds a ParagraphStyle */
		getParagraphStyle : function  (styleName, groupName, fuzzy) {
			return this.getStyle(app.activeDocument, styleName, groupName, fuzzy, "Paragraph");
		},
		/* Finds a CharacterStyle*/
		getCharacterStyle : function (styleName, groupName, fuzzy) {
			return this.getStyle(app.activeDocument, styleName, groupName, fuzzy, "Character");
		},
		/* Finds an ObjectStyle */
		getObjectStyle : function (styleName, groupName, fuzzy) {
			return this.getStyle(app.activeDocument, styleName, groupName, fuzzy, "Object");
		},
	
		getStyle : function (dok, styleName, groupName, fuzzy, styleType) {
			if (groupName == undefined) groupName = false;
			if (fuzzy == undefined) fuzzy = false;
			
			if (!groupName) {
				// Passt genau
				if (styleType == "Paragraph" && dok.paragraphStyles.itemByName(styleName).isValid )  return dok.paragraphStyles.itemByName(styleName);
				if (styleType == "Character" && dok.characterStyles.itemByName(styleName).isValid )  return dok.characterStyles.itemByName(styleName);
				if (styleType == "Object" && dok.objectStyles.itemByName(styleName).isValid )  return dok.objectStyles.itemByName(styleName);
					if (fuzzy) {
					if (styleType == "Paragraph") var allStyles = dok.allParagraphStyles;
					if (styleType == "Character") var allStyles = dok.allCharacterStyles;
					if (styleType == "Object") var allStyles = dok.allObjectStyles;
					for (i =0; i < allStyles.length; i++) {
						if (compareStyleNames (allStyles[i].name, styleName)) return allStyles[i];
					}
				}
			}
			// Gruppe Berüchsichtigen
			else {
				if (styleType == "Paragraph" && dok.paragraphStyleGroups.itemByName(groupName).isValid ) {
					var styleGroup = dok.paragraphStyleGroups.itemByName(groupName);
					if (styleGroup.paragraphStyles.itemByName(styleName).isValid )  return styleGroup.paragraphStyles.itemByName(styleName);
				} 
				if (styleType == "Character" && dok.characterStyleGroups.itemByName(groupName).isValid ) {
					var styleGroup = dok.characterStyleGroups.itemByName(groupName);
					if (styleGroup.characterStyles.itemByName(styleName).isValid )  return styleGroup.characterStyles.itemByName(styleName);
				} 
				if (styleType == "Object" && dok.objectStyleGroups.itemByName(groupName).isValid ) {
					var styleGroup = dok.objectStyleGroups.itemByName(groupName);
					if (styleGroup.objectStyleGroups.itemByName(styleName).isValid )  return styleGroup.objectStyleGroups.itemByName(styleName);
				} 
			
				if (fuzzy) {
					if (styleType == "Paragraph") var allGroups = dok.paragraphStyleGroups;
					if (styleType == "Character") var allGroups = dok.characterStyleGroups;
					if (styleType == "Object") var allGroups = dok.objectStyleGroups;
					for (var i = 0;  i < allGroups.length; i++) {
						if (compareStyleNames (allGroups[i].name, groupName)) {
							if (styleType == "Paragraph") var allStyles = allGroups[i].paragraphStyles;
							if (styleType == "Character") var allStyles = allGroups[i].characterStyles;
							if (styleType == "Object") var allStyles = allGroups[i].objectStyles;

							for (var k = 0;  k < allStyles.length; k++) {
								if (compareStyleNames (allStyles[k].name, styleName)) return allStyles[k];
							}
						}
					}
					// Er war nicht in der Gruppe also gucken wir ob er irgendwo sonst aufzutreiben ist
					if (styleType == "Paragraph") var allStyles = dok.allParagraphStyles;
					if (styleType == "Character") var allStyles = dok.allCharacterStyles;
					if (styleType == "Object") var allStyles = dok.allObjectStyles;
					for (i =0; i < allStyles.length; i++) {
						if (compareStyleNames (allStyles[i].name, styleName)) return allStyles[i];
					}
				}
			}
			// Es konnte kein Format gefunden werden
			return null;
			// Helper 
			function compareStyleNames (name, compareName) {
				var cleanedCurrentStyleName = cleanStyleName(name);
				var cleanedPStyleName = cleanStyleName(compareName);
				if (cleanedCurrentStyleName.indexOf (cleanedPStyleName) > -1) return true;
				else return false;

				function cleanStyleName (stylename) {
					cleanName = stylename.toLowerCase();
					cleanName = cleanName.replace(/\s+/g,"");
					cleanName = cleanName.replace(/\(.+?\)/, "");
					cleanName = cleanName.replace(/_a\*$/, "");
					return cleanName;
				}
			}
		},

		/**
		* Pad a number widt leading zero
		* @param {String|Number} number  Startvalue
		* @param {Number} length The length of the String 
		* @param {String} fill The value to fill up, Default is '0'
		* @return {String} 
		*/
		pad : function (number, length, fill) { 
			if (fill == undefined) fill = "0";
				var str = '' + number;
				while (str.length < length) {
					str = fill + str;
				}   
				return str;
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
		},
		/**
		* Reset Measurement Units to mm 
		* @return {Object} The old values
		*/
		resetDefaults : function() {
			var dok = app.documents[0];
			var oldValues = {
				horizontalMeasurementUnits:dok.viewPreferences.horizontalMeasurementUnits,
				verticalMeasurementUnits:dok.viewPreferences.verticalMeasurementUnits,
				viewPreferences:dok.viewPreferences.rulerOrigin,
				zeroPoint:dok.zeroPoint,
				textDefaultParStyle:dok.textDefaults.appliedParagraphStyle,
				textDefaultCharStyle:dok.textDefaults.appliedCharacterStyle
			}		
			dok.textDefaults.appliedCharacterStyle = dok.characterStyles[0];
			dok.textDefaults.appliedParagraphStyle = dok.paragraphStyles[1];
//~ 	px.idDocument.pageItemDefaults.appliedGraphicObjectStyle
//~ 	px.idDocument.pageItemDefaults..appliedGridObjectStyle
//~ 	px.idDocument.pageItemDefaults..appliedTextObjectStyle		
			dok.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.MILLIMETERS;
			dok.viewPreferences.verticalMeasurementUnits = MeasurementUnits.MILLIMETERS;
			dok.viewPreferences.rulerOrigin = RulerOrigin.PAGE_ORIGIN;
			dok.zeroPoint = [0,0]
			return oldValues;
		},
		/**
		* Set Measurement as given in values
		* @return {Object} The old values
		*/
		setDefaults : function(values) {
			var dok = app.documents[0];
			dok.viewPreferences.horizontalMeasurementUnits = values.horizontalMeasurementUnits;
			dok.viewPreferences.verticalMeasurementUnits = values.verticalMeasurementUnits;
			dok.viewPreferences.rulerOrigin = values.viewPreferences;
			dok.zeroPoint = values.zeroPoint;
			dok.textDefaults.appliedParagraphStyle = values.textDefaultParStyle;
			dok.textDefaults.appliedCharacterStyle = values.textDefaultCharStyle;
		},
		trim : function (string) {
			string = string.replace(/^\s+/g,"");
			string = string.replace(/\s+$/g,"");
			return string;
		},
		/**
		* Recursively remove XML-Tags 
		* @param {XMLElement} xmlElement The XML-Element to start from 
		*/
		untag : function (xmlElement) {
			while(xmlElement.xmlElements.length > 0) {
				xmlElement.xmlElements[-1].untag();
			}
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
		* Writes a info log message und displays an Alert-Window
		* @param {String} _message Message to log.
		*/
		infoAlert : function (_message) {
			if (logLevel <= 2) {
				writeLog(_message, "INFO"); 
				alert ("[INFO]\n" + _message);
			}
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
		* Writes a error log message
		* @param {String} _message Message to log.
		*/
		error : function (_message) {
			if (logLevel <= 3)  writeLog(_message, "ERROR"); 
		}
	} //  return 
}

"idsHelper.jsx loaded.";