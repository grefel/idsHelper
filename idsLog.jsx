/****************
* Logging Class 
* @Version: 0.9
* @Date: 2016-03-29
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
	INNER.version = "2016-03-29--0.9"
	INNER.disableAlerts = false;
	INNER.SEVERITY = [];
	INNER.SEVERITY["OFF"] = 4;
	INNER.SEVERITY["ERROR"] = 3;
	INNER.SEVERITY["WARN"] = 2;
	INNER.SEVERITY["INFO"] = 1;
	INNER.SEVERITY["DEBUG"] = 0;

	INNER.writeLog = function(msg, severity, file) { 
		file.encoding = "UTF-8";
		file.open("a");
		var stack = $.stack.split("\n");
		stack = stack[stack.length - 4];		
		file.writeln(Date() + " [" + severity + "] " + ((severity.length == 4) ? " [" : "[") + msg + "] Function: " + stack);		
		file.close();
	};
	INNER.showAlert = function(msg){
		if (!INNER.disableAlerts) {
			alert(msg) 
		}
	};
	INNER.showMessages = function(msg) { 
		if (!INNER.disableAlerts) {
			alert(msg) 
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
		logLevel = (logLevel == undefined) ? 0 : INNER.SEVERITY[logLevel];

		if (disableAlerts == undefined) {
			INNER.disableAlerts = false;
		}

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
			debug : function (message) {
				if (logLevel <= 0) {
					INNER.writeLog(message, "DEBUG", logFile);
					counter.debug++;
				}
			},
			/**
			* Writes a info log message
			* @message {String} message Message to log.
			*/
			info : function (message) {
				if (logLevel <= 1) {
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
				if (logLevel <= 2) {
					INNER.writeLog(message, "INFO", logFile); 
					counter.info++;
					messages.info.push(message);
					INNER.showAlert ("[INFO]\n" + message);
				}
			},
			/**
			* Writes a warn log message
			* @message {String} message Message to log.
			*/
			warn : function (message) {
				if (logLevel <= 2) {
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
				if (logLevel <= 2) {
					INNER.writeLog(message, "WARN", logFile); 
					counter.warn++;
					messages.warn.push(message);
					INNER.showAlert ("PROBLEM [WARN]\n" + message + "\n\nThere might be more information in the logfile:\n" + logFile);
				}
			},
			/**
			* Writes a error log message
			* @message {String} message Message to log.
			*/
			error : function (message) {
				if (logLevel <= 3) {
					INNER.writeLog(message, "ERROR", logFile); 
					counter.error++;
					messages.error.push(message);
				}
			},


            /**
            * Shows all warnings
            */
			showWarnings : function () {
				INNER.showMessages("Es gab " + counter.warn + " Warnmeldungen\n\n" + messages.warn.join("\n"));
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
                INNER.showMessages("Es gab " + counter.info + " Infos\n\n" + messages.info.join("\n"));
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
                INNER.showMessages("Es gab " + counter.error + " Warnmeldungen\n\n" + messages.error.join("\n"));
            },
            /**
            * Returns all errors
            */
            getErrors : function () {
                return messages.error.join("\n");
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