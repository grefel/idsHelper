/****************
* Logging Class 
* @Version: 1.07
* @Date: 2018-10-10
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
	INNER.version = "2018-09-26-1.06";
	INNER.disableAlerts = false;
	INNER.logLevel = 0;
	INNER.SEVERITY = [];
	INNER.SEVERITY["OFF"] = 4;
	INNER.SEVERITY["ERROR"] = 3;
	INNER.SEVERITY["WARN"] = 2;
	INNER.SEVERITY["INFO"] = 1;
	INNER.SEVERITY["DEBUG"] = 0;
	
	INNER.processMsg = function(msg) {
		if (msg == undefined) {
			msg = ""; // return ?
		}
		if (( msg instanceof Error) ) {
			msg =  msg + " Line: " + msg.line + " # " + msg.number + " File: " + msg.fileName;
		}
		if (msg.constructor.name != String) {
			msg = msg.toString();
		}	
		return msg;
	}

	INNER.writeLog = function(msg, severity, file) { 
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
			for (var i = 0; i < msgArray.length; i++) {
				if (msgArray[i] == undefined) {
					msg = ""; // return ?
				}
				if (msgArray[i] instanceof Error) {
					msgArray[i] =  msgArray[i] + " -> " + msgArray[i].line
				}
				if (msgArray[i].constructor.name != String) {
					msgArray[i] = msgArray[i].toString();
				}
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
				var texFile = File.saveDialog(localize({en:"Save information in text file ",de:"Speichern der Informationen in einer Textdatei"}), INNER.getFileFilter (localize({en:"Textfile ",de:"Textdatei"}) + ":*.txt")  );
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

	INNER.confirm = function (message, noAsDefault, title) {
		return confirm(message, noAsDefault, title);
	} 

	INNER.getFileFilter = function (fileFilter) {
		if (fileFilter == undefined || File.fs == "Windows") {
			return fileFilter;
		}
		else {
			// Mac
			var extArray = fileFilter.split(":")[1].split(";");
			return function fileFilter (file) {
				if (file.constructor.name === "Folder") return true;
				if (file.alias) return true;
				for (var e = 0; e < extArray.length; e++) {
					var ext = extArray[e];
					ext = ext.replace(/\*/g, "");
					if (file.name.slice(ext.length*-1) === ext) return true;
				}
			}		
		}
	};

	INNER.msToTime = function(microseconds) {
		var milliseconds = microseconds / 1000;
		var ms = parseInt((milliseconds%1000)/100)
		//Get hours from milliseconds
		var hours = milliseconds / (1000*60*60);
		var absoluteHours = Math.floor(hours);
		var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;

		//Get remainder from hours and convert to minutes
		var minutes = (hours - absoluteHours) * 60;
		var absoluteMinutes = Math.floor(minutes);
		var m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;

		//Get remainder from minutes and convert to seconds
		var seconds = (minutes - absoluteMinutes) * 60;
		var absoluteSeconds = Math.floor(seconds);
		var s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;


		return h + ':' + m + ':' + s + "." + ms;
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
		$.hiresTimer;
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
			error:[]
		}

		return {
			/**
			* Writes a debug log message
			* @message {String} message Message to log.
			*/
			writeln : function (message) {
				message = INNER.processMsg(message);
				if (typeof px != "undefined" && px.hasOwnProperty ("debug") && px.debug) {
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
				message = INNER.processMsg(message);
				if (INNER.logLevel == 0) {
					INNER.writeLog(message, "DEBUG", logFile);
					counter.debug++;
				}
			},
			/**
			* Writes an info log message
			* @message {String} message Message to log.
			*/
			info : function (message) {
				message = INNER.processMsg(message);
				if (INNER.logLevel <= 1) {
					INNER.writeLog(message, "INFO", logFile); 
					counter.info++;
					messages.info.push(message);
				}
			},
			/**
			* Writes an info log message und displays an Alert-Window
			* @message {String} message Message to log.
			*/
			infoAlert : function (message) {
				message = INNER.processMsg(message);
				if (INNER.logLevel <= 2) {
					INNER.writeLog(message, "INFO", logFile); 
					counter.info++;
					messages.info.push(message);
					INNER.showAlert ("[INFO]", message, localize({en:"informations", de:" der Informationen"}));
				}
			},
			/**
			* Writes an info message and adds the message to the warn array
				useful to add information to the warning messages without incrementing the warn counter.
				e.g. put information about file name while processing different documents.
			* @message {String} message Message to log.
			*/
			warnInfo : function (message) {
				message = INNER.processMsg(message);
				if (INNER.logLevel <= 1) {
					INNER.writeLog(message, "INFO", logFile);
					counter.info++;
					messages.info.push(message);
				}
				if (INNER.logLevel <= 2) {
					messages.warn.push(message);
				}
			},
			/**
			* Writes a warn log message
			* @message {String} message Message to log.
			*/
			warn : function (message) {
				message = INNER.processMsg(message);
				if (typeof px != "undefined" && px.hasOwnProperty ("debug") && px.debug) {
					$.writeln("WARN: \n" + message);
				}				
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
				message = INNER.processMsg(message);
				if (typeof px != "undefined" && px.hasOwnProperty ("debug") && px.debug) {
					$.writeln("WARN: \n" + message);
				}				
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
				message = INNER.processMsg(message);
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
				var message = "confirmWarnings: Es gab " + counter.warn + " Warnmeldungen"
				INNER.writeLog(message, "INFO", logFile); 

				var res = INNER.confirmMessages(message, messages.warn, localize({en:"warnings", de:"der Warnungen"}));
				INNER.writeLog("User interaction: " + res, "INFO", logFile); 
				return res;				
			},
			
			/* Confirm a warning */
			confirm : function (message, noAsDefault, title) {
				message = INNER.processMsg(message);
				if (title == undefined) {
					title = "";
				}
				INNER.writeLog("log: " + message, "INFO", logFile); 
				var res = INNER.confirm(message, noAsDefault, title);
				INNER.writeLog("User interaction: " + res, "INFO", logFile); 
				return res;
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
			* Reset Message and counters - use showWarning before !
			*/
			resetCounterAndMessages : function () {                
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
			},
			/**
			* Prints elapsed time since and resets Timer 
			*/
			elapsedTime : function () {			
				var message = "Elapsed time: " + INNER.msToTime($.hiresTimer);
				INNER.writeLog( message, "INFO", logFile); 
				counter.info++;
				messages.info.push(message);			
			},
			/**
			* reset the elapsed Time Timer
			*/
			resetTimer : function () {
				$.hiresTimer;
			},
			/**
			* Returns elapsed time without writing to log or resetting
			*/
			getElapsedTime : function () {			
				return INNER.msToTime($.hiresTimer);
			},
			/**
			* Returns the current log Folder path
			*/
			getLogFolder : function () {
				return logFile.parent;
			}		
		} 
	};
}) ( $.global, { toString : function() {return 'idsLog';} } );
