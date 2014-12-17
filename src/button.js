//var size = cc.winSize;
var Button = cc.LayerColor.extend({
    outLayer:null,
    menu:null,
    fontSize:40,
    fontColor:cc.color(255,255,255),
    bgColor:[62,165,169],
    bottomBorderWidth:10,
    contentSize:[],
    ctor: function (font) {
        var size = cc.winSize;

        //init menu and get the contentSize
        this.menu = new cc.LabelTTF(font,"",this.fontSize,"");
        this.menu.attr({
            color:this.fontColor
        });
        this.contentSize = {
            width:this.menu._contentSize.width*1.5,
            height:this.menu._contentSize.height*1.5
        };
        this.menu.x = this.contentSize.width/2;
        this.menu.y = this.contentSize.height/2;

        this._super(cc.color(this.bgColor[0] - 20,
                    this.bgColor[1] - 20,
                    this.bgColor[2] - 20),
            this.contentSize.width,
            this.contentSize.height+this.bottomBorderWidth);

        //init outLayer
        this.outLayer  = new  cc.LayerColor(cc.color(this.bgColor[0],this.bgColor[1],this.bgColor[2]),
            this.contentSize.width,
            this.contentSize.height);
        this.outLayer.y = this.bottomBorderWidth;

        //init Botton
        this.width = this.contentSize.width;
        this.height = this.contentSize.height;
        this.x = size.width/2;
        this.y = size.height/2;
        this.ignoreAnchor = false;


        var obj = this;
        cc.eventManager.addListener({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan:function(touch, event){
//                obj.color = cc.color(obj.bgColor[0] - 40,
//                        obj.bgColor[1] - 40,
//                        obj.bgColor[2] - 40);
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var rect = cc.rect(0, 0, target.width, target.height);
                if(cc.rectContainsPoint(rect, locationInNode)){
                    obj.outLayer.color = cc.color(obj.bgColor[0] - 10,
                            obj.bgColor[1] - 10,
                            obj.bgColor[2] - 10);
                    obj.menu.color = cc.color(220,220,220);
                    return true;
                }
                return false;
            },
            onTouchEnded:function(touch, event){
//                obj.color = cc.color(obj.bgColor[0] - 20,
//                        obj.bgColor[1] - 20,
//                        obj.bgColor[2] - 20);

                //module.startScene.alert.string = "touchEnd";
                obj.outLayer.color = cc.color(obj.bgColor[0],
                    obj.bgColor[1],
                    obj.bgColor[2]);
                obj.menu.color = cc.color(255,255,255);

                cc.director.runScene(new cc.TransitionZoomFlipX(0.5, module.gameScene) );
                obj.removeFromParent();

                return true;
            }
        },this);

        this.outLayer.addChild(this.menu);
        this.addChild(this.outLayer);

    }
});

