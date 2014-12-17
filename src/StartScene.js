var StartScene = cc.Scene.extend({
    bgLayer:null,
    winSizeLabel:null,
    menu:null,
    ctor:function(){
        this._super();
        var size = cc.winSize;

        this.width = size.width;
        this.height = size.height;
        this.x = 0;
        this.y = 0;

        this.bgLayer = new cc.Sprite(res.startBg,cc.rect(0,0,size.width,size.height));
        this.bgLayer.attr({
            x:size.width/2,
            y:size.height/2,
            width:size.width,
            height:size.height
        });

        this.startButton = new cc.Sprite(res.startBut);
        this.startButton.attr({
            x:size.width/2,
            y:size.height - 200
        });

        this.addChild(this.bgLayer,0);
        this.addChild(this.startButton);
    },
    onEnter:function(){
        this._super();

        var obj = this;

        cc.eventManager.addListener({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan:function(touch, event){
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var rect = cc.rect(0, 0, target.width, target.height);
                if(cc.rectContainsPoint(rect, locationInNode)){
                    obj.startButton.color = cc.color(255,255,255,50)
                    return true;
                }
                return false;
            },
            onTouchEnded:function(touch, event){
                obj.startButton.color = cc.color(255,255,255,0);
                cc.director.runScene(new cc.TransitionZoomFlipX(0.5, module.gameScene) );

                return true;
            }
        },this.startButton);
    },
    sceneLeave:function(){
        var size = cc.winSize;
        var action = new cc.MoveTo(0.5,cc.p(0,size.height),size.heihgt);
        action.easing(cc.easeOut(0.2));
        this.runAction(action);
    }
});