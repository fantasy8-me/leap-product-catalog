/*
 *   Module Usage:
 *   1. Define the Scene class
 *   2. Define all Scene instances, totally two scenes defined currently
 *      a. Main scene, represent the catalog page
 *      b.  Product scene, represent the product popup 
 *   
*/

/*
  All methods and variables in these files should be treated as private except those exported by sceneExport
*/
var sceneExport = (function(){

  var SCENES ={
    APP_MAIN_SCENE:"APP_MAIN_SCENE",
    PRODUCT_SCENE:"PRODUCT_SCENE",
  }

  var currentScene = null;
  var appMainScene = null;
  var productScene = null;

  /*
    Switch to specified "Scene"
  */
  var sceneSwitch = function (scene){
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

  /*
    Init this Scene module, this method must be invoked after dom is ready
  */
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
        sceneSwitch(SCENES.APP_MAIN_SCENE);  
      });    
      sceneSwitch(SCENES.APP_MAIN_SCENE);
  }

  var getCurrentScene = function(){
    return currentScene;
  }

  return{
    SCENES:SCENES,
    getCurrentScene:getCurrentScene,
    sceneSwitch:sceneSwitch,
    initScene:initScene
  }
})();


  /* 
   * "Scene" is a virtual concept， which is used to separate the page flow in order to better control different page by Leap
   * Each individual scene will support different set of Leap gestures.
   * In this class, below common object and methods are defined.
   *   1. Pointer(or say cursor)
   *   2. Handling for basic gestures, e.g. pointer move, appear/disappear, select, scroll
   *   3. If the default handling is not applicable for specified scene, it can be overwritten in those scenes
  */

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

  /*To define the common methods in prototype of Scene class*/
  var defineSceneClass = function(){//called after dom model is ready

    Scene.prototype.onMove = function(event){
      if(this.supportPointer){
        if(event.numOfPointableChanged && !this.selecting){
          this.pointer.refresh(event);
        }
        this.pointer.moveTo(event.x,event.y);
        if(this.selectFromPoint){
          var tmpEm = this.selectFromPoint(event.x,event.y);
          if(tmpEm){
            if(!event.gestureFound && !this.selecting){
              this.selecting = true;
              this.selectedElement = tmpEm;
              this.pointer.initSelect();
              this.pointer.startSelectAnimation((function(){
                this.onSelected.bind(this)(this.selectedElement);
              }).bind(this),this.selectMode,event);
            }
          }else if(this.selecting){
            this.selecting = false;
            this.pointer.stopSelectAnimation(event);
          }
        }

      }
    }

    Scene.prototype.onPointerAppear = function(event){
      if(this.supportPointer){
        this.pointer.appear(event);
      }
    }

    Scene.prototype.onPointerDisappear = function(){
      if(this.supportPointer){
        this.pointer.disappear();
      }
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
          if(event.numOfPointable >= 4){
            if(this.scrollObject.scrollTop === ori){
              this.scrollObject.scrollTop = 0;  
            }  
          }
        }else{
          this.scrollObject.scrollTop -= this.scrollPace + event.radius * 0.2;
          if(event.numOfPointable >= 4){
            if(this.scrollObject.scrollTop === 0){
              this.scrollObject.scrollTop = this.scrollObject.scrollHeight;
            }  
          }
        }
      }else{
        ori = this.scrollObject.scrollLeft;
        if(event.clockwise){
          this.scrollObject.scrollLeft += this.scrollPace + event.radius * 0.2;
          if(event.numOfPointable >= 4){
            if(this.scrollObject.scrollLeft === ori){
              this.scrollObject.scrollLeft = 0;  
            }  
          }
        }else{
          this.scrollObject.scrollLeft -= this.scrollPace + event.radius * 0.2;
          if(event.numOfPointable >= 4){
            if(this.scrollObject.scrollLeft === 0){
              this.scrollObject.scrollLeft = this.scrollObject.scrollWidth;
            }  
          }
        }
      }
    }

    /*Stub method, do nothing if not overwritten by child*/
    Scene.prototype.onSwipe = function(event){
    } 

    Scene.prototype.onKeyTap = function(event){
    }

    Scene.prototype.onHelpAppear = function(event){
    }    

    /*Define the pointer, */
    Scene.prototype.pointer = (function(){
      var center = {x:27,y:27};
      var canvasEm = document.getElementById("pointer");
      var baseRadius = 19;


      var init = function(event,colorStr){
        var ctx = canvasEm.getContext("2d");
        ctx.beginPath();

        ctx.arc(center.x,center.y,baseRadius-2,0,2 * Math.PI);
        if(!colorStr)
          colorStr = "rgba(255,255,255,0.9)"
        ctx.fillStyle = colorStr;
        ctx.fill();

        ctx.beginPath();
        ctx.lineWidth = center.x - baseRadius + 2;;
        ctx.strokeStyle = 'rgba(55,50,54,0.9)';
        ctx.arc(center.x,center.y,baseRadius +2,0,2*Math.PI);
        ctx.stroke();

        if(event){
          ctx.fillStyle = "#d64760";
          ctx.font="25px Arial";
          ctx.fillText(event.numOfPointable,20,35);
        }
      };

      /*Clean and redraw the pointer*/
      var refresh = function(event){
        var ctx = canvasEm.getContext("2d");
        ctx.clearRect(0,0,center.x * 2,center.y*2);
        init(event);
      };

      /*initialize the pointer with different color before start the selectin animation*/
      var initSelect = function(){
        var ctx = canvasEm.getContext("2d");
        ctx.clearRect(0,0,center.x * 2,center.y*2);
        init(null,"#0066ff");
      };

      var timer;
      var startSelectAnimation = function(callback,selectMode,event,step){
        if(!step) 
          step = 0;
        if(step <2.01){
          var ctx = canvasEm.getContext("2d");
          ctx.beginPath();
          ctx.arc(center.x,center.y,baseRadius-3,0,step * Math.PI);
          ctx.lineTo(center.x,center.y);
          ctx.fillStyle = "rgba(255,255,255,0.5)";
          ctx.fill();

          ctx.beginPath();
          ctx.lineWidth =10;
          ctx.strokeStyle = 'rgba(55,50,54,0.4)';
          ctx.arc(center.x,center.y,baseRadius + 1,0,step * Math.PI);
          ctx.stroke();

          step += 0.15;
          timer = setTimeout(function(){startSelectAnimation(callback,selectMode,event,step)},100);
        }else{
          if(selectMode === Scene.SELECT_MODE.click){
            refresh(event);
          }
          callback();
        }
      };

      var stopSelectAnimation = function(event){
        clearTimeout(timer);
        if(event)
          refresh(event);
        else{
          refresh();
        }
      };

      var disappear = function(){
        canvasEm.style.display = "none";
      }
      var appear = function(event){
        refresh(event);
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
        refresh:refresh,
        initSelect:initSelect,
        startSelectAnimation:startSelectAnimation,
        stopSelectAnimation:stopSelectAnimation,
        appear:appear,
        disappear:disappear,
        moveTo:moveTo
      }
    })();
  };


  /* 
   * Method to create the main scene, that is, the catalog main page
   *   Circling(clockwise) -  scroll right
   *   Circling(counter clockwise) -  scroll left
   *   Point at the thumb image and hold to select product
  */
  var createAppMainScene = function($){
    var stub = new Scene({
                          name:sceneExport.SCENES.APP_MAIN_SCENE,

                          selectFromPoint: function(x,y){
                            $selectedElement = $(document.elementFromPoint(x,y));
                              if($selectedElement.parent().parent().parent().hasClass("item thumb")){
                                return $selectedElement;
                              }else{
                                return undefined;
                              }
                          },

                          onSelected: function($selectedElement){
                            $selectedElement.click();
                          },
                        });
    stub.onExit = function(){
      this.pointer.stopSelectAnimation();
      this.selecting = false;
      this.selectedElement = undefined;
    }
    stub.getTips = function(){
      return "2 Fingertips circle to scroll<br>Point and hold to open product"
    }
    stub.init = function(){
      /*Reserve for any Initialization logic*/
    }

    /*
      The scrolling function in the website template is a little bit complicated, to avoid breaking any it's logic,
      we simulate the mouse scroll event to trigger the scrolling, instead of scrolling the reel directly.
    */
    stub.onCircle =function(event){
        
        var isClockWise = event.clockwise;
        var offest = 1 * (isClockWise ? 1 : -1);
        var oriScrollLeft = document.getElementById("main").scrollLeft;
        window.dispatchEvent(createScrollEvent(offest));  
        
        if(event.numOfPointable >= 4){
          if(oriScrollLeft === document.getElementById("main").scrollLeft){
            // isClockWise = !isClockWise
            offest = document.getElementById("main").scrollWidth * (isClockWise ? -1 : 1);
          }
          window.dispatchEvent(createScrollEvent(offest));  
        }   
    }

    /*simulate the dom scroll event*/
    var createScrollEvent = function(offest){
      var evt = document.createEvent("MouseEvents");
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
      return evt;
    }

    return stub;
  };


  /* 
   * Method to create the product popup scene. Below gestures are supported in this scene
   *  Circling(clockwise) -  scroll down
   *  Circling(counter clockwise) -  scroll up
   *  Point at the navigation button hold to navigate between products.
   *  Point at the product image(if it is static) hold to start the 3d model
   *  Horizontally swipe to exit the page
  */
  var createProductScene = function($){
    var stub = new Scene({
                          name:sceneExport.SCENES.PRODUCT_SCENE,
                          
                          selectFromPoint: function(x,y){
                            $selectedElement = $(document.elementFromPoint(x,y));
                            if($selectedElement[0] && $selectedElement[0].tagName === "IFRAME"){
                              if(!globalUtil.ifModelStarted($selectedElement.attr("src")))
                                  return $selectedElement;
                            }else if($selectedElement.hasClass("nav-next") || $selectedElement.hasClass("nav-previous")){
                              return $selectedElement;
                            }else{
                              return undefined;
                            }
                          },
                          
                          onSelected: function($selectedElement){
                            if($selectedElement[0] && $selectedElement[0].tagName === "IFRAME"){
                              globalUtil.startModel($selectedElement)
                            }else{
                              $selectedElement.click(); //navigate
                            }
                          },
                          
                          getScrollObject: function(){
                            return {object:$(".custom-poptrox-popup .popupContent")[0]}
                          }
                        });

    stub.onSwipe = function(event){
      if(event.numOfPointable >= 3 && (event.direction === "left" || event.direction === "right")){
        $("html > div").click();
      }
    };

    stub.onExit = function(){
      this.pointer.stopSelectAnimation();
      this.selecting = false;
      this.selectedElement = undefined;
    }
    stub.init = function(){
    }
    stub.getTips = function(){
      return "Swipe horizontally to escape <br> Point and hold to navigate or start 3d model"
    }
    return stub;
  };