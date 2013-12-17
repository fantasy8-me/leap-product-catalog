/*
 *  Module Usage:
 *  1.Define global util methods
 *  2.Define util moodul, e.g. tutorialManger.
 *  3.Define global params if any
 *  
*/

var tutorialManager = (function($){
    var msgCloseTimer = null;
    var gestureDes = {
        "CIRCLE":"Circling with ",
        "SWIPE":"Swipe ",
        "KEYTAP":"Keytap detected",
        "SCREENTAP":"Screentap detected"
    }

    var displayGesture = function(key,submsg){
        $("#tipsBox").find("div#gesture").html(gestureDes[key] + (submsg ? submsg : ""));
        window.clearTimeout(msgCloseTimer);
        msgCloseTimer = window.setTimeout(function(){
            $("#tipsBox").find("div#gesture").html("No gesture detected");
        }, 2000);

    }
    var hideTips = function(key){
        $("#tipsBox").hide();
    }
    var displayTips = function(){
        $("#tipsBox").show();
        if(sceneExport){
            $("#tipsBox").removeClass();
                var className = sceneExport.getCurrentScene().getTipClass ? sceneExport.getCurrentScene().getTipClass() : "short";
                var tips = sceneExport.getCurrentScene().getTips ? sceneExport.getCurrentScene().getTips() : ""
            if(tips !== ""){
                $("#tipsBox").css("display","inline-block")
                $("#tipsBox").addClass(className).find("div#tips").html(tips);
            }else{
                $("#tipsBox").css("display","none")
            }
        }
    }
    return {
        displayGesture:displayGesture,
        displayTips:displayTips,
        hideTips:hideTips
    }
})(jQuery);

var graphicalTipsManager = (function($){
    var paths = {
        "SCROLL-LEFT":"scroll-left.png",
        "SCROLL-RIGHT":"scroll-right.png",
        "SCROLL-UP":"scroll-up.png",
        "SCROLL-DOWN":"scroll-down.png",
        "SWIPE-HORIZONTAL":"swipe-horizontal.png",
        "SMALL-CIRCLE-CLICK":"small-circle.png"
    }
    var lastGestureIsScroll;

    var display = function(type){
        if(lastGestureIsScroll || type.indexOf("SCROLL") === -1 || $("#graphicalTips").css("display") === "none"){
            lastGestureIsScroll = type.indexOf("SCROLL") === -1 ? false : true;
            $("#graphicalTips").stop(true,true);
            $("#graphicalTips img").attr("src", "images/gestures/"+paths[type]);
            $("#graphicalTips").show();
            $("#graphicalTips").fadeOut(2500);
        }
    }
    return {
        display:display
    }
})(jQuery);

var globalUtil = (function(){
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
    var displayError = function(){
        $("#systemerror").html("Error Occurs").addClass("show");
    }

    var reloadModel = function($theIFrame){
        $theIFrame.attr("src",$theIFrame.attr("src"));
    }

    return{
        preLoad:preLoad,
        ifModelStarted:ifModelStarted,
        startModel:startModel,
        displayError:displayError,
        reloadModel:reloadModel
    }
})();



var tipsManager = (function($){
    var displayTips = function(){
      $("#tipsBox").removeClass();
      var className = currentScene.getTipClass ? currentScene.getTipClass() : "long";
      var tips = currentScene.getTips ? currentScene.getTips() : ""
      if(tips !== ""){
        $("#tipsBox").css("display","inline-block")
        $("#tipsBox").addClass(className).html(tips);
      }else{
        $("#tipsBox").css("display","none")
      }
    }    
    return {
        displayTips:displayTips
    }
})(jQuery);
