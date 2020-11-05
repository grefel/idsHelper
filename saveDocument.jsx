//DESCRIPTION:Fix InDesign CC 2021 Bug while saving old documents. 
//Contact: Gregor Fellenz - http://www.publishingx.de

if (app.documents.length > 0 && app.activeDocument.modified == true) { 
    try {
        var dok = app.activeDocument;
        var path = dok.filePath;
        var saveFile = File (path + "/" + dok.name);
        dok.save(saveFile);    
    }
    catch(e) {
        if (e.number == 90937) {
            // never saved, no filePath -> User selects
            dok.save();
        }    
        else {
            alert(e);
        }
    }
} 
