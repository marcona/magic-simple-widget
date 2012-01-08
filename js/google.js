var GoogleSearchURL;
var L_GoogleSearchTxt_jaES = "";
var L_GoogleSearchURL_jaES = "&cof=FORID%3A1%3BGL%3A1%3BLBGC%3A336699%3BLC%3A%230000ff%3BVLC%3A%23663399%3BGFNT%3A%230000ff%3BGIMP%3A%230000ff%3BDIV%3A%23336699%3B&client=pub-7219711649035077&channel=7046704419";
var refURL                  = "";

var shell = new ActiveXObject('WScript.Shell');	

//Global
var g_applicationList = new Array();
var g_currentFeedPath = "";
var g_currentFeedUrl = "";

// Settings
var L_TITLEFORDROP_TEXT = "url dans magic";
var L_ARTICLES_TEXT = new Array();


function loadMain() {
    System.Gadget.onUndock = checkState;
    System.Gadget.onDock = checkState;
}

function launchSearch()
{
//        var userInput = document.getElementById("srchBox").value;
//        var processedString = encodeURIComponent(userInput);
//		var sServer ="http://www.google.com";
//    	var url = sServer +"/custom?hl=en&ie=UTF-8&oe=UTF-8&q=" + processedString + GoogleSearchURL;
		var url = "http://wr-magic:25738/download/SAM/PRODUCTION/CLIENT-ADMIN/sam-admin-gui.jnlp";
    	//window.open(url);
		shell.Run(url);
}

function cksearchText(o)
{
    if (o.value == "")
    {
        searchText.style.display = "";
    }
    else
    {
        searchText.style.display = "none";
    }
}

function doSearchOnEnter()
{
    if (window.event.keyCode== 13)
    {
        launchSearch();
    }
}

function procSettingsClosedEvent(event)
{
   if (event.closeAction == event.Action.commit) {
       loadMain();
   }
}

function checkState()
{
    if(!System.Gadget.docked) 
    {
        undockedState();
    } 
    else if (System.Gadget.docked)
    {
        dockedState(); 
    }
}

function undockedState()
{

    with(document.body.style)
        width=260;
	with(slideshowBg.style)
        width=260;
	with(button.style)
		left=230;
	
	slideshowBg.src="url(images/background2.png)";

}
////////////////////////////////////////////////////////////////////////////////
//
// styles for gadget when DOCKED
// 
////////////////////////////////////////////////////////////////////////////////
function dockedState()
{   
    with(document.body.style)
        width=130;
	with(slideshowBg.style)
        width=130;
	with(button.style)
		left=107;
     
	slideshowBg.src="url(images/background.png)";
}
 ////////////////////////////////////////////////////////////////////////////////
//
// GEstion des settings
//
////////////////////////////////////////////////////////////////////////////////

function loadSettings() {
    var tempSettings = new getRssSettings();
    g_currentFeedPath = tempSettings.rssFeedPath;
    g_currentFeedUrl = tempSettings.rssFeedUrl;
}

////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
function createFeedDropDown() {
    AddFeedToDropDown(L_TITLEFORDROP_TEXT, "defaultGadget");
    AddFeedToDropDown("Magic", 'http://mini-marco/applications_sample.xml');
}
////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
function AddFeedToDropDown(_feedText, _feedValue) {
    var tempChckSettings = new getRssSettings();
    var objEntry = document.createElement("option");
    objEntry.text = _feedText;
    objEntry.value = _feedValue;
    objEntry.title = _feedText;
    if (_feedText == tempChckSettings.rssFeedPath) {
        objEntry.selected = true;
    }
    rssFeedSelection.add(objEntry);
}


