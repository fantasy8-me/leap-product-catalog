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
        "KEYTAB":"Keytab detected",
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


    return{
        preLoad:preLoad,
        ifModelStarted:ifModelStarted,
        startModel:startModel
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
