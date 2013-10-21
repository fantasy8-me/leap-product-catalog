var tutorialManager = (function($){

    var gestureDes = {
        "CIRCLE":"Circling with ",
        "SWIPE":"Swipe ",
    }

    var displayGesture = function(key,submsg){
        $(".tip-block span").css("color","rgb(194, 223, 156)").html(gestureDes[key] + submsg);
    }
    var displayTips = function(key){

        $(".tip-block span").css("color","white").html(currentScene.getTips());
    }    
    return {
        displayGesture:displayGesture,
        displayTips:displayTips
    }
})(jQuery);