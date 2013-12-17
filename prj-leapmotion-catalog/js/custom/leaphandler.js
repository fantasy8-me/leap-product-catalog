/*  Module Usage:
 *
 *  Integrate with Leap controller
 *   1. Register handler for Leap "frame" event
 *   2. Connect to Leap with proper options 
 *   3. Pre-process the raw data got from "frame" 
 *   4. Processed raw data will be encapsulated into event object, then pass to current Scene for further processing
*/
var initLeap = (function(){

    /*
        Options for Leap connection
    */
    var controllerOptions = {enableGestures: true};
    
    /*
        The primary finger identified in previous frame
        Check method "identifyPrimaryFinger" for how to identify the primary finger
    */
    var prePrimaryFinger;

    /*
        Number of finger in previous frame, used to check whether number of finger changed between two frame
    */
    var preNumOfFinger;

    /*
        Define a rectangle within Leap control area,
        LEAP_MIN_X - map to left edge of the screen
        LEAP_MAX_X - map to right edge of the screen
        LEAP_MIN_Y - map to bottom of the screen
        LEAP_MAX_Y - map to top of the screen
    */
    var LEAP_MIN_X = -130;
    var LEAP_MAX_X = 130;
    var LEAP_MAX_Y = 160;
    var LEAP_MIN_Y = 40;


    /*
        Method to identify the primary finger, whose coordinates will be used to draw the pointer(cursor).
        1. If the primary finger in previous frame still exist in current frame, then keep it as primary finger
        2. Choose the longest one if rule 1 is not applicable
    */
    var identifyPrimaryFinger = function(pointables){
        var longestPointable;

        for (var i = 0;i < pointables.length; i++) {
            if(prePrimaryFinger && pointables[i].id === prePrimaryFinger.id)
            {
                return pointables[i];
            }
            longestPointable = (longestPointable ? longestPointable.length : 0) > pointables[i].length ? longestPointable : pointables[i];
        };
        return longestPointable;
    }

    /* 
        Check whether the number of finger changed.
    */
    var isNumOfPointableChanged = function(pointables){
         if(pointables.length !== preNumOfFinger){
            preNumOfFinger = pointables.length;
            return true;
         }else{
            return false;   
         }
    }
    /* 
        Transfer the coordinates from Leap to screen(browser)
        Return 'undefined' if the pointer is out of screen
    */ 
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
    /* 
        Formula to transfer the coordinate.
    */ 
    var transSingleAxisbase = function(leapPos, leapMin, leapMax, screenMin, screenMax) {
        if(leapPos > leapMax || leapPos < leapMin){
            return null;
        }
        return screenMin + (leapPos - leapMin) * (screenMax - screenMin) / (leapMax - leapMin);
    }

    /* 
        Calculate the angle between two vector.
    */ 
    var angleBetweenVectors = function(a, b) {
        var dotProd = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
        var maga = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
        var magb = Math.sqrt(b[0] * b[0] + b[1] * b[1] + b[2] * b[2]);

        return Math.acos(dotProd / (maga * magb));

    }

    /*
        Filter pointable objects base on length
    */
    var getValidPointables = function(frame){
        var tmpPointables = new Array();
        for (var i = frame.pointables.length - 1; i >= 0; i--) {
            if(frame.pointables[i].length>25){
                tmpPointables.push(frame.pointables[i]);
            }
        };
        return tmpPointables;
    }

    /*
        Multiple gestures can be found in same frame, to reduce the chance of conflict, 
        this method is used to filter the gestures.
        Gesture Priorify : : Circle --> Swipe --> keyTab,screenTab
    */
    var filterGesture = function(frame){
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
                case "screenTap":{
                    if(!foundCircle && !foundSwipe){
                        console.log("screen tap -------------");
                        tmpGesture.push(gesture);
                    }
                }
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
    }
    /*
        Control the display of pointer.
    */
    var showHidePointer = function(primaryFinger,event){
        if(!prePrimaryFinger && primaryFinger){
            if(event.x){
                sceneExport.getCurrentScene().onPointerAppear(event);
                prePrimaryFinger = primaryFinger;
            }           
        }else if(prePrimaryFinger && !primaryFinger){
            prePrimaryFinger = undefined;
            sceneExport.getCurrentScene().onPointerDisappear();
        }else if(prePrimaryFinger && primaryFinger){
            if(event.x){
                sceneExport.getCurrentScene().onMove(event);
                prePrimaryFinger = primaryFinger;
            }else{
                prePrimaryFinger = undefined;
                sceneExport.getCurrentScene().onPointerDisappear();
            }
        }

    }
    /*
        Process circle gesture, 
        Determine whether it is clockwise circle, result will be inject to event object
    */ 
    var processCircleGesture = function(frame,gesture,event){
        if(event.numOfPointable === 1){//TODO.Eric Confirm the restriction
            var id = gesture.pointableIds[0];
            var dir = frame.finger(id).direction; // get direction of the Pointable used for the circle     
            if(dir){
                event.radius = gesture.radius.toFixed(0);
                if (angleBetweenVectors(dir, gesture.normal) <= (Math.PI / 4)){
                  event.clockwise = true;
                } else if(angleBetweenVectors(dir, gesture.normal) > (Math.PI / 4)){
                  event.clockwise = false;
                }
                event.circleId = gesture.id;
                sceneExport.getCurrentScene().onCircle(event);
                
            }
        }
        var submsg = event.numOfPointable > 1 ? event.numOfPointable + " fingers" : "1 finger" + " radius:" + event.radius;
        tutorialManager.displayGesture("CIRCLE",submsg);

    }
    /*
        Process swipe gesture
        Determine the direction and inject the result to event object.
    */ 
    var processSwipeGesture = function(frame,gesture,event){
        var direction = "unknown";
        if(gesture.direction[1] < -0.7){
          if(frame.hands.length ==2 && (gesture.state==="stop" || gesture.state==="start")){
            sceneExport.getCurrentScene().onHelpAppear(event);
          }else if(event.x && gesture.state==="stop"){
            direction = "down"
          }
        }else if (gesture.direction[1] > 0.7 && gesture.state==="stop"){
          if(frame.hands.length ==2){
          }else if(event.x && gesture.state==="stop"){
            direction = "up";
          }       
        }else if(gesture.direction[0] < -0.7 && event.x){
          direction = "left";
        }else if(gesture.direction[0] > 0.7 && event.x){
          direction = "right";
        }
        if(direction !== "unknown"){
          event.direction = direction;
          if(direction === "right" || direction ==="left"){ 
            if(event.numOfPointable >=4){
                tutorialManager.displayGesture("SWIPE", "horizontally");
                graphicalTipsManager.display("SWIPE-HORIZONTAL");
                sceneExport.getCurrentScene().onHorizontalSwipe(event);
            }
          }else{
            if(event.numOfPointable >=4){
                sceneExport.getCurrentScene().onVerticalSwipe(event);
                tutorialManager.displayGesture("SWIPE", "vertically");
            }
          }
        }
    }
    /*
        Process keytab gesture
    */
    var processKeyTabGesture = function(event){
        if(event.numOfPointable >= 2){
            tutorialManager.displayGesture("KEYTAP");
            sceneExport.getCurrentScene().onKeyTap(event);
        }
    }

    /*
        Process keytab gesture
    */
    var processScreenTabGesture = function(event){
        tutorialManager.displayGesture("SCREENTAP");
        sceneExport.getCurrentScene().onScreenTab(event);
    }

    var controller = new Leap.Controller(controllerOptions);
    
    /* 
     *   Register the "frame" event handler, Leap controller will fire the "frame" event with all required data like
     *   gestures, pointable objects ...
     */ 
    controller.on('frame', function(frame) {
        try{

            var validPointables = getValidPointables(frame);

            var event = {
                gestureFound: frame.gestures.length > 0,
                numOfPointable: validPointables.length,
                preNumOfFinger:preNumOfFinger,
                numOfPointableChanged: isNumOfPointableChanged(validPointables)
            }
            
            var primaryFingerPos;
            var primaryFinger;
            if(validPointables.length > 0){
                primaryFinger = identifyPrimaryFinger(validPointables);
                primaryFingerPos = transCoordinate(primaryFinger.tipPosition);
                if(primaryFingerPos){
                    event.x = Math.round(primaryFingerPos.x);
                    event.y = Math.round(primaryFingerPos.y);
                }
            }

            showHidePointer(primaryFinger,event)

            var validGestures = filterGesture(frame);
            for (var i = 0; i < validGestures.length; i++) {
              var gesture = validGestures[i];

              switch (gesture.type) {
                case "circle":{
                    processCircleGesture(frame,gesture,event);
                    break;
                }
                case "swipe":{
                    processSwipeGesture(frame,gesture,event);
                    break;
                }
                case "screenTap":{
                    console.log("screen tab");
                    processScreenTabGesture(event);
                    
                    break;
                }                
                case "keyTap":{
                    processKeyTabGesture(event);
                    break;
                }
              }
            }
        }catch(e){
            throw e;
        }
    });

    controller.connect();
    return{
        controller:controller
    }

});



