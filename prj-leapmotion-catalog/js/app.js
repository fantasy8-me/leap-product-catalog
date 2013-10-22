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
    if(url.indexOf("autostart=0") !== -1){
        preLoadUrl = url.replace("autostart=0","autostart=1");
        if($("#preloadDiv iframe:first").attr("src") !== preLoadUrl){
            $("#preloadDiv iframe:first").attr("src",preLoadUrl);
        }
    }
}