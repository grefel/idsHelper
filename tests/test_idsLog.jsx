#include ../idsTest.jsx
#include ../idsLog.jsx


// Tests for idsLog.jsx 
var logFile =  File ("~/Desktop/testLog.txt");

main();
test();

idsTesting.htmlReport();


function main () {
	log = null;
	idsTesting.logToConsole(false);
	idsTesting.insertBlock("Tests for idsLog.jsx");  
	var errorThrown = false;
	try {
		log = idsLog.getLogger();
	}
	catch (e) {
		idsTesting.assertString("Logger needs a File or String to instantiate.", "Cannot instantiate Log without Logfile. Please provide a File", e.message);  
		errorThrown = true;
	}
	idsTesting.assertEquals("Logger throws an Error when Constructor is called without arguments.", true, errorThrown);  
	
	log = idsLog.getLogger(logFile, "INFO");
	log.disableAlerts(true);
	idsTesting.assertEquals("Logger instantiates.", true, log != null);  		
}

function test() {
	test2();
}

function test2() {
    log.warn("test warn 1");
	
	idsTesting.assertEquals("Log File exists", true, logFile.exists); 
	idsTesting.assertRegExInFile("String [test warn 1] is written", /test warn 1/, logFile);

    log.clearLog();
	idsTesting.assertStringNotInFile("String [test warn 1] is cleared", /test warn 1/, logFile);
	
    log.warnAlert("test warn new first");   
    log.warnAlert("test warn new second");
	idsTesting.assertRegExInFile("String [test warn new first] is written", /test warn new first/, logFile);
	
	idsTesting.assertEquals("Has 2 warnings", true, log.getCounters().warn == 2);	
	
//~     $.writeln("log.warnings: " + log.getWarnings());
	log.disableAlerts(true);
 	log.showWarnings();
//~     log.showLog();
}









