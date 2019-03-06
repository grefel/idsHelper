
function getPageNameFromObject(object) {
	var errorMsg = "";
	if (object != null) {
		object = object.getElements()[0]; // Get Object from Superclass like PageItem
		if (object.hasOwnProperty("baseline")) {
			if (object.parentTextFrames.length == 0) {
				object = object.parentStory.textContainers[object.parentStory.textContainers.length - 1];
				errorMsg += "Im Übersatz letzter Textrahmen ";
			}
			else {
				object = object.parentTextFrames[0];
			}
		}
		while (object != null) {
			if (object.hasOwnProperty("parentPage")) {
				if (object.parentPage == null && object.parent instanceof Spread) {
					errorMsg += " Druckbogen ";
					return errorMsg + (object.parent.index + 1);
				}
				else if (object.parentPage == null) {
					object = object.parent;
					continue;
				}
				else {
					return object.parentPage.name;
				}
			}
			var whatIsIt = object.constructor;
			switch (whatIsIt) {
				case Page: return errorMsg + object.name;
				case Character: object = object.parentTextFrames[0]; break;
				case Footnote: ; // drop through
				case Cell: object = object.insertionPoints[0].parentTextFrames[0]; break;
				case Note: object = object.storyOffset.parentTextFrames[0]; break;
				case XMLElement:
					if (object.pageItems.length > 0) {
						object = object.pageItems[0];
					}
					else if (object.insertionPoints[0] != null) {
						if (object.insertionPoints[0].parentTextFrames.length > 0) {
							object = object.insertionPoints[0].parentTextFrames[0];
						}
						else {
							return errorMsg + "Konnte Seite nicht ermitteln";
						}
					}
					break;
				case Application: return errorMsg + "Konnte Seite nicht ermitteln Application";
				default: object = object.parent;
			}
			if (object == null) return errorMsg + "Konnte Seite nicht ermitteln";
		}
		return errorMsg + object;
	}
	else {
		return errorMsg + "Konnte Seite nicht ermitteln";
	}
}