var Printer = require('node-printer'); 
var fs = require('fs');
// Get available printers 
list var listPrinter = Printer.list();
// Create a new Pinter from available devices 
var printer = new Printer('YOUR PRINTER HERE. GET IT FROM listPrinter');
// Print from a buffer, file path or text 
var fileBuffer = fs.readFileSync('PATH TO YOUR IMAGE');
var jobFromBuffer = printer.printBuffer(fileBuffer);
// Listen events from job 
jobFromBuffer.once('sent', function () {
    jobFromBuffer.on('completed', function () {
        console.log('Job ' + jobFromBuffer.identifier + 'has been printed'); jobFromBuffer.removeAllListeners();
    });
}); 