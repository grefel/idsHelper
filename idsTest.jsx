﻿/****************
* Testing Framework for Unit Testing
* @Version: 0.92
* @Date: 2016-03-07
* @Author: Gregor Fellenz, http://www.publishingx.de
* @Author: Roland Dreger
* Acknowledgments: Library design pattern from Marc Aturet https://forums.adobe.com/thread/1111415

* Usage: 

#include ../idsTest.jsx
idsTesting.insertBlock("Testing idsLog");  
idsTesting.assertEquals("Message", true, "somethingToTest");  
idsTesting.htmlReport();

*/
$.global.hasOwnProperty('idsTesting') || (function (HOST, SELF) {
	HOST[SELF] = SELF;
	// =================================  
	// PRIVATE  
	// =================================  
	var INNER = {};
	INNER.version = "2019-04-12--1.01"

	INNER.testResults = [];

	INNER.consoleLog = true;
	INNER.htmlFile = File(Folder.desktop + "/testresult.html");
	INNER.writeTextFile = function (string) {
		try {
			INNER.htmlFile.encoding = "UTF-8";
			INNER.htmlFile.open("w");
			INNER.htmlFile.write(string);
			INNER.htmlFile.close();
			return true;
		} catch (e) {
			return e
		}
	}
	INNER.readTextFile = function (_file, _encoding) {
		if (_file.constructor.name == "File" && _file.exists) {
			try {
				if (_encoding != undefined) _file.encoding = _encoding;
				else _file.encoding = "UTF-8";
				_file.open("r");
				var _res = _file.read();
				_file.close();
				return _res;
			} catch (e) { return e }
		}
		else {
			throw Error("This is not a File");
		}
	}



	// =================================  
	// API  
	// =================================  	
	SELF.logToConsole = function (value) {
		INNER.consoleLog = value;
	}
	SELF.assertEquals = function (message, expected, actual) {
		message = message + " <em>Wertevergleich <span class='code'>assertEquals</span></em>";
		if (expected !== actual) {
			INNER.testResults.push({ failed: true, message: message, result: "Expected: <strong>" + expected + "</strong> Actual: <strong>" + actual + "</strong>" });
			if (INNER.consoleLog) $.writeln("Test: " + message + "\nExpected: " + expected + "\nActual: " + actual + "\n\n")
		}
		else {
			INNER.testResults.push({ failed: false, message: message, result: "Expected: <strong>" + expected + "</strong> Actual: <strong>" + actual + "</strong>" });
		}
	};
	SELF.assertString = function (message, expected, actual) {
		message = message + " <em>Stringvergleich <span class='code'>assertString</span></em>";
		if (expected !== actual) {
			INNER.testResults.push({ failed: true, message: message, result: "Expected: <strong>" + expected + "</strong> Actual: <strong>" + actual + "</strong>" });
			if (INNER.consoleLog) $.writeln("Test: " + message + "\nExpected: " + expected + "\nActual: " + actual + "\n\n")
		}
		else {
			INNER.testResults.push({ failed: false, message: message, result: "Expected: <strong>" + expected + "</strong> Actual: <strong>" + actual + "</strong>" });
		}
	};
	SELF.assertRegEx = function (message, regex, actual) {
		message = message + " <em>Regex Test <span class='code'>assertRegEx</span></em>";
		if (!actual.match(regex)) {
			INNER.testResults.push({ failed: true, message: message, result: "regex: " + regex });
			if (INNER.consoleLog) $.writeln("Test: " + message + "\nExpected: " + expected + "\nActual: " + actual + "\n\n")
		}
		else {
			INNER.testResults.push({ failed: false, message: message, result: "regex: " + regex });
		}
	};
	SELF.assertStringInFile = function (message, searchValue, file) {
		message = message + " <em>String in Datei <span class='code'>assertStringInFile</span></em>" + " <span class='hint'><a target='_blank' rel='noopener noreferrer' href='file:///" + file.fsName + "'>" + file.name + "</a></span>";
		if (!file.exists) {
			INNER.testResults.push({ failed: true, message: message , result: "File does not exist" });
			return;
		}
		var string = INNER.readTextFile(file);
		if (string.indexOf(searchValue) == -1) {
			INNER.testResults.push({ failed: true, message: message, result: "searchValue: <strong>" + searchValue + "</strong>" });
			if (INNER.consoleLog) $.writeln("Test: " + message + "\nExpected: " + expected + "\nActual: " + actual + "\n\n")
		}
		else {
			INNER.testResults.push({ failed: false, message: message, result: "searchValue: <strong>" + searchValue + "</strong>" });
		}
	};
	SELF.assertStringNotInFile = function (message, searchValue, file) {
		message = message + " <em>String nicht in Datei <span class='code'>assertStringNotInFile</span></em>" + " <span class='hint'><a target='_blank' rel='noopener noreferrer' href='file:///" + file.fsName + "'>" + file.name + "</a></span>";
		if (!file.exists) {
			INNER.testResults.push({ failed: true, message: message , result: "File does not exist" });
			return;
		}
		var string = INNER.readTextFile(file);
		if (string.indexOf(searchValue) > -1) {
			INNER.testResults.push({ failed: true, message: message, result: "searchValue: <strong>" + searchValue + "</strong>" });
			if (INNER.consoleLog) $.writeln("Test: " + message + "\nExpected: " + expected + "\nActual: " + actual + "\n\n")
		}
		else {
			INNER.testResults.push({ failed: false, message: message, result: "searchValue: <strong>" + searchValue + "</strong>" });
		}
	};
	SELF.assertRegExNotInFile = function (message, regex, file) {
		message = message + " <em>RegEx nicht in Datei <span class='code'>assertRegExNotInFile</span></em>" + " <span class='hint'><a target='_blank' rel='noopener noreferrer' href='file:///" + file.fsName + "'>" + file.name + "</a></span>";
		if (!file.exists) {
			INNER.testResults.push({ failed: true, message: message , result: "File does not exist" });
			return;
		}
		var string = INNER.readTextFile(file);
		if (string.match(regex)) {
			INNER.testResults.push({ failed: true, message: message, result: "RegEx: " + regex + " Found: " + string.match(regex).join("<br/>") });
			if (INNER.consoleLog) $.writeln("Test: " + message + "\nFound: " + string.match(regex) + "\n\n")
		}
		else {
			INNER.testResults.push({ failed: false, message: message, result: "RegEx: <strong>" + regex + "</strong>" });
		}
	};
	SELF.assertRegExInFile = function (message, regex, file) {
		message = message + " <em>RegEx in Datei <span class='code'>assertRegExInFile</span></em>" + " <span class='hint'><a target='_blank' rel='noopener noreferrer' href='file:///" + file.fsName + "'>" + file.name + "</a></span>";
		if (!file.exists) {
			INNER.testResults.push({ failed: true, message: message , result: "File does not exist" });
			return;
		}
		var string = INNER.readTextFile(file);
		if (string.match(regex) != null) {
			INNER.testResults.push({ failed: false, message: message, result: "RegEx: " + regex+ " Found: " + string.match(regex).join("<br/>") });
			if (INNER.consoleLog) $.writeln("Test: " + message + "\nFound: " + string.match(regex) + "\n\n")
		}
		else {
			INNER.testResults.push({ failed: true, message: message, result: "RegEx: <strong>" + regex + "</strong>" });
		}
	};


	SELF.assertGREPInDoc = function (message, findGrepPreferences, doc) {
		message = message + " <em>GREP-Suche <span class='code'>assertGREPInDoc</span></em>";
		try {
			// Save Options
			var saveFindGrepOptions = {};
			saveFindGrepOptions.includeFootnotes = app.findChangeGrepOptions.includeFootnotes;
			saveFindGrepOptions.includeHiddenLayers = app.findChangeGrepOptions.includeHiddenLayers;
			saveFindGrepOptions.includeLockedLayersForFind = app.findChangeGrepOptions.includeLockedLayersForFind;
			saveFindGrepOptions.includeLockedStoriesForFind = app.findChangeGrepOptions.includeLockedStoriesForFind;
			saveFindGrepOptions.includeMasterPages = app.findChangeGrepOptions.includeMasterPages;
			if (app.findChangeGrepOptions.hasOwnProperty("searchBackwards")) saveFindGrepOptions.searchBackwards = app.findChangeGrepOptions.searchBackwards;

			// Set Options
			app.findChangeGrepOptions.includeFootnotes = true;
			app.findChangeGrepOptions.includeHiddenLayers = true;
			app.findChangeGrepOptions.includeLockedLayersForFind = false;
			app.findChangeGrepOptions.includeLockedStoriesForFind = false;
			app.findChangeGrepOptions.includeMasterPages = false;
			if (app.findChangeGrepOptions.hasOwnProperty("searchBackwards")) app.findChangeGrepOptions.searchBackwards = false;

			app.findGrepPreferences = NothingEnum.NOTHING;
			app.findGrepPreferences.properties = findGrepPreferences;
			var results = doc.findGrep();


			// Reset Options
			app.findChangeGrepOptions.includeFootnotes = saveFindGrepOptions.includeFootnotes;
			app.findChangeGrepOptions.includeHiddenLayers = saveFindGrepOptions.includeHiddenLayers;
			app.findChangeGrepOptions.includeLockedLayersForFind = saveFindGrepOptions.includeLockedLayersForFind;
			app.findChangeGrepOptions.includeLockedStoriesForFind = saveFindGrepOptions.includeLockedStoriesForFind;
			app.findChangeGrepOptions.includeMasterPages = saveFindGrepOptions.includeMasterPages;
			if (app.findChangeGrepOptions.hasOwnProperty("searchBackwards")) app.findChangeGrepOptions.searchBackwards = saveFindGrepOptions.searchBackwards;


			if (results == 0) {
				INNER.testResults.push({ failed: true, message: message, result: "GREP: " + findGrepPreferences.toSource() });
				if (INNER.consoleLog) $.writeln("Test: " + message + "\nExpected: " + expected + "\nActual: " + actual + "\n\n")
			}
			else {
				INNER.testResults.push({ failed: false, message: message, result: "GREP: " + findGrepPreferences.toSource() + " with " + results.length + " hits." });
			}
		}
		catch (e) {
			INNER.testResults.push({ failed: false, message: message, result: "Error: " + e });
		}
	};

	/**
	 * Objektsuche im Dokument
	 * Objekttypen: 
	 * ObjectTypes.ALL_FRAMES_TYPE
	 * ObjectTypes.GRAPHIC_FRAMES_TYPE
	 * ObjectTypes.TEXT_FRAMES_TYPE
	 * ObjectTypes.UNASSIGNED_FRAMES_TYPE
	 */
	SELF.assertObjectInDoc = function (message, objectType, findObjectPreferences, doc, expectedLength) {
		message = message + " <em>Objekt-Suche <span class='code'>assertObjectInDoc</span></em>";
		try {
			// Save Options
			var saveFindObjectOptions = {};
			saveFindObjectOptions.includeFootnotes = app.findChangeObjectOptions.includeFootnotes;
			saveFindObjectOptions.includeHiddenLayers = app.findChangeObjectOptions.includeHiddenLayers;
			saveFindObjectOptions.includeLockedLayersForFind = app.findChangeObjectOptions.includeLockedLayersForFind;
			saveFindObjectOptions.includeLockedStoriesForFind = app.findChangeObjectOptions.includeLockedStoriesForFind;
			saveFindObjectOptions.includeMasterPages = app.findChangeObjectOptions.includeMasterPages;
			saveFindObjectOptions.objectType = app.findChangeObjectOptions.objectType;
			
			// Set Options
			app.findChangeObjectOptions.includeFootnotes = true;
			app.findChangeObjectOptions.includeHiddenLayers = true;
			app.findChangeObjectOptions.includeLockedLayersForFind = false;
			app.findChangeObjectOptions.includeLockedStoriesForFind = false;
			app.findChangeObjectOptions.includeMasterPages = false;
			app.findChangeObjectOptions.objectType = objectType; 
			
			app.findObjectPreferences = NothingEnum.NOTHING;
			app.findObjectPreferences.properties = findObjectPreferences;

			var results = doc.findObject();

			// Reset Options
			app.findChangeObjectOptions.includeFootnotes = saveFindObjectOptions.includeFootnotes;
			app.findChangeObjectOptions.includeHiddenLayers = saveFindObjectOptions.includeHiddenLayers;
			app.findChangeObjectOptions.includeLockedLayersForFind = saveFindObjectOptions.includeLockedLayersForFind;
			app.findChangeObjectOptions.includeLockedStoriesForFind = saveFindObjectOptions.includeLockedStoriesForFind;
			app.findChangeObjectOptions.includeMasterPages = saveFindObjectOptions.includeMasterPages;
			app.findChangeObjectOptions.objectType = saveFindObjectOptions.objectType;
			
			if (results.length != expectedLength) {
				INNER.testResults.push({ failed: true, message: message, result: "Object: " + findObjectPreferences.toSource() });
				if (INNER.consoleLog) { 
					$.writeln("Test: " + message + "\nExpected: " + expectedLength + "\nActual: " + results.length + "\n\n"); 
				}
			}
			else {
				INNER.testResults.push({ failed: false, message: message, result: "Object: " + findObjectPreferences.toSource() + " with " + results.length + " hits." });
			}
		}
		catch (e) {
			INNER.testResults.push({ failed: false, message: message, result: "Error: " + e });
		}
	};

	/**
	 * Tabellensuche in Dokument
	 * @param {String} message
	 * @param {TableStyle} tableStyle - Tabellenformat der gesuchten Tabelle
	 * @param {Document} doc
	 * @param {Number} expectedLength - Erwartete Anzahl an Tabellen 
	 */
	SELF.assertTableInDoc = function (message, tableStyle, doc, expectedLength) {
		message = message + " <em>Tabellen-Suche <span class='code'>assertTableInDoc</span></em>";

		var findTextPreferences = {
			findWhat:"<0016>"
		};
		
		try {
			// Save Options
			var saveFindTextOptions = {};
			saveFindTextOptions.caseSensitive = app.findChangeTextOptions.caseSensitive;
			saveFindTextOptions.wholeWord = app.findChangeTextOptions.wholeWord;
			saveFindTextOptions.includeFootnotes = app.findChangeTextOptions.includeFootnotes;
			saveFindTextOptions.includeHiddenLayers = app.findChangeTextOptions.includeHiddenLayers;
			saveFindTextOptions.includeLockedLayersForFind = app.findChangeTextOptions.includeLockedLayersForFind;
			saveFindTextOptions.includeLockedStoriesForFind = app.findChangeTextOptions.includeLockedStoriesForFind;
			saveFindTextOptions.includeMasterPages = app.findChangeTextOptions.includeMasterPages;
			if (app.findChangeTextOptions.hasOwnProperty("searchBackwards")) { saveFindTextOptions.searchBackwards = app.findChangeTextOptions.searchBackwards; }

			// Set Options
			app.findChangeTextOptions.caseSensitive = false;
			app.findChangeTextOptions.wholeWord = false;
			app.findChangeTextOptions.includeFootnotes = true;
			app.findChangeTextOptions.includeHiddenLayers = true;
			app.findChangeTextOptions.includeLockedLayersForFind = false;
			app.findChangeTextOptions.includeLockedStoriesForFind = false;
			app.findChangeTextOptions.includeMasterPages = false;
			if (app.findChangeTextOptions.hasOwnProperty("searchBackwards")) { app.findChangeTextOptions.searchBackwards = false; }

			app.findTextPreferences = NothingEnum.NOTHING;
			app.findTextPreferences.properties = findTextPreferences;

			var results = doc.findText();

			// Reset Options
			app.findChangeTextOptions.caseSensitive = saveFindTextOptions.caseSensitive;
			app.findChangeTextOptions.wholeWord = saveFindTextOptions.wholeWord;
			app.findChangeTextOptions.includeFootnotes = saveFindTextOptions.includeFootnotes;
			app.findChangeTextOptions.includeHiddenLayers = saveFindTextOptions.includeHiddenLayers;
			app.findChangeTextOptions.includeLockedLayersForFind = saveFindTextOptions.includeLockedLayersForFind;
			app.findChangeTextOptions.includeLockedStoriesForFind = saveFindTextOptions.includeLockedStoriesForFind;
			app.findChangeTextOptions.includeMasterPages = saveFindTextOptions.includeMasterPages;
			if (app.findChangeTextOptions.hasOwnProperty("searchBackwards")) app.findChangeTextOptions.searchBackwards = saveFindTextOptions.searchBackwards;

			/* Loop: Tables */
			for (var i = results.length-1; i >=0 ; i--) {

				var curTableChar = results[i];
				if (!curTableChar || !curTableChar.isValid) {
					continue;
				}

				var curTable = curTableChar.tables.firstItem();
				if (!curTable.isValid) {
					continue;
				}
				
				if(curTable.appliedTableStyle !== tableStyle) {
					results.splice(i,1);
				}
			}

			if (results.length != expectedLength) {
				INNER.testResults.push({ failed: true, message: message, result: "Table: " + findTextPreferences.toSource() + "; Tabellenformat: " + tableStyle.name });
				if (INNER.consoleLog) { 
					$.writeln("Test: " + message + "\nExpected: " + expectedLength + "\nActual: " + results.length + "\n\n"); 
				}
			}
			else {
				INNER.testResults.push({ failed: false, message: message, result: "Table: " + findTextPreferences.toSource() + " with " + results.length + " hits." });
			}
		}
		catch (e) {
			INNER.testResults.push({ failed: false, message: message, result: "Error: " + e });
		}
	};

	SELF.insertBlock = function (message, info) {
		INNER.testResults.push({ failed: "block", "message": message, "result": info });
	}
	SELF.htmlReport = function (htmlFile) {


		var htmlString = '<html><head><meta charset="utf-8"><title>Testresults</title><style>' +
			'body 		 { font-family: Calibri, Candara, Segoe, Segoe UI, Optima, Arial, sans-serif;  }' +
			// '.infoBlock  { background-color:  #ccc; padding: 6px; margin: 6px 0 6px 0 } '+ 
			'table 		 { margin: 12px 0 12px 0 } ' +
			'.meta td			 { background-color:  #eee; font-size: 12px; padding: 2px 4px 2px 2px; width: 14em;  min-width: 14em;  max-width: 14em; word-break: break-all; } ' +
			// 'thead tr th:first-child, tbody tr td:first-child { background-color: #eee; width: 14em;  min-width: 14em;  max-width: 14em; word-break: break-all; }' + 
			'.overview 	 { width: 100px; min-width: 100%; max-width: 100%; } ' +
			'.overview td { height: 30px; } ' +
			'td.passed	 { background-color: #339933; } ' +
			'td.failed	 { background-color: #cc0000; } ' +
			'h3.passed	 { color: #339933; background-color: none} ' +
			'h3.failed	 { color: #cc0000; background-color: none} ' +
			'.togglePassed {    color: #339933;     background: transparent;     border: 1px solid #339933;    border-radius: 0px; padding: 3px; margin-left: 6px }' +
			'.testName 	 { background-color: #aaa; padding: 6px; margin: 24px 0 6px 0 } ' +
			'.testPassed { background-color: #b3ffc6; padding: 6px; margin: 6px 0; } ' +
			'.testFailed { background-color: #eb4747;  padding: 6px; margin: 6px 0; } ' +
			'.infoBlock h1 		 { font-size: 28px; font-style: normal; font-variant: normal; font-weight: 700; line-height: 26.4px; margin: 0 0 20px 0 } ' +
			'h1 		 { font-size: 22px; font-style: normal; font-variant: normal; font-weight: 700; line-height: 26.4px; margin: 0 0 6px 0 } ' +
			'h3 		 { font-size: 18px; font-style: normal; font-variant: normal; font-weight: 700; line-height: 15.4px; margin: 0 0 6px 0 } ' +
			'.infoBlock h3 {  margin: 0 0 8px 0 } ' +
			'p  		 { font-size: 14px; font-style: normal; font-variant: normal; font-weight: 400; line-height: 20px; margin: 0} ' +
			'.hint 		 { font-size: 14px; color: #737373; font-weight: normal; } ' +
			'em 		 { font-size: 14px; color: #444; } ' +
			// '.code 		 { font-family: monospace; font-size: 12px; font-style: normal; font-variant: normal; font-weight: 400;} ' +
			'.code 		 { display:none } ' +
			'.testName .hint 		 {  color: #000; } ' +
			'.hide { display: none; } ' +
			'#providedBy { float: right; }' +
			'</style></head><body>' +

			'<div id="providedBy"><p><a href="https://www.publishingx.de/"><img class="logo" width="150px" src="data:image/png;base64,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"/></a></p></div>' +
			'<div class="infoBlock"><h1>Testergebnis für ' + INNER.testSuiteMeta.name + '</h1>' +

			'<table class="meta"><tbody>';

		htmlString += '<tr><td class="key">Version der Testsuite</td> 	<td class="value">' + INNER.testSuiteMeta.version + '</td></tr>';
		htmlString += '<tr><td class="key">Getestetes Skript</td> 		<td class="value">' + INNER.testSuiteMeta.testScript + '</td></tr>';
		htmlString += '<tr><td class="key">Version ' + INNER.testSuiteMeta.testScript + '</td> 	<td class="value">' + INNER.testSuiteMeta.testScriptVersion + '</td></tr>';
		htmlString += '<tr><td class="key">git Commit ID ' + INNER.testSuiteMeta.testScript + '</td> 	<td class="value">' + 'TODO' + '</td></tr>';
		// 'Start und Run Information ... Platform, Datum, Tests. Auswertnung... '
		var date = new Date();
		date = date.getFullYear() + "-" + pad(date.getMonth() + 1, 2) + "-" + pad(date.getDate(), 2) + " " + pad(date.getHours(), 2) + "-" + pad(date.getMinutes(), 2) + "-" + pad(date.getSeconds(), 2);
		htmlString += '<tr><td class="key">Datum</td>					<td class="value">' + date + '</td></tr>';
		htmlString += '<tr><td class="key">Plattform</td>				<td class="value">' + File.fs + '</td></tr>';
		var appVersion = 'InDesign ' + app.version;
		if (app.hasOwnProperty("activeDocument")) {
			appVersion += ' (Desktop)';
		}
		else { // Server
			appVersion += ' (Server)';
		}
		
		htmlString += '<tr><td class="key">InDesign-Version</td>		<td class="value">' + appVersion + '</td></tr>';
		htmlString += '<tr><td class="key">DOM-Version</td>			<td class="value">' + app.scriptPreferences.version + '</td></tr>';
		htmlString += '</tbody></table>'
		var failedCounter = 0;
		var passedCounter = 0;
		for (var i = 0; i < INNER.testResults.length; i++) {
			var result = INNER.testResults[i];
			if (result.failed === "block") {
			}
			else if (result.failed) {
				failedCounter++
			}
			else {
				passedCounter++
			}
		}
		var percentPassed = passedCounter / (failedCounter + passedCounter) * 100;
		var percentFailed = failedCounter / (failedCounter + passedCounter) * 100;

		htmlString += '<table class="overview"><tbody><tr>';
		if (percentFailed > 0 && percentPassed > 0) {
			htmlString += '<td class="failed" width="' + percentFailed + '%"></td>';
			htmlString += '<td class="passed" width="' + percentPassed + '%"></td>';
		}
		else if (percentFailed == 0) {
			htmlString += '<td class="passed" width="' + percentPassed + '%"></td>';
		}
		else if (percentPassed == 0) {
			htmlString += '<td class="failed" width="' + percentFailed + '%"></td>';
		}
		htmlString += '</tr></tbody></table>';

		htmlString += '<h3 class="failed">Tests fehlgeschlagen: ' + failedCounter + '</h3>';

		htmlString += '<h3 class="passed">Tests bestanden: ' + passedCounter + ' ';
		htmlString += '<button class="togglePassed" onclick="toggleView()">Togle display</button></h3>';

		htmlString += '</div>';

		for (var i = 0; i < INNER.testResults.length; i++) {
			var result = INNER.testResults[i];

			if (result.failed === "block") {
				htmlString += '<div class="testName"><h1>' + result.message + '</h1>' +
					'<p>' + result.result + '</p></div>';
			}
			else if (result.failed) {
				htmlString += '<div class="testFailed"><h3>' + result.message + '</h3>' +
					'<p>' + result.result + '</p></div>';
			}
			else {
				htmlString += '<div class="testPassed"><h3>' + result.message + '</h3>' +
					'<p>' + result.result + '</p></div>';
			}

		}

		// var divs = document.querySelectorAll('div'), i;

		htmlString += '<script>';
		htmlString += 'function toggleView() {	var nodes = document.querySelectorAll(".testPassed"); if (!nodes) return;';
		htmlString += ' for (i = 0; i < nodes.length; ++i) {	nodes[i].classList.toggle("hide");  }	}';
		htmlString += '</script>';
		htmlString += '</body></html>';

		if (htmlFile) {
			INNER.htmlFile = htmlFile;
		}

		INNER.writeTextFile(htmlString);
		INNER.htmlFile.execute();
	};

	SELF.setMeta = function (testSuiteMeta) {
		INNER.testSuiteMeta = testSuiteMeta;
	}


})($.global, { toString: function () { return 'idsTesting'; } });  