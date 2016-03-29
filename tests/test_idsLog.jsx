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
	log.isSilent(true);
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
	
    log.warnAlert("test warn 2");
	idsTesting.assertRegExInFile("String [test warn 2] is written", /test warn 2/, logFile);
//~     $.writeln("log.warnings: " + log.getWarnings());
//~ 	log.showWarnings();
//~     log.showLog();
}









