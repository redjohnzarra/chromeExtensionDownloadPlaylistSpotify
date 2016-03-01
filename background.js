chrome.runtime.onStartup.addListener(function(){
    checkStatus();
});

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    chrome.browserAction.getTitle({tabId: tabId}, function(title){
        if(title.indexOf("On") > -1){
            var currURL = tab.url;
            if(currURL.indexOf("fildo.net") > -1){
                chrome.tabs.executeScript(null, { file: "jquery.min.js" }, function() {
                    chrome.tabs.executeScript(null, { file: "jquery.tools.min.js" }, function() {
                        //load config script
                        chrome.tabs.executeScript(null, { file: "config.js" }, function(){
                            if (changeInfo.status == 'complete') {
                                    console.log("Spotify Downloader")
                                    chrome.tabs.executeScript(null,{file:"spotify_downloader.js"});
                            }
                        });
                    });
                });
            }
        }
    });
});

chrome.browserAction.onClicked.addListener(function(tab){
    checkStatus();
    /*chrome.browserAction.getTitle({tabId: tab.id}, function(title){
        if(title.indexOf("On") > -1){
            chrome.browserAction.setTitle({title: "Email Checker Off"});
            chrome.browserAction.setIcon({path:'images/icon-off.png'});
        }else{
            chrome.browserAction.setTitle({title: "Email Checker On"});
            chrome.browserAction.setIcon({path:'images/icon-on.png'});
        }
    });*/
});

function checkStatus(){
    chrome.storage.sync.get({
        spotDl: 'on',
    }, function(items) {
        if(items.spotDl == "on"){
            alert("Spotify Downloader Stopped!");
            saveOptions("off");
            chrome.browserAction.setTitle({title: "Spotify Downloader Off"});
            chrome.browserAction.setIcon({path:'images/icon-off.png'});
            chrome.tabs.reload();
        }else{
            alert("Spotify Downloader Started!");
            saveOptions("on");
            chrome.browserAction.setTitle({title: "Spotify Downloader On"});
            chrome.browserAction.setIcon({path:'images/icon-on.png'});
            chrome.tabs.reload();
        }
    });
}

function saveOptions(currStatus) {
  chrome.storage.sync.set({
    spotDl: currStatus
  });
}


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
        if(request.clearCookies == "Yes"){
            async.series([
                function(callback){
                    // var millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
                    // var oneWeekAgo = (new Date()).getTime() - millisecondsPerWeek;
                    var millisecondsHour = 60 * 60 * 1000;
                    var oneHourAgo = (new Date()).getTime() - millisecondsHour;
                    chrome.browsingData.remove({
                      "since": oneHourAgo,
                      "originTypes": {
                        "protectedWeb": true, // Set to true or true as per your requirement
                        "unprotectedWeb":true,// Set to true or true as per your requirement
                        "extension":true    // Set to true or true as per your requirement
                      }
                    }, {
                      "appcache": true, // Set to true or true as per your requirement
                      "cache": true, // Set to true or true as per your requirement
                      "cookies": true, // Set to true or true as per your requirement
                      "downloads": true, // Set to true or true as per your requirement
                      "fileSystems": true, // Set to true or true as per your requirement
                      "formData": true, // Set to true or true as per your requirement
                      "history": true, // Set to true or true as per your requirement
                      "indexedDB": true, // Set to true or true as per your requirement
                      "localStorage": true, // Set to true or true as per your requirement
                      "pluginData": true, // Set to true or true as per your requirement
                      "passwords": true, // Set to true or true as per your requirement
                      "webSQL": true // Set to true or true as per your requirement
                    }, function (){
                        console.log("All data is Deleted...");
                        callback(null);
                    });
                },
                function(callback){
                    setTimeout(function(){
                        sendResponse({clearCookies: "Done"});
                        callback(null);
                    },1000);
                }
            ]);

            return true;

        }

        /*if (request && request.type == 'captcha') {
            gotMessage(request, sender, sendResponse);

            return true;
        }*/
    }
);



