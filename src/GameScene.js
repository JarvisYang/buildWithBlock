var GameScene = cc.Scene.extend({
    blocks:[],
    size:{},
    isStart:false,
    isRuning:false,
    isEnd:false,
    moveSpeed:1,
    ctor:function(){
        this._super();

        this.size = cc.winSize;
        this.width = this.size.width;
        this.height = this.size.height;
        this.x = 0;
        this.y = 0;

        this.bgLayer = new cc.LayerColor(cc.color(23, 198, 229),this.size.width,this.size.height);
        this.bgLayer.attr({
            x:0,
            y:0,
            ignoreAnchorPointForPosition: false,
            color:cc.color(0, 198, 229)
        });
    },
    onEnter:function(){
        this._super();
        this.addChild(this.bgLayer);
        var  obj = this;
        cc.eventManager.addListener({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan:function(touch, event){
                return true;
            },
            onTouchEnded:function(touch, event){
                console.log("hehe")
                if(!obj.isStart){
                    obj.gameStart();
                    obj.isStart = true;
                }
            }
        },this);
        //this.sceneEnter();
    },
    gameStart:function(){
        this.addBlock();
        this.scheduleUpdate(this.gameRun());
    },
    gameRun:function(){
        var runningBlock = this.blocks[this.blocks[length]];
    },
    addBlock:function(){
        var block = new cc.Sprite(res.block);
        var randomWidth = cc.randomMinus1To1();
        var blockWidth = 250 + randomWidth*80;
        var blockY = this.size.height - 100;
        block.attr({
            height:80,
            width:blockWidth,
            y:blockY,
            x:randomWidth > 0?-blockWidth:this.size.width,
            anchorX:0,
            anchorY:0
        });
        block.canTouch = true;
        block.setVertexRect(cc.rect(0,0,block.width,block.height));

        this.blocks.push(block);
        this.bgLayer.addChild(block);

        var actionHorizon = cc.moveTo(1, cc.p(randomWidth > 0?this.size.width:-blockWidth,blockY)).speed(this.moveSpeed);
        block.runAction(actionHorizon);
    }
});