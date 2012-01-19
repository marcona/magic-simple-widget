var GoogleSearchURL;
var L_GoogleSearchTxt_jaES = "";
var L_GoogleSearchURL_jaES = "&cof=FORID%3A1%3BGL%3A1%3BLBGC%3A336699%3BLC%3A%230000ff%3BVLC%3A%23663399%3BGFNT%3A%230000ff%3BGIMP%3A%230000ff%3BDIV%3A%23336699%3B&client=pub-7219711649035077&channel=7046704419";
var refURL = "";

var shell = new ActiveXObject('WScript.Shell');

//Global
var g_applicationList = new Array();
var g_currentFeedPath = "";
var g_currentFeedUrl = "";
var urlPrefix = "http://wr-magic:25738";

// Settings
var L_TITLEFORDROP_TEXT = "url dans magic";
var L_ARTICLES_TEXT = new Array(10);

//FLyout
var g_feedClicked;
var g_feedURL;
var g_lastClickedUrl;

function loadMain() {
    System.Gadget.onUndock = checkState;
    System.Gadget.onDock = checkState;
    loadSettings();
    window.prompt("g_currentFeedUrl", g_currentFeedUrl);
    g_currentFeedUrl = "http://192.168.1.81/applications_sample.xml";
//    g_currentFeedUrl
//          = urlPrefix + "/administration.html?wicket:interface=:19:downloadPanel:link::ILinkListener::";

    buildApplicationList();
    updateHtml();

    System.Gadget.onShowSettings = loadSettings;

    System.Gadget.Flyout.file = "flyout.html";

    document.body.focus();



}


function keyNavigateClose() {
    switch (event.keyCode) {
        case 27:
            hideFlyout();
            break;
    }
}

function launchSearch() {
    var url = "http://wr-magic:25738/download/SAM/PRODUCTION/CLIENT-ADMIN/sam-admin-gui.jnlp";
    //window.open(url);
    shell.Run(url);
}

function cksearchText(o) {
    if (o.value == "") {
        searchText.style.display = "";
    }
    else {
        searchText.style.display = "none";
    }
}

function doSearchOnEnter() {
    if (window.event.keyCode == 13) {
        launchSearch();
    }
}

function procSettingsClosedEvent(event) {
    if (event.closeAction == event.Action.commit) {
        loadMain();
    }
}

function checkState() {
    if (!System.Gadget.docked) {
        undockedState();
    }
    else if (System.Gadget.docked) {
        dockedState();
    }
}

function undockedState() {

    with (document.body.style)
        width = 260;
    with (slideshowBg.style)
        width = 260;
    slideshowBg.src = "url(images/background2.png)";

}
////////////////////////////////////////////////////////////////////////////////
//
// styles for gadget when DOCKED
// 
////////////////////////////////////////////////////////////////////////////////
function dockedState() {
    with (document.body.style)
        width = 130;
    with (slideshowBg.style)
        width = 130;
    slideshowBg.src = "url(images/background.png)";
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
//    AddFeedToDropDown(L_TITLEFORDROP_TEXT, "defaultGadget");
    AddFeedToDropDown("Magic-miniMac", 'http://192.168.1.81/applications_sample.xml');
    AddFeedToDropDown("Magic-Allianz",
                      'http://wr-magic:25738/administration.html?wicket:interface=:19:downloadPanel:link::ILinkListener::');
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

////////////////////////////////////////////////////////////////////////////////
//
// MAGIC FUNCTIONS
//
////////////////////////////////////////////////////////////////////////////////

function buildApplicationList() {
    rssObj = new ActiveXObject("Msxml2.XMLHTTP");
    rssObj.open("GET",
                g_currentFeedUrl,
                true);
    rssObj.onreadystatechange = function() {
        if (rssObj.readyState === 4) {
            if (rssObj.status === 200) {
                rssXML = rssObj.responseXML;
                parseApplicationList();
                if (chkConn) {
                    clearInterval(chkConn);
                }
            }
            else {
                var chkConn;
                chkConn = setInterval(buildApplicationList, 30 * 60000);
            }
        }
    }
    rssObj.send(null);
}

function parseApplicationList() {
    rssItems = rssXML.getElementsByTagName("application");
    rssTitle = null;
    rssAuthors = null;
    rssSummary = null;
    rssLink = null;
    str = "<!-";
    for (i = 0; i < rssItems.length; i++) {
        try {
            tmpApplication = new Object();
            if (!(rssItems[i].firstChild.text.match("^" + str) == str)) {
                rssTitle = rssItems[i].firstChild.text;
                rssDisplayName = rssItems[i].getElementsByTagName("displayName");
                tmpApplication.displayName = rssDisplayName[0].text;

                leaderName = rssItems[i].getElementsByTagName("leaderName");
                tmpApplication.leaderName = leaderName[0].text;

                rssSummary = rssItems[i].getElementsByTagName("description");
                tmpApplication.description = rssSummary[0].text;

                logoUrl = rssItems[i].getElementsByTagName("logoUrl");
                tmpApplication.logoUrl = urlPrefix + '/' + logoUrl[0].text;

                tmpApplication.launchUrl="http://google.fr";
                launchUrl = rssItems[i].getElementsByTagName("launchUrl");
                if (launchUrl!=null){
                    tmpApplication.launchUrl = urlPrefix + '/' + launchUrl[0].text;
                }

                g_applicationList[i] = tmpApplication;
            }
        }
        catch (err) {

        }
    }
    //window.prompt("g_applicationList", g_applicationList.length);

}

function updateHtml() {
    vInnerHtml = "";
    //TODO  remplacer 4 par g_applicationList.length
    for (var i = 0; i < 4; i++) {
    if (g_applicationList[i]!=null){
        imgInnerHtml = "<a title=\"Lancer l'application\" href=\"" + g_applicationList[i].launchUrl + "\">"
                             + "<img class='logo' alt=logo src=\"" + g_applicationList[i].logoUrl + "\">"
              + "</a>"

        vInnerHtml = vInnerHtml + "<div id='application_" + i + "' class='applicationPanel'>"
                           + imgInnerHtml
                           + "<br><a id='application_label_" + i + "' href='" + g_applicationList[i].launchUrl + "'>"
                           + g_applicationList[i].displayName + "</a>"
                           + "<br><a id='applicationDetail_" + i + "' href='' ondblClick='showFlyout(this,"+i+");selectBack(this.parentElement);return false;' onClick='showFlyout(this,"+i+");selectBack(this.parentElement);return false;' onmouseover='toggleBack(this.parentElement, true);' onmouseout='toggleBack(this.parentElement, false);'>Detail</a>"

              + "</div>"
    }
    }
    applicationList.innerHTML = vInnerHtml;
}

////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
function toggleBack(objToChange, showBack) {
    if (objToChange.innerText != g_feedClicked) {
        if (!System.Gadget.docked) {
            var backgroundToLoad = "url(images/item_hover_floating.png)";
        }
        else if (System.Gadget.docked) {
            var backgroundToLoad = "url(images/item_hover_docked.png)";
        }
        if (showBack) {
            eval("objToChange").style.backgroundImage = backgroundToLoad;
        }
        else {
            eval("objToChange").style.backgroundImage = "";
        }
    }
}
////////////////////////////////////////////////////////////////////////////////
//
// set/swap background image when clicked/dblclicked
//
////////////////////////////////////////////////////////////////////////////////
function selectBack(objToChange) {
    g_feedClicked = objToChange.innerText;
//    clearBack();
}
////////////////////////////////////////////////////////////////////////////////
//
// clear background image's and set selected article with image
//
////////////////////////////////////////////////////////////////////////////////
function clearBack() {
//    for (var i = 0; i < 4; i++) {
//        if (eval("FeedItem" + i).innerText == g_feedClicked) {
//            setSelectBack(eval("FeedItem" + i));
//        }
//        else {
//            eval("FeedItem" + i).style.backgroundImage = "";
//        }
//    }
}
function showFlyout(feedAll, cpt) {
    var tmpApplication= g_applicationList[cpt];

    if (event.type == "click") {
        if (g_feedURL == g_lastClickedUrl) {
            System.Gadget.Flyout.show = false;
            g_lastClickedUrl = "";
        }
        if (System.Gadget.Flyout.show) {
            addContentToFlyout(tmpApplication);
            g_lastClickedUrl = feedAll.href;
        }
        else {
            System.Gadget.Flyout.show = true;
            System.Gadget.Flyout.onShow = function() {
                addContentToFlyout(tmpApplication);
            }
            System.Gadget.Flyout.onHide = function() {
                g_feedClicked = null;
                clearBack();
            }
            g_lastClickedUrl = feedAll.href;
        }

    }
}

////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
function addContentToFlyout(tmpApplication) {
    try {
        if (System.Gadget.Flyout.show) {
            var flyoutDiv = System.Gadget.Flyout.document;
            try {
                flyoutDiv.getElementById("flyoutTitleLink").innerText = tmpApplication.displayName;
                flyoutDiv.getElementById("flyoutTitleLink").href = "http://google.fr";
                flyoutDiv.getElementById("flyoutTitleLink").setAttribute("title", tmpApplication.displayName);
                flyoutDiv.getElementById("flyoutTitleLink").style.textOverflow = "ellipsis";
                flyoutDiv.getElementById("flyoutTitleLink").style.overflow = "hidden";
                flyoutDiv.getElementById("flyoutTitleLink").style.whiteSpace = "nowrap";

                flyoutDiv.getElementById("readOnlineLink").href = "http://google.fr";

                flyoutDiv.getElementById("flyoutMainFeedDescription").innerHTML = tmpApplication.description;
            }
            catch(e) {
            }
        }
    }
    catch(e) {
        //catch slow flyout - no div object will be available.
    }
}
////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
function hideFlyout() {
    System.Gadget.Flyout.show = false;
}