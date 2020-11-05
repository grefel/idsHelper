# idsHelper

Adobe InDesign Scripting Helper Utilities
Originally developed for the book [InDesign automatisieren](http://www.indesignjs.de/auflage2/).

----

Die Skripting-Bibliothek *idsHelper.jsx* enthält zwei Klassen und ein Logging-Framework, die hilfreiche Methoden für die Entwicklung von Skripten in Adobe InDesign zur Verfügung stellen.
Wenn Sie die Bibliothek verwenden möchten, müssen Sie diese über `#include` in Ihre Skripte einbinden.

## Skripting Helferlein idsTools

```javascript
#include idsHelper.jsx
idsTools.checkOverflow(app.activeDocument.stories[0]);
```

Über `#include` können beliebige Skriptdateien eingebunden werden. Hier muss die Datei *idsHelper.jsx* im gleichen Verzeichnis wie die Skriptdatei liegen, es können auch relative Pfade angegeben werden.
Die Bibliothek enthält die Klassen `idsTools` und `idsMap`. Über `idsTools` kann man wie in Zeile 2 auf die Methoden der Klasse zugreifen.
Im Folgenden erkläre ich die wichtigsten Methoden der Bibliothek.

#### Methoden aus idsTools

In der Klasse `idsTools` sind die Methoden aus Kapitel 11 und einige weitere Helferlein gesammelt.

###### getPageByObject() und getSpreadByObject()

Mit `getPageByObject(objekt)` kann man die Seite ermitteln, auf der sich das im Parameter übergebene Objekt befindet, mit `getSpreadByObject(objekt)` entsprechend den Druckbogen.

###### fitTextFrame()

Mehrspaltige Textrahmen mit Textüberlauf können nicht mit der Methode `fit()` angepasst werden. Die Methode `fitTextFrame(tf, step)` vergrößert den im ersten Parameter übergebenen Textrahmen so lange, bis er keinen Textüberlauf mehr aufweist. Als zweiter Parameter wird die Schrittweite, mit der der Textrahmen vergrößert werden soll, übergeben.

###### nextParagraph() und nextChar()

Bei längeren Textabschnitten sollten die Methoden `previousItem()` und `nextItem()` von `Text`-Objekten vermieden werden. Schneller arbeiten Sie mit den Methoden `nextParagraph(par)` bzw. `nextChar(char)`, denen das Zeichen bzw. der Absatz als Parameter übergeben werden muss.

###### arraySortDE()

Die Methode `arraySortDE()` kann der Array-Methode `sort()` als Parameter übergeben werden: `array.sort(arraySortDE)`. Mit ihrer Hilfe wird die Sortierung unter Berücksichtigung deutscher Umlaute durchgeführt.

###### readTextFile() und writeTextFile()

Die Methoden `readTextFile(file)` und `writeTextFile(file, string)` helfen beim Einlesen bzw. Erstellen von Textdateien. Der Methode `readTextFile(file)` muss ein `File`-Objekt als Parameter übergeben werden, sie liefert den Inhalt als String zurück. Der Methode `writeTextFile(file, string)` muss ein `File`-Objekt und der String, der in die Textdatei geschrieben werden soll, übergeben werden.

## Assoziatives Array in idsMap

Eine *Map* oder ein *Assoziatives Array* ist eine Art Array, mit dem man über einen Namen bzw. Schlüssel auf einzelne Werte zugreifen kann. Das folgende Listing zeigt das Vorgehen:

```javascript
#include "idsHelper.jsx"
var map = idsMap();
map.pushItem("key1","Ein Wert");
map.pushItem("key2","Ein anderer Wert");
alert("Es sind " + map.length + " Werte gespeichert.");
alert("Bei [Key1] ist der Wert " + map.getItem("key1"));
alert("Schlüssel [key2] ist enthalten " + map.hasItem("key2"));
map.removeItem("key2");
```

#### Methoden und Eigenschaften von idsMap

Mit dem Aufruf `idsMap()` wird eine neues Objekt erstellt. Mit der Methode `pushItem()` kann ein neuer Eintrag erstellt werden. Im ersten Parameter wird der Schlüssel, im zweiten der Wert übergeben. In der Eigenschaft `length` ist die Anzahl der Elemente enthalten. Mit der Methode `getItem()` kann ein Wert anhand seines Schlüssels abgerufen werden. Mit `hasItem()` kann geprüft werden, ob ein Eintrag für den im Parameter übergebenen Schlüssel existiert. Mit der Methode `removeItem()` wird ein Eintrag anhand eines Schlüssels gelöscht.
