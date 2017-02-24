

function removeFolder(folder) {
	var result = folder.getFiles();
	for (var i = result.length -1; i >= 0; i--) {		
		var fileOrFolder = result[i];
		if (fileOrFolder.exists)  {
			if (fileOrFolder.constructor.name == "Folder")  removeFolder(fileOrFolder);
			else fileOrFolder.remove();
		}
	}
	folder.remove();	
}

