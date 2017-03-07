/****************
* Testing Framework for Unit Testing
* @Version: 0.91
* @Date: 2016-03-07
* @Author: Gregor Fellenz, http://www.publishingx.de
* Acknowledgments: Library design pattern from Marc Aturet https://forums.adobe.com/thread/1111415

* Usage: 

#include ../idsTest.jsx
idsTesting.insertBlock("Testing idsLog");  
idsTesting.assertEquals("Message", true, "somethingToTest");  
idsTesting.htmlReport();

*/
$.global.hasOwnProperty('idsTesting') || (function(HOST, SELF) {  
	HOST[SELF] = SELF;  
	// =================================  
	// PRIVATE  
	// =================================  
	var INNER = {};   
	INNER.version = "2016-03-29--0.9"

	INNER.testResults = [];
	
	INNER.consoleLog = true;
	INNER.htmlFile = File(Folder.desktop + "/testresult.html");
	INNER.writeTextFile =  function (string) {
		try {
			INNER.htmlFile.encoding = "UTF-8";
			INNER.htmlFile.open( "w" );
			INNER.htmlFile.write (string);
			INNER.htmlFile.close ();
			return true;
		} catch (e) {
			return e
		}
	}
	INNER.readTextFile = function (_file, _encoding) {
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
			throw Error ("This is not a File");
		}
	}


	    
	// =================================  
	// API  
	// =================================  	
	SELF.logToConsole = function (value) {
		INNER.consoleLog = value;
	}
	SELF.assertEquals = function(message, expected, actual) { 		        
		if (expected !== actual) {
			INNER.testResults.push({failed:true, message:message, result:"Expected: " +expected + " Actual: "+ actual });
			if (INNER.consoleLog) $.writeln("Test: " + message + "\nExpected: " +expected + "\nActual: "+ actual + "\n\n")			
		}		
		else {
			INNER.testResults.push({failed:false, message:message, result:"Expected: " +expected + " Actual: "+ actual });
		}
	};
	SELF.assertString = function(message, expected, actual) { 		        
		if (expected !== actual) {
			INNER.testResults.push({failed:true, message:message, result:"Expected: " +expected + " Actual: "+ actual });
			if (INNER.consoleLog) $.writeln("Test: " + message + "\nExpected: " +expected + "\nActual: "+ actual + "\n\n")			
		}		
		else {
			INNER.testResults.push({failed:false, message:message, result:"Expected: " +expected + " Actual: "+ actual });
		}
	};
	SELF.assertRegEx = function(message, regex, actual) { 		        
		if (!actual.match(regex)) {
			INNER.testResults.push({failed:true, message:message, result:"regex: " +regex });
			if (INNER.consoleLog) $.writeln("Test: " + message + "\nExpected: " +expected + "\nActual: "+ actual + "\n\n")			
		}		
		else {
			INNER.testResults.push({failed:false, message:message, result:"regex: " +regex });
		}
	};
	SELF.assertRegExInFile = function(message, regex, file) { 		        
		message = message + " <a href='file:///"+ file.fsName+ "'>" + file.name +"</a>";
		var string = INNER.readTextFile(file);
		if (!string.match(regex)) {
			INNER.testResults.push({failed:true, message:message, result:"regex: " +regex });
			if (INNER.consoleLog) $.writeln("Test: " + message + "\nExpected: " +expected + "\nActual: "+ actual + "\n\n")			
		}		
		else {
			INNER.testResults.push({failed:false, message:message, result:"regex: " +regex });
		}
	};
	SELF.assertRegExNotInFile = function(message, regex, file) { 		        
		message = message + " <a href='file:///"+ file.fsName+ "'>" + file.name +"</a>";
		var string = INNER.readTextFile(file);
		if (string.match(regex)) {
			INNER.testResults.push({failed:true, message:message, result:"regex: " +regex });
			if (INNER.consoleLog) $.writeln("Test: " + message + "\nExpected: " +expected + "\nActual: "+ actual + "\n\n")			
		}		
		else {
			INNER.testResults.push({failed:false, message:message, result:"regex: " +regex });
		}
	};
	SELF.assertStringInFile = function(message, searchValue, file) {
		message = message + " <a href='file:///"+ file.fsName+ "'>" + file.name +"</a>";
		var string = INNER.readTextFile(file);
		if (string.indexOf (searchValue) == -1) {
			INNER.testResults.push({failed:true, message:message, result:"searchValue: " +searchValue });
			if (INNER.consoleLog) $.writeln("Test: " + message + "\nExpected: " +expected + "\nActual: "+ actual + "\n\n")			
		}		
		else {
			INNER.testResults.push({failed:false, message:message, result:"searchValue: " +searchValue });
		}
	};
	SELF.assertStringNotInFile = function(message, searchValue, file) { 		        
		message = message + " <a href='file:///"+ file.fsName+ "'>" + file.name +"</a>";
		var string = INNER.readTextFile(file);
		if (string.indexOf (searchValue) > -1) {
			INNER.testResults.push({failed:true, message:message, result:"searchValue: " +searchValue });
			if (INNER.consoleLog) $.writeln("Test: " + message + "\nExpected: " +expected + "\nActual: "+ actual + "\n\n")			
		}		
		else {
			INNER.testResults.push({failed:false, message:message, result:"searchValue: " +searchValue });
		}
	};

	SELF.assertGREPInDoc = function(message, GREP, doc) { 		        
		message = message + " GREP in " + doc.name ;
		app.findGrepPreferences = NothingEnum.NOTHING;
		app.findGrepPreferences.findWhat = GREP;
		var results = doc.findGrep();
		
		if (results == 0) {
			INNER.testResults.push({failed:true, message:message, result:"GREP: " +GREP });
			if (INNER.consoleLog) $.writeln("Test: " + message + "\nExpected: " +expected + "\nActual: "+ actual + "\n\n")			
		}		
		else {
			INNER.testResults.push({failed:false, message:message, result:"GREP: " +GREP  + " with " + results.length + " hits."});
		}
	};

	SELF.insertBlock = function (message) {
		INNER.testResults.push({failed:"block", message:message});
	}
	SELF.htmlReport= function() { 		        
		var htmlString = '<html><head><meta charset="utf-8"><title>Testresults</title><style>.testPassed { background-color: green; } .testFailed { background-color: red; }</style></head><body>';
		for (var i = 0; i < INNER.testResults.length; i++) {
			var result = INNER.testResults[i];
			if (result.failed === "block") {
				htmlString += '<div class="block"><h1>' + result.message + '</h1></div>';
			} 
			else if (result.failed) {
				htmlString += '<div class="testFailed"><h2>' + result.message + '</h2><p>' + result.result + '</p></div>';			
			} 
			else {
				htmlString += '<div class="testPassed"><h2>' + result.message + '</h2><p>' + result.result + '</p></div>';			
			}
		}
		htmlString += '</body></html>';	
	
		INNER.writeTextFile(htmlString);
		INNER.htmlFile.execute();		
	};

}) ($.global, {toString:function() {return 'idsTesting';}});  