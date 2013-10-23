var tutorialManager = (function($){

    var gestureDes = {
        "CIRCLE":"Circling with ",
        "SWIPE":"Swipe ",
        "KEYTAB":"Keytab detected",
    }

    var displayGesture = function(key,submsg){
        $(".tips span").css("color","rgb(194, 223, 156)").html(gestureDes[key] + submsg);
    }
    var displayTips = function(key){

        $(".tips span").css("color","white").html(currentScene.getTips());
    }    
    return {
        displayGesture:displayGesture,
        displayTips:displayTips
    }
})(jQuery);

var preLoad = function(url){
    if(!ifModelStarted(url)){
        startModel($("#preloadDiv iframe:first"),url);
    }
}

var ifModelStarted = function(url){
    return (url.indexOf("autostart=0") === -1) ? true : false;
}

var startModel = function($theIFrame,url){
    if(!url){
        url = $theIFrame.attr("src");
    }
    var preLoadUrl = url.replace("autostart=0","autostart=1");
    if($theIFrame.attr("src") !== preLoadUrl){
        $theIFrame.attr("src",preLoadUrl);
    }
}
