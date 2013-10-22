var window_focus = true;

$(window).focus(function() {
    window_focus = true;
}).blur(function() {
    window_focus = false;
});

var initLeap = (function(){

    var controllerOptions = {enableGestures: true};
    var prePrimaryPointer;
    var preNumOfPointable;

    var LEAP_MIN_X = -130;
    var LEAP_MAX_X = 130;
    var LEAP_MAX_Y = 160;
    var LEAP_MIN_Y = 40;

    var identifyPrimaryPointer = function(pointables){
        var longestPointable;

        for (var i = 0;i < pointables.length; i++) {
            if(prePrimaryPointer && pointables[i].id === prePrimaryPointer.id)
            {
                return pointables[i];
            }
            longestPointable = (longestPointable ? longestPointable.length : 0) > pointables[i].length ? longestPointable : pointables[i];
        };
        return longestPointable;
    }

    var isNumOfPointableChanged = function(pointables){
         if(pointables.length !== preNumOfPointable){
            preNumOfPointable = pointables.length;
            return true;
         }else{
            return false;   
         }
    }
    var transCoordinate = function(v) {

        var vec = {
            x:transSingleAxisbase(v[0], LEAP_MIN_X,LEAP_MAX_X,0,window.innerWidth),
            y:transSingleAxisbase(v[1], LEAP_MIN_Y,LEAP_MAX_Y,window.innerHeight,0),                        
            z:v[2]
        };
        if(!vec.x || !vec.y){
            return undefined;
        }else{
            return vec;
        }
    }

    var transSingleAxisbase = function transSingleAxisbase(leapPos, leapMin, leapMax, screenMin, screenMax) {
        if(leapPos > leapMax || leapPos < leapMin){
            return null;
        }
        return screenMin + (leapPos - leapMin) * (screenMax - screenMin) / (leapMax - leapMin);
    }

    function angleBetweenVectors(a, b) {
        var dotProd = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
        var maga = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
        var magb = Math.sqrt(b[0] * b[0] + b[1] * b[1] + b[2] * b[2]);

        return Math.acos(dotProd / (maga * magb));

    }

    var pause = function(){
    }
    var resume = function(){
    }

    var controller = new Leap.Controller(controllerOptions);


    controller.on('deviceDisconnected', function() {
      pause();
    });

    controller.on('deviceConnected', function() {
      resume();
    });


    controller.on('ready', function() {
        resume();
    });

    controller.on('focus', function() {
    }); 
    controller.on('blur', function() {
    });     
    controller.on('connect', function() {
    }); 

    controller.on('frame', function(frame) {
        try{
            // if(!window_focus){
            //     return;
            // }
            var validPointables = (function(){
                var tmpPointables = new Array();
                for (var i = frame.pointables.length - 1; i >= 0; i--) {
                    if(frame.pointables[i].length>25){
                        tmpPointables.push(frame.pointables[i]);
                    }
                };
                return tmpPointables;
            })();

            var event = {
                gestureFound: frame.gestures.length > 0,
                numOfPointable: validPointables.length,
                numOfPointableChanged: isNumOfPointableChanged(validPointables)
            }
            
            var primaryPointablePos;
            var primaryPointable;
            if(validPointables.length > 0){
                primaryPointable = identifyPrimaryPointer(validPointables);
                primaryPointablePos = transCoordinate(primaryPointable.tipPosition);
                if(primaryPointablePos){
                    event.x = Math.round(primaryPointablePos.x);
                    event.y = Math.round(primaryPointablePos.y);
                }
            }
            if(!prePrimaryPointer && primaryPointable){
                if(primaryPointablePos){
                    //console.debug("apprear:"+ primaryPointable.id);
                    currentScene.onPointerAppear(event);
                    prePrimaryPointer = primaryPointable;
                }           
            }else if(prePrimaryPointer && !primaryPointable){
                prePrimaryPointer = undefined;
                currentScene.onPointerDisappear();
            }else if(prePrimaryPointer && primaryPointable){
                if(primaryPointablePos){
                    currentScene.onMove(event);
                    prePrimaryPointer = primaryPointable;
                }else{
                    prePrimaryPointer = undefined;
                    currentScene.onPointerDisappear();
                }
            }

            var validGestures = (function(){
                var tmpGesture = new Array();
                var foundSwipe = false;
                var foundCircle = false;
                var foundTab = false;
                for (var i = frame.gestures.length - 1; i >= 0; i--) {
                    var gesture = frame.gestures[i];
                    switch (gesture.type){
                        case "circle":{
                            foundCircle = true;
                            tmpGesture.push(gesture);
                        }
                        case "swipe":{
                            if(!foundCircle){
                                if(!foundSwipe){
                                    foundSwipe = true;
                                    tmpGesture.push(gesture);
                                }
                            }                               
                            break;
                        }
                        case "screenTap":
                        case "keyTap":{
                            if(!foundCircle && !foundSwipe){
                                if(!foundTab){
                                    foundTab = true;
                                    tmpGesture.push(gesture);
                                }else{
                                    console.debug("more than one tab in single frame");
                                }
                            }
                        }
                    }
                };
                return tmpGesture;
            })();
            if(validGestures.length === 0){
                tutorialManager.displayTips();
            }

            for (var i = 0; i < validGestures.length; i++) {
              var gesture = validGestures[i];

              switch (gesture.type) {
                case "circle":
                    var id = gesture.pointableIds[0];
                    var dir = frame.finger(id).direction; // get direction of the Pointable used for the circle     
                    if(dir){
                        event.radius = gesture.radius.toFixed(0);
                        if (angleBetweenVectors(dir, gesture.normal) <= (Math.PI / 4)){
                          event.clockwise = true;
                        } else if(angleBetweenVectors(dir, gesture.normal) > (Math.PI / 4)){
                          event.clockwise = false;
                        }
                        currentScene.onCircle(event);
                    }
                    var submsg = event.numOfPointable > 1 ? event.numOfPointable + " fingers" : "1 finger";
                    tutorialManager.displayGesture("CIRCLE",submsg);
                  break;
                case "swipe":{
                  var direction = "unknown";
                      if(gesture.direction[1] < -0.7){// && gesture.pointableIds[0] == prePrimaryPointer.id
                        if(frame.hands.length ==2 && (gesture.state==="stop" || gesture.state==="start")){
                            currentScene.onHelpAppear(event);
                        }else if(primaryPointablePos && gesture.state==="stop"){
                            if(validPointables.length >=3){
                                direction = "down"
                            }
                        }
                      }else if (gesture.direction[1] > 0.7 && gesture.state==="stop"){
                        if(frame.hands.length ==2){
                        }else if(primaryPointablePos && gesture.state==="stop"){
                            if(validPointables.length >=3){
                                direction = "up";
                            }
                        }       
                      }
                      else if(gesture.direction[0] < -0.7 && primaryPointablePos){
                        direction = "left";
                      }else if(gesture.direction[0] > 0.7 && primaryPointablePos){
                        direction = "right";
                      }
                      if(direction !== "unknown"){
                        event.direction = direction;
                        tutorialManager.displayGesture("SWIPE", event.direction);
                        currentScene.onSwipe(event);
                      }
                  break;
                }
                //case "screenTap":
                case "keyTap":{
                    if(validPointables.length >= 2){
                        currentScene.onKeyTap(event);
                    }
                  break;
                }
              }
            }
        }catch(e){
            console.error("leap motion exception:" + e.message);
        }
    });

    controller.connect();
    return{
        controller:controller
    }

});



