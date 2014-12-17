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

        this.bgLayer = new cc.LayerColor(cc.color(82, 186, 131),size.width,size.height);
        this.bgLayer.attr({
            x:0,
            y:0
        });

        this.alert = new cc.LabelTTF("he","",30);
        this.alert.attr({
            x:0,
            y:size.height,
            anchorX:0,
            anchorY:1,
            color:cc.color(255,255,255)
        });

        this.addChild(this.bgLayer,0);
        this.addChild(this.alert);
    },
    onEnter:function(){
        this._super();
        this.addChild(module.startButton);
    },
    sceneLeave:function(){
        var size = cc.winSize;
        var action = new cc.MoveTo(0.5,cc.p(0,size.height),size.heihgt);
        action.easing(cc.easeOut(0.2));
        this.runAction(action);
    }
});