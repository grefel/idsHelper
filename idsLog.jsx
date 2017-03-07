﻿/****************
* Logging Class 
* @Version: 0.99
* @Date: 2017-03-06
* @Author: Gregor Fellenz, http://www.publishingx.de
* Acknowledgments: Library design pattern from Marc Aturet https://forums.adobe.com/thread/1111415

* Usage: 

log = idsLog.getLogger("~/Desktop/testLog.txt", "INFO");
log.warnAlert("Warn message");

*/
$.global.hasOwnProperty('idsLog') || ( function (HOST, SELF) {
	HOST[SELF] = SELF;

	/****************
	* PRIVATE
	*/
	var INNER = {};
	INNER.version = "2017-02-27-0.97"
	INNER.disableAlerts = false;
	INNER.logLevel = 0;
	INNER.SEVERITY = [];
	INNER.SEVERITY["OFF"] = 4;
	INNER.SEVERITY["ERROR"] = 3;
	INNER.SEVERITY["WARN"] = 2;
	INNER.SEVERITY["INFO"] = 1;
	INNER.SEVERITY["DEBUG"] = 0;

	INNER.writeLog = function(msg, severity, file) { 
		if (msg == undefined) {
			msg = ""; // return ?
		}
		if (( msg instanceof Error) ) {
			msg =  msg + " -> " + msg.line
		}
		if (msg.constructor.name != String) {
			msg = msg.toString();
		}	
		var date = new Date();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		var hour = date.getHours();
		var minute = date.getMinutes();
		var second = date.getSeconds();		
		var dateString = (date.getYear() + 1900) + "-" + ((month < 10)  ? "0" : "") + month + "-" + ((day < 10)  ? "0" : "") + day + " " +  ((hour < 10)  ? "0" : "") + hour+ ":" +  ((minute < 10)  ? "0" : "") + minute+ ":" + ((second < 10)  ? "0" : "") + second;
		var padString = (severity.length == 4) ? " " : ""
		msg = msg.replace(/\r|\n/g, '<br/>');
		file.encoding = "UTF-8";
		file.open("a");
		if (INNER.logLevel == 0) {
			var stack = $.stack.split("\n");
			stack = stack[stack.length - 4];		
			file.writeln(dateString + " [" + severity + "] " +  padString + "[" + msg + "] Function: " + stack.substr (0, 100));		
		} else {
			file.writeln(dateString + " [" + severity + "] " + padString + "[" + msg + "]");					
		}
		file.close();
	};
	INNER.showAlert = function(title, msg, type){
		if (!INNER.disableAlerts) {
			if (msg.length < 300) {
				alert(msg, title) 
			}
			else {
				INNER.showMessages(title, [msg], type);
			}
		}
	};
	INNER.showMessages = function(title, msgArray, type) { 
		if (!INNER.disableAlerts && msgArray.length > 0) {
			var callingScriptVersion = "    ";
			if ($.global.hasOwnProperty ("px") && $.global.px.hasOwnProperty ("projectName")  ){
				callingScriptVersion += px.projectName;
			} 
			if ($.global.hasOwnProperty ("px") && $.global.px.hasOwnProperty ("version")  ){
				callingScriptVersion += " v" + px.version;
			} 
			var msg = msgArray.join("\n");
			var dialogWin = new Window ("dialog", title + callingScriptVersion);
			dialogWin.etMsg = dialogWin.add ("edittext", undefined, msg, {multiline: true, scrolling: true});
			dialogWin.etMsg.maximumSize.height = 300;
			dialogWin.etMsg.minimumSize.width = 500;
						
			dialogWin.gControl = dialogWin.add("group");
			dialogWin.gControl.preferredSize.width = 500;
			dialogWin.gControl.alignChildren = ['right', 'center'];
			dialogWin.gControl.margins = 0;								
			dialogWin.gControl.btSave = null;
			dialogWin.gControl.btSave = dialogWin.gControl.add ("button", undefined, localize({en:"Save",de:"Speichern"}) + " " + type);
			dialogWin.gControl.btSave.onClick = function () {
				var texFile = File.saveDialog(localize({en:"Save information in text file ",de:"Speichern der Informationen in einer Textdatei"}), INNER.getFileFilter (".txt", localize({en:"Textfile ",de:"Textdatei"}))  );
				if (texFile) {
					if (! texFile.name.match (/\.txt$/)) {
						texFile = File(texFile.fullName + ".txt");
					}
					texFile.encoding = "UTF-8";
					texFile.open("e");
					texFile.writeln(msg);					
					texFile.close();
					dialogWin.close();
				}
			}
			dialogWin.gControl.add ("button", undefined, "Ok", {name: "ok"});
			dialogWin.show();
		}
	};
	INNER.confirmMessages = function(title, msgArray, type) { 
		if (!INNER.disableAlerts && msgArray.length > 0) {
			var callingScriptVersion = "    ";
			if ($.global.hasOwnProperty ("px") && $.global.px.hasOwnProperty ("projectName")  ){
				callingScriptVersion += px.projectName;
			} 
			if ($.global.hasOwnProperty ("px") && $.global.px.hasOwnProperty ("version")  ){
				callingScriptVersion += " v" + px.version;
			} 
			var msg = msgArray.join("\n");
			var dialogWin = new Window ("dialog", title + callingScriptVersion);
			dialogWin.etMsg = dialogWin.add ("edittext", undefined, msg, {multiline: true, scrolling: true});
			dialogWin.etMsg.maximumSize.height = 300;
			dialogWin.etMsg.minimumSize.width = 500;
						
			dialogWin.gControl = dialogWin.add("group");
			dialogWin.gControl.preferredSize.width = 500;
			dialogWin.gControl.alignChildren = ['right', 'center'];
			dialogWin.gControl.margins = 0;								
			dialogWin.gControl.btSave = null;
			dialogWin.gControl.btSave = dialogWin.gControl.add ("button", undefined, localize({en:"Save",de:"Speichern"}) + " " + type);
			dialogWin.gControl.btSave.onClick = function () {
				var texFile = File.saveDialog(localize({en:"Save information in text file ",de:"Speichern der Informationen in einer Textdatei"}), INNER.getFileFilter (".txt", localize({en:"Textfile ",de:"Textdatei"}))  );
				if (texFile) {
					if (! texFile.name.match (/\.txt$/)) {
						texFile = File(texFile.fullName + ".txt");
					}
					texFile.encoding = "UTF-8";
					texFile.open("e");
					texFile.writeln(msg);					
					texFile.close();
				}
			}
			dialogWin.gControl.add ("button", undefined, localize({en:"Cancel script",de:"Skript Abbrechen"}), {name: "cancel"});
			dialogWin.gControl.add ("button", undefined, "Ok", {name: "ok"});
			return dialogWin.show();
		}
	};

	INNER.getFileFilter = function (ext, type) {
		ext =ext.replace(/\*/g, "");
		if (File.fs == "Windows") {
			type =type.replace(/:/g, "");
			return type + ":*"+ ext;
		} 
		else {
			return function fileFilter (file) {
				 return (file.constructor.name === "Folder") ||  
				   (file.name.slice(-4) === ext) ||  
				   (file.alias);  
			}
		} 
	};


    /****************
    * API 
    */

    /**
    * Returns a log Object
    * @logFile {File|String} Path to logfile as File Object or String.
    * @logLevel {String} Log Threshold  "OFF", "ERROR", "WARN", "INFO", "DEBUG"
    * @disableAlerts {Boolean} Show alerts
    */
	SELF.getLogger = function(logFile, logLevel, disableAlerts) {
		if (logFile == undefined) {
			throw Error("Cannot instantiate Log without Logfile. Please provide a File");
		}
		if (logFile instanceof String) {
			logFile = File(logFile);
		}
		if (! (logFile instanceof File)) {
			throw Error("Cannot instantiate Log. Please provide a File");
		}
		if (logLevel == undefined) {
			logLevel = "INFO";			
		}
		if (disableAlerts == undefined) {
			disableAlerts = false;
		}

		INNER.logLevel = INNER.SEVERITY[logLevel];
		INNER.disableAlerts = disableAlerts;
	
		var counter = {
			debug:0,
			info:0,
			warn:0,
			error:0
		}
		var messages = {
			info:[],
			warn:[],
			error:[],
		}

		return {
			/**
			* Writes a debug log message
			* @message {String} message Message to log.
			*/
			writeln : function (message) {
				if (px && px.hasOwnProperty ("debug") && px.debug) {
					$.writeln(message);
				}
				if (INNER.logLevel == 0) {
					INNER.writeLog(message, "DEBUG", logFile);
					counter.debug++;
				}
			},			
			/**
			* Writes a debug log message
			* @message {String} message Message to log.
			*/
			debug : function (message) {
				if (INNER.logLevel == 0) {
					INNER.writeLog(message, "DEBUG", logFile);
					counter.debug++;
				}
			},
			/**
			* Writes a info log message
			* @message {String} message Message to log.
			*/
			info : function (message) {
				if (INNER.logLevel <= 1) {
					INNER.writeLog(message, "INFO", logFile); 
					counter.info++;
					messages.info.push(message);
				}
			},
			/**
			* Writes a info log message und displays an Alert-Window
			* @message {String} message Message to log.
			*/
			infoAlert : function (message) {
				if (INNER.logLevel <= 2) {
					INNER.writeLog(message, "INFO", logFile); 
					counter.info++;
					messages.info.push(message);
					INNER.showAlert ("[INFO]", message, localize({en:"informations", de:" der Informationen"}));
				}
			},
			/**
			* Writes a warn log message
			* @message {String} message Message to log.
			*/
			warn : function (message) {
				if (INNER.logLevel <= 2) {
					INNER.writeLog(message, "WARN", logFile);
					counter.warn++;
					messages.warn.push(message);
				} 
			},
			/**
			* Writes a warn log message und displays an Alert-Window
			* @message {String} message Message to log.
			*/
			warnAlert : function (message) {
				if (INNER.logLevel <= 2) {
					INNER.writeLog(message, "WARN", logFile); 
					counter.warn++;
					messages.warn.push(message);
					INNER.showAlert ("[WARN]", message + "\n\nPrüfen Sie auch das Logfile:\n" + logFile, localize({en:"warnings", de:"der Warnungen"}));
				}
			},
			/**
			* Writes a error log message
			* @message {String} message Message to log.
			*/
			error : function (message) {
				if (INNER.logLevel <= 3) {
					INNER.writeLog(message, "ERROR", logFile); 
					counter.error++;
					messages.error.push(message);
				}
			},

			/**
			* Shows all warnings
			*/
			showWarnings : function () {
				INNER.showMessages("Es gab " + counter.warn + " Warnmeldungen", messages.warn, localize({en:"warnings", de:"der Warnungen"}));
			},
			/**
			* Confirm all warnings
			*/
			confirmWarnings : function () {
				return INNER.confirmMessages("Es gab " + counter.warn + " Warnmeldungen", messages.warn, localize({en:"warnings", de:"der Warnungen"}));
			},
		
			/**
			* Returns all warnings
			*/
			getWarnings : function () {
				return messages.warn.join("\n");
			},
			/**
			* Shows all infos
			*/
			showInfos : function () {
				INNER.showMessages("Es gab " + counter.info + " Infos", messages.info, localize({en:"informations", de:" der Informationen"}));
			},
			/**
			* Returns all infos
			*/
			getInfos : function () {
				return messages.info.join("\n");
			},
			/**
			* Shows all errors
			*/
			showErrors : function () {
				INNER.showMessages("Es gab " + counter.error + " Fehler", messages.error, localize({en:"errors", de:"der Fehler"}));
			},
			/**
			* Returns all errors
			*/
			getErrors : function () {
				return messages.error.join("\n");
			},
			/**
			* Returns the counter Object
			*/
			getCounters : function () {
				return counter;
			},


			/**
			* Set silent Mode
			* @message {Boolean} true will not show alerts!
			*/
			disableAlerts : function (mode) {
				INNER.disableAlerts = mode;
			},

			/**
			* Clear Logfile and counters
			*/
			clearLog : function () {                
				logFile.open("w");
				logFile.write("");
				logFile.close();
				counter.debug = 0;
				counter.info = 0;
				counter.warn = 0;
				counter.error = 0;
				messages.info = [];
				messages.warn = [];
				messages.error = [];
			},

			/**
			* Shows the log file in the system editor
			*/
			showLog : function () {
				logFile.execute();
			}
		} 
	};
}) ( $.global, { toString : function() {return 'idsLog';} } );