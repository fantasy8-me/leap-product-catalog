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
    SKETCHFAB_SCENE:"SKETCHFAB_SCENE"
  }

  var currentScene = null;
  var appMainScene = null;
  var productScene = null;
  var sketchfabScene = null;

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
      case SCENES.SKETCHFAB_SCENE:{
        currentScene = sketchfabScene;
        break; 
      }
    }
    currentScene.init();
    tutorialManager.displayTips();
  }

  /*
    Init this Scene module, this method must be invoked after dom is ready
  */
  var initScene = function($){
      defineSceneClass();
      appMainScene = createAppMainScene($);
      productScene = createProductScene($);
      sketchfabScene = createSketchFabScene($);
      $("article.item.thumb a").each(function(){
        $(this).click(function(){
          console.debug("Go to details scene");
          setTimeout(function(){sceneSwitch(SCENES.PRODUCT_SCENE);},1000);  //To support mix operation of mouse and Leap
        });
      });
      $("html > div").click(function(){
        sceneSwitch(SCENES.APP_MAIN_SCENE);  //To support mix operation of mouse and Leap
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
    // this.selectFromPoint = options.selectFromPoint || undefined;
    this.elementForCirlceSelect = options.elementForCirlceSelect || undefined;
    this.elementForTimerSelect = options.elementForTimerSelect || undefined;
    this.onSelected = options.onSelected || undefined;
    this.onHover = options.onHover || undefined;
    this.offHover = options.offHover || undefined;
    this.selectMode = options.selectMode || Scene.SELECT_MODE.click; 

    this.scrollObject = options.scrollObject || document.body;
    this.scrollDirection = options.scrollDirection || "vetical";
    this.scrollPace = options.scrollPace || 2;

    this.getScrollObject = options.getScrollObject || undefined;

    this.selecting = false;
    //this.selectedElement = undefined;
    this.hoverElement = undefined;
    this.triggeredCircleId = undefined;

  }

  Scene.SELECT_MODE = {
    click : "click",  //cursor will be restored after the select animation is done
    press : "press"  //cursor will not be restored after the select animation is done
  }

  /*
    To define the common methods in prototype of Scene class
    Must be called after dom model is ready
  */
  var defineSceneClass = function(){

    Scene.prototype.onScreenTab = function(event){

    }

    Scene.prototype.onMove = function(event){
      if(this.supportPointer){
        if(event.numOfPointableChanged && !this.selecting){
          this.pointer.refresh(event);
        }
        this.pointer.moveTo(event);

        this.scrollByPosition(event);

        if(this.elementForCirlceSelect || this.elementForTimerSelect){
          var $element = $(document.elementFromPoint(event.x,event.y));
          var $elementForCirlceSelect = this.elementForCirlceSelect ? this.elementForCirlceSelect($element) : undefined;
          var $elementForTimerSelect = this.elementForTimerSelect ? this.elementForTimerSelect($element) : undefined;

          var $tmpEm = $elementForCirlceSelect || $elementForTimerSelect
          if(this.onHover && this.offHover){
            if($tmpEm){
              if(this.hoverElement)
                this.offHover(this.hoverElement);
              this.hoverElement = $tmpEm;
              this.onHover(this.hoverElement);
            }else{
              if(this.hoverElement){
                this.offHover(this.hoverElement);
                this.hoverElement = undefined;
              }
            }
          }

          if($elementForTimerSelect){
            if(!event.gestureFound && !this.selecting){
              this.selecting = true;
              this.selectedElement = $elementForTimerSelect;
              this.pointer.initSelect();
              this.pointer.startSelectAnimation((function(){
                this.onSelected(this.selectedElement);
                this.selectedElement = undefined;
              }).bind(this),this.selectMode,event);
            }
          }else if(this.selecting){
            this.selecting = false;
            this.pointer.stopSelectAnimation(event);
          }

        }
      }
    }

    Scene.prototype.scrollByPosition = function(event){
      // if(event.numOfPointable < 2){
      //   return
      // }
      if(this.getScrollObject){
        var tmpCache = this.getScrollObject(event.x,event.y);
        if(!tmpCache){
          return;
        }
        this.scrollObject = tmpCache.object;
        this.scrollDirection = tmpCache.direction || "vetical";
      }
      var relativePostionX = event.x/window.innerWidth;
      var relativePostionY = event.y/window.innerHeight;

      if(this.scrollDirection === "vetical"){
        if(relativePostionY > 0.7){
          this.scrollObject.scrollTop += this.scrollPace + (relativePostionY - 0.7) * 20;
          graphicalTipsManager.display("SCROLL-DOWN"); 
        }else if(relativePostionY < 0.3){
          this.scrollObject.scrollTop -= this.scrollPace + (0.3 - relativePostionY) * 20;
          graphicalTipsManager.display("SCROLL-UP");
        }
      }else{
        if(relativePostionX > 0.7){
          this.scrollObject.scrollLeft += this.scrollPace + (relativePostionX - 0.7) * 20;
          graphicalTipsManager.display("SCROLL-RIGHT");
        }else if(relativePostionX < 0.3){
          this.scrollObject.scrollLeft -= this.scrollPace + (0.3 - relativePostionX) * 20;
          graphicalTipsManager.display("SCROLL-LEFT");
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
    /*
      Circle gestrue will be used for scrolling by default.
    */
    Scene.prototype.onCircle = function(event){
      if(event.circleId !== this.triggeredCircleId){
        var $element = $(document.elementFromPoint(event.x,event.y));
        var $tmpEm = this.elementForCirlceSelect && this.elementForCirlceSelect.bind(this)($element);
        if($tmpEm && event.radius <= 7){
          graphicalTipsManager.display("SMALL-CIRCLE-CLICK");
          this.onSelected.bind(this)($tmpEm);
          this.triggeredCircleId = event.circleId;
        }
      }
      return;

      /* TODO.Eric Remove below logic later */ 
      // var ori;
      // if(this.getScrollObject){
      //   var tmpCache = this.getScrollObject(event.x,event.y);
      //   if(!tmpCache){
      //     return;
      //   }
      //   this.scrollObject = tmpCache.object;
      //   this.scrollDirection = tmpCache.direction || "vetical";
      // }
      // if(this.scrollDirection === "vetical"){
      //   ori = this.scrollObject.scrollTop;
      //   if(event.clockwise){
      //     this.scrollObject.scrollTop += this.scrollPace + event.radius * 0.2;
      //     if(event.numOfPointable >= 4){
      //       if(this.scrollObject.scrollTop === ori){
      //         this.scrollObject.scrollTop = 0;  
      //       }  
      //     }
      //   }else{
      //     this.scrollObject.scrollTop -= this.scrollPace + event.radius * 0.2;
      //     if(event.numOfPointable >= 4){
      //       if(this.scrollObject.scrollTop === 0){
      //         this.scrollObject.scrollTop = this.scrollObject.scrollHeight;
      //       }  
      //     }
      //   }
      // }else{
      //   ori = this.scrollObject.scrollLeft;
      //   if(event.clockwise){
      //     this.scrollObject.scrollLeft += this.scrollPace + event.radius * 0.2;
      //     if(event.numOfPointable >= 4){
      //       if(this.scrollObject.scrollLeft === ori){
      //         this.scrollObject.scrollLeft = 0;  
      //       }  
      //     }
      //   }else{
      //     this.scrollObject.scrollLeft -= this.scrollPace + event.radius * 0.2;
      //     if(event.numOfPointable >= 4){
      //       if(this.scrollObject.scrollLeft === 0){
      //         this.scrollObject.scrollLeft = this.scrollObject.scrollWidth;
      //       }  
      //     }
      //   }
      // }
    }

    /*
      Stub method, do nothing if not overwritten by child
    */
    Scene.prototype.onHorizontalSwipe = function(event){
    }
    Scene.prototype.onVerticalSwipe = function(event){
    }    

    Scene.prototype.onKeyTap = function(event){
    }

    Scene.prototype.onHelpAppear = function(event){
    }    

    /*
      Define the pointer(cursor) object
    */
    Scene.prototype.pointer = (function(){
      var center = {x:27,y:27};
      var canvasEm = document.getElementById("pointer");
      var baseRadius = 19;

      /*
        Init the pointer.
      */
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
        }else{
          console.debug("no event----");
        }

      };

      /*Clean and redraw the pointer*/
      var refresh = function(event){
        var ctx = canvasEm.getContext("2d");
        ctx.clearRect(0,0,center.x * 2,center.y*2);
        init(event);
      };

      /*Initialize the pointer with different color before start the selecttion animation*/
      var initSelect = function(){
        var ctx = canvasEm.getContext("2d");
        ctx.clearRect(0,0,center.x * 2,center.y*2);
        init(null,"#0066ff");
      };

      /*
        timer used to control the selection animation, will be cleared in method "stopSelectAnimation"
      */
      var timer;

      /*
        Implement a clock count down animation
      */
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
      var moveTo = function(event){
        if(canvasEm.style.display === "none"){
          //Show the pointer(with finger) asap when switch from a pointer-disable scene to a pointer-enable scene
          appear(event); 
        }
        canvasEm.style.left = event.x - center.x + "px";
        canvasEm.style.top = event.y - center.y + "px";    
      }
      var adjustPostion = function(x,y){
        canvasEm.style.left = $(canvasEm).position().left + x + "px";
        canvasEm.style.top = $(canvasEm).position().top + y + "px"
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
        moveTo:moveTo,
        adjustPostion:adjustPostion
      }
    })();
  };


  /* 
    Method to create the main scene, that is, the catalog main page
      Circling(clockwise) -  scroll right
      Circling(counter clockwise) -  scroll left
      Point at the thumb image and hold to select product
  */
  var createAppMainScene = function($){
    var stub = new Scene({
                          name:sceneExport.SCENES.APP_MAIN_SCENE,

                          elementForCirlceSelect: function($element){
                            var outsideElement = $element.parent().parent();
                            if(outsideElement.hasClass("item thumb")){
                              return outsideElement.find("a img");
                            }else if(outsideElement.parent().hasClass("item thumb")){
                              return $element;
                            }else{
                              return undefined;
                            }
                          },
                          scrollPace: 1,
                          onSelected: function($selectedElement){
                            tutorialManager.hideTips();
                            $selectedElement.click();
                          },
                          onHover: function($selectedElement){
                            $selectedElement.parent().parent().parent().addClass('fakehover');
                          },
                          offHover: function($selectedElement){
                            $selectedElement.parent().parent().parent().removeClass('fakehover');
                          },                                                    
                          
                        });
    stub.onExit = function(){
      // this.pointer.stopSelectAnimation();
      this.selecting = false;
      this.selectedElement = undefined;
    }

    stub.getTipClass = function(){
      return "short";
    }
    stub.getTips = function(){
      return "<strong>Twirl fingertip</strong> within prodcut image to open\
              <br>\
              <strong>Move cursor</strong> to edge of screen to scroll"
    }  

    stub.init = function(){
      /*Reserve for any Initialization logic*/
    }

    /*
      The scrolling function in the website template is a little bit complicated, to avoid breaking any it's logic,
      we simulate the mouse scroll event to trigger the scrolling, instead of scrolling the reel directly.
    */

    stub.scrollByPosition = function(event){
      var offset =0 ;
      var relativePostionX = event.x/window.innerWidth;

      if(relativePostionX > 0.7){
        offset = this.scrollPace + (relativePostionX - 0.7) * 5;
        graphicalTipsManager.display("SCROLL-RIGHT");
      }else if(relativePostionX < 0.3){
        offset = -1 * (this.scrollPace + (0.3 - relativePostionX) * 5);
        graphicalTipsManager.display("SCROLL-LEFT");
      }
      if(offset !== 0)
        document.getElementById("reel").dispatchEvent(createScrollEvent(offset));  
    }   

    /*
      Simulate the dom scroll event
    */
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
    Method to create the product popup scene. Below gestures are supported in this scene
     Circling(clockwise) -  scroll down
     Circling(counter clockwise) -  scroll up
     Point at the navigation button hold to navigate between products.
     Point at the product image(if it is static) hold to start the 3d model
     Horizontally swipe to exit the page
  */
  var createProductScene = function($){
    var stub = new Scene({
                          name:sceneExport.SCENES.PRODUCT_SCENE,
                          elementForCirlceSelect: function($element){
                            if($element.parent().hasClass("sketchimg")){
                                return $element;
                            }else{
                                return undefined;
                            }
                          },
                          elementForTimerSelect: function($element){
                            if($element.hasClass("nav-next") || 
                                     $element.hasClass("nav-previous") || 
                                     $element.hasClass("viewbutton")
                                     ){
                              return $element;
                            }else{
                              return undefined;
                            }
                          },
                          onSelected: function($selectedElement){
                            if($selectedElement){
                              if($selectedElement.parent().hasClass("sketchimg")){
                                $selectedElement.click();
                              }else{
                                $selectedElement.click();
                              }
                            }
                          },
                          
                          getScrollObject: function(){
                            return {object:$(".custom-poptrox-popup .popupContent")[0]}
                          },
                          onHover: function($selectedElement){
                            if($selectedElement.parent().hasClass("sketchimg")){
                              $selectedElement.parent().addClass('fakehover');  
                            }else{
                              $selectedElement.addClass('fakehover');
                            }
                          },
                          offHover: function($selectedElement){
                            if($selectedElement.parent().hasClass("sketchimg")){
                              $selectedElement.parent().removeClass('fakehover');  
                            }else{
                              $selectedElement.removeClass('fakehover');
                            }
                          }                         
                        });
    stub.onHorizontalSwipe = function(event){
      $("html > div").click();
    };

    stub.onExit = function(){
      // this.pointer.stopSelectAnimation();
      this.selecting = false;
      this.selectedElement = undefined;
    }
    stub.init = function(){
      /*Reserve for any Initialization logic*/
    }

    stub.getTipClass = function(){
      return "long";
    }
    stub.getTips = function(){
      return "<strong>Point At</strong> the navigation button to view 3d model &nbsp;&nbsp;\
              <strong>Horizontal Swipe</strong> to escape"
    }  
    return stub;
  };

  var createSketchFabScene = function($){
    var stub = new Scene({
                          name:sceneExport.SCENES.SKETCHFAB_SCENE,
                          supportPointer: false         
                        });
    stub.onHorizontalSwipe = function(event){
      $(".nav-previous").click();
    };

    stub.onExit = function(){
      this.selecting = false;
      this.selectedElement = undefined;
    }
    stub.init = function(){
      this.pointer.disappear()
      /*Reserve for any Initialization logic*/
    }

    stub.getTipClass = function(){
      return "long";
    }
    stub.getTips = function(){
      return "<strong>Horizontal Swipe</strong> to escape"
    }  
    return stub;
  };