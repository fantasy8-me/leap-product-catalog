/*
    1. Define the Scene class
    2. Define all Scene instances
    
    In-File Execution: No
     File init Method: initScene()
*/

var currentScene;

var appMainScene;
var productScene;

var SCENES = {
  APP_MAIN_SCENE:"APP_MAIN_SCENE",
  PRODUCT_SCENE:"PRODUCT_SCENE",
}


function sceneSwitch(scene){
  if(currentScene && currentScene.name === scene){
    return;
  }
  if(currentScene)
    currentScene.onExit();
  switch(scene){
    case SCENES.APP_MAIN_SCENE:{
      currentScene = appMainScene;
      break;
    }
    case SCENES.PRODUCT_SCENE:{
      currentScene = productScene;
      break;
    }
  }
  currentScene.init();
}

var Scene = function (options){
  this.supportPointer = options.supportPointer === undefined ? true : options.supportPointer;
  this.name = options.name || "";
  this.selectFromPoint = options.selectFromPoint || undefined;
  this.onSelected = options.onSelected || undefined;
  this.selectMode = options.selectMode || Scene.SELECT_MODE.click; 

  this.scrollObject = options.scrollObject || document.body;
  this.scrollDirection = options.scrollDirection || "vetical";
  this.scrollPace = options.scrollPace || 2;

  this.getScrollObject = options.getScrollObject || undefined;

  this.selecting = false;
  this.selectedElement = undefined;
}
Scene.SELECT_MODE = {
  click : "click",
  press : "press"
}


var defineSceneClass = function(){//called after dom model is ready


  Scene.prototype.onMove = function(event){
    if(this.supportPointer){
      this.pointer.moveTo(event.x,event.y);
      if(this.selectFromPoint){
        var tmpEm = this.selectFromPoint(event.x,event.y);
        if(tmpEm){
          if(!event.gestureFound && !this.selecting){
            this.selecting = true;
            this.selectedElement = tmpEm;
            this.pointer.startSelectAnimation((function(){
              this.onSelected.bind(this)(this.selectedElement);
            }).bind(this),this.selectMode);
          }
        }else if(this.selecting){
          this.selecting = false;
          this.pointer.stopSelectAnimation();
        }
      }

    }
  }

  Scene.prototype.onPointerAppear = function(event){
    if(this.supportPointer){
      // console.log(this.name + ": onPointerAppear:");
      this.pointer.appear();
    }
  }

  Scene.prototype.onPointerDisappear = function(){
    if(this.supportPointer){
      this.pointer.disappear();
    }
    // console.log(this.name + ": onPointerDisappear:");
  }

  Scene.prototype.onCircle = function(event){
    var ori;
    if(this.getScrollObject){
      var tmpCache = this.getScrollObject(event.x,event.y);
      if(!tmpCache){
        return;
      }
      this.scrollObject = tmpCache.object;
      this.scrollDirection = tmpCache.direction || "vetical";
    }
    if(this.scrollDirection === "vetical"){
      ori = this.scrollObject.scrollTop;
      if(event.clockwise){
        this.scrollObject.scrollTop += this.scrollPace + event.radius * 0.2;
        if(event.numOfPointable >= 3){
          if(this.scrollObject.scrollTop === ori){
            this.scrollObject.scrollTop = 0;  
          }  
        }
      }else{
        this.scrollObject.scrollTop -= this.scrollPace + event.radius * 0.2;
        if(event.numOfPointable >= 3){
          if(this.scrollObject.scrollTop === 0){
            this.scrollObject.scrollTop = this.scrollObject.scrollHeight;
          }  
        }
      }
    }else{
      ori = this.scrollObject.scrollLeft;
      if(event.clockwise){
        this.scrollObject.scrollLeft += this.scrollPace + event.radius * 0.2;
        if(event.numOfPointable >= 3){
          if(this.scrollObject.scrollLeft === ori){
            this.scrollObject.scrollLeft = 0;  
          }  
        }
      }else{
        this.scrollObject.scrollLeft -= this.scrollPace + event.radius * 0.2;
        if(event.numOfPointable >= 3){
          if(this.scrollObject.scrollLeft === 0){
            this.scrollObject.scrollLeft = this.scrollObject.scrollWidth;
          }  
        }
      }

      //window.scrollBy(2,0);
    }
  }

  Scene.prototype.onSwipe = function(event){
  } 

  Scene.prototype.onKeyTap = function(event){
  }

  Scene.prototype.onHelpAppear = function(event){
  }

  Scene.prototype.onHelpDisappear = function(event){
    
  }  

  Scene.prototype.pointer = (function(){
    var center = {x:27,y:27};
    var canvasEm = document.getElementById("pointer");
    var baseRadius = 19;


    var init = function(){
      var ctx = canvasEm.getContext("2d");
      ctx.beginPath();

      ctx.arc(center.x,center.y,baseRadius-2,0,2 * Math.PI);
      // ctx.fillStyle = "rgba(102,204,204,0.7)";
      // ctx.fillStyle = "rgba(102,176,204,0.7)";
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fill();

      ctx.beginPath();
      ctx.lineWidth =center.x - baseRadius + 2;
      ctx.strokeStyle = 'rgba(55,50,54,0.9)';
      ctx.arc(center.x,center.y,baseRadius +2,0,2*Math.PI);
      ctx.stroke();
    };

    var init2 = function(){
      var ctx = canvasEm.getContext("2d");
      ctx.clearRect(0,0,center.x * 2,center.y*2);
      var ctx = canvasEm.getContext("2d");
      ctx.beginPath();

      ctx.arc(center.x,center.y,baseRadius-2,0,2 * Math.PI);
      ctx.fillStyle = "rgba(214,71,96,0.5)";//#d64760
      ctx.fill();

      ctx.beginPath();
      ctx.lineWidth =center.x - baseRadius + 2;
      ctx.strokeStyle = 'rgba(55,50,54,0.9)';
      ctx.arc(center.x,center.y,baseRadius +2,0,2*Math.PI);
      ctx.stroke();
    };

    var restore = function(){
      var ctx = canvasEm.getContext("2d");
      ctx.clearRect(0,0,center.x * 2,center.y*2);
      init();
    };

    var timer;
    var startSelectAnimation = function(callback,selectMode,step){
      if(!step) 
        step = 0;
      if(step <2.01){
        var ctx = canvasEm.getContext("2d");
        ctx.beginPath();
        ctx.arc(center.x,center.y,baseRadius-3,0,step * Math.PI);
        ctx.lineTo(center.x,center.y);
        ctx.fillStyle = "#d64760";
        ctx.fill();

        ctx.beginPath();
        ctx.lineWidth =10;
        ctx.strokeStyle = 'rgba(55,50,54,0.4)';
        ctx.arc(center.x,center.y,baseRadius + 1,0,step * Math.PI);
        ctx.stroke();

        step += 0.1;
        timer = setTimeout(function(){startSelectAnimation(callback,selectMode,step)},100);
      }else{
        if(selectMode === Scene.SELECT_MODE.click){
          restore();
        }
        callback();
      }
    };

    var stopSelectAnimation = function(){
      clearTimeout(timer);
      restore();
    };

    var disappear = function(){
      canvasEm.style.display = "none";
    }
    var appear = function(){
      restore();
      canvasEm.style.display = "inline-block";
    }
    var moveTo = function(x,y){
      canvasEm.style.left = x - center.x + "px";
      canvasEm.style.top = y - center.y + "px";    
    }
    var centerPosition = function(){
      return {
        x:$(canvasEm).position().left + center.x,
        y:$(canvasEm).position().top + center.y
      }
    }

    return{
      center:center,
      restore:restore,
      startSelectAnimation:startSelectAnimation,
      init2:init2,
      stopSelectAnimation:stopSelectAnimation,
      appear:appear,
      disappear:disappear,
      moveTo:moveTo,
      centerPosition:centerPosition
    }

  })();

};




var createAppMainScene = function($){
  var stub = new Scene({name:SCENES.APP_MAIN_SCENE,
                        selectFromPoint: function(x,y){
                          $selectedElement = $(document.elementFromPoint(x,y));
                          if($selectedElement.parent().parent().parent().hasClass("item thumb")){
                            return $selectedElement;
                          }else{
                            return undefined;
                          }
                        },
                        onSelected: function(selectedElement){
                          selectedElement.click();
                        },
                      });
  stub.onSwipe = function(event){
    
  };

  stub.onKeyTap = function(event){
  }

  stub.onExit = function(){
    this.pointer.stopSelectAnimation();
    this.selecting = false;
    this.selectedElement = undefined;
  }

  stub.init = function(){
  }
  stub.onCircle =function(event){
      var evt = document.createEvent("MouseEvents");
      
      var isClockWise = event.clockwise;
      var offest = 1 * (isClockWise ? 1 : -1);
      var oriScrollLeft = document.getElementById("main").scrollLeft;
      evt.initMouseEvent(
        'DOMMouseScroll', // in DOMString typeArg,
         true,  // in boolean canBubbleArg,
         true,  // in boolean cancelableArg,
         window,// in views::AbstractView viewArg,
         offest,   // in long detailArg,
         0,     // in long screenXArg,
         0,     // in long screenYArg,
         0,     // in long clientXArg,
         0,     // in long clientYArg,
         0,     // in boolean ctrlKeyArg,
         0,     // in boolean altKeyArg,
         0,     // in boolean shiftKeyArg,
         0,     // in boolean metaKeyArg,
         0,     // in unsigned short buttonArg,
         null   // in EventTarget relatedTargetArg
      );        
      window.dispatchEvent(evt);  
      
      if(event.numOfPointable >= 4){
        if(oriScrollLeft === document.getElementById("main").scrollLeft){
          // isClockWise = !isClockWise
          offest = document.getElementById("main").scrollWidth * (isClockWise ? -1 : 1);
        }
        var evt2 = document.createEvent("MouseEvents");
        evt2.initMouseEvent(
          'DOMMouseScroll', // in DOMString typeArg,
           true,  // in boolean canBubbleArg,
           true,  // in boolean cancelableArg,
           window,// in views::AbstractView viewArg,
           offest,   // in long detailArg,
           0,     // in long screenXArg,
           0,     // in long screenYArg,
           0,     // in long clientXArg,
           0,     // in long clientYArg,
           0,     // in boolean ctrlKeyArg,
           0,     // in boolean altKeyArg,
           0,     // in boolean shiftKeyArg,
           0,     // in boolean metaKeyArg,
           0,     // in unsigned short buttonArg,
           null   // in EventTarget relatedTargetArg
        );        
        window.dispatchEvent(evt2);  
      }   

  }
  return stub;


};

var createProductScene = function($){
  var stub = new Scene({name:SCENES.PRODUCT_SCENE,
                        selectFromPoint: function(x,y){
                          $selectedElement = $(document.elementFromPoint(x,y));
                          if($selectedElement.hasClass("nav-next") || $selectedElement.hasClass("nav-previous")){
                            $selectedElement.hover();
                            return $selectedElement
                          }else{
                            return undefined;
                          }
                        },
                        onSelected: function(selectedElement){
                          selectedElement.click();
                        },
                      });
  stub.onSwipe = function(event){
    if(event.numOfPointable >= 3 && (event.direction === "left" || event.direction === "right")){
      $("html > div").click();
      //sceneSwitch(SCENES.APP_MAIN_SCENE);
    }

  };


  stub.onExit = function(){
    this.pointer.stopSelectAnimation();
    this.selecting = false;
    this.selectedElement = undefined;
  }

  stub.init = function(){
  }
  stub.onCircle =function(event){

  }
  return stub;


};

var initScene = function($){
    defineSceneClass();
    appMainScene = createAppMainScene($);
    productScene = createProductScene($);
    $("article.item.thumb a").each(function(){
      $(this).click(function(){
        console.debug("Go to details scene");
        setTimeout(function(){sceneSwitch(SCENES.PRODUCT_SCENE);},1000);  
      });
    });
    $("html > div").click(function(){
      console.debug("return admin scene");
      sceneSwitch(SCENES.APP_MAIN_SCENE);  
    });    
    sceneSwitch(SCENES.APP_MAIN_SCENE);
}