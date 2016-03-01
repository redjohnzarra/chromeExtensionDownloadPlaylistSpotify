$(document).ready(function(){
    generateLogOverlay();
    startProcess();
});

function startProcess() {
    log("Current URL: " + window.location.href );

    if (window.location.href.indexOf("http://fildo.net") > -1) {
        checkIfPlaylistShown = setInterval(function(){
            if($("#tabs-1").is(":visible")){
                clearLog();
                clearInterval(checkIfPlaylistShown);
                getDownloadLinks();
            }else{
                log("Please select playlist to download.");
            }
        }, 3000);

    }
}

function generateLogOverlay(){
    overlayHtml = '<div id="bs_overlay_trigger" rel="#bs_overlay_content"></div>';
    overlayHtml += '<div id="bs_overlay_content" class="simple_overlay" style="background-color: white; border: 1px solid grey; z-index: 999; right:0; overflow-y:auto; overflow-x:hidden; padding:10px; height:200px; width:400px; font-size:14px"></div>';
    $("body").append(overlayHtml);

    $("#bs_overlay_trigger").overlay({
        load: true,
        closeOnClick: false,
        top: 0
    });
}

function log(message){
    dateTime = getDateTime();
    $("#bs_overlay_content").append("["+dateTime+"]: "+message+"<br/>");

    overlayDiv = document.getElementById("bs_overlay_content");
    overlayDiv.scrollTop = overlayDiv.scrollHeight;

    console.log(message);
}

function clearLog(){
    $("#bs_overlay_content").html('');
}

function getDateTime(){
    var currentdate = new Date();
    monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var datetime = currentdate.getDate() + "-"
                + monthNames[currentdate.getMonth()]  + "-"
                + currentdate.getFullYear() + " "
                +('0'+currentdate.getHours()).slice(-2) + ":"
                + ('0'+currentdate.getMinutes()).slice(-2);
                /* + ":"
                + currentdate.getSeconds();*/
    return datetime;
}

var songsArray = [];
function getDownloadLinks(){
    total = $("#tabs-1 > div.plDiv > div.resultBox.click").length;
    $("#tabs-1 > div.plDiv > div.resultBox.click").each(function(index, value){
        if(index === total - 1){
            saveSongs(0);
        }
        dloadLink = $(this).find("input[name='url']").val();
        audioName = $(this).find("input[name='audioName']").val();
        songData = {};
        songData['name'] = audioName;
        songData['link'] = dloadLink;
        songsArray.push(songData);
    });
}

function saveSongs(counter){
    log("Downloading: "+songsArray[counter]['name']+" Please wait. . .");
    $.ajax({
        type: "POST",
        url: "http://localhost/spotifyDloaderChromeExtension/index.php",
        data: {
            songs_data : JSON.stringify(songsArray[counter])
        }
    }).done(function(response){
        log("Done!");
        if(counter === songsArray.length - 1){
            log("Downloading complete!");
        }else{
            counter++;
            saveSongs(counter);
        }
    }).fail(function(response){
        log(response);
    });
}
