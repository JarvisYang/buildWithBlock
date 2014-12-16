var GameScene = cc.Scene.extend({
    blocks:[],
    size:{},
    isStart:false,
    isRuning:false,
    isEnd:false,
    moveSpeed:1,
    RIGHT :1,
    LEFT:-1,
    blockHeight:80,
    stopHeight:0,
    blocksHeader:-1,
    needRemoveBlock:false,
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
        console.log(this);
        this._super();
        this.addChild(this.bgLayer);
        var  obj = this;
        cc.eventManager.addListener({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan:function(touch, event){
                if(obj.isRuning){
                    var block = obj.blocks[obj.blocksHeader];
                    if(block.canTouch){
                        obj.blockMoveDown(block);
                    }
                }
                return true;
            },
            onTouchEnded:function(touch, event){
                if(!obj.isStart){
                    obj.gameStart();
                    obj.isStart = true;
                }
            }
        },this);
    },
    gameStart:function(){
        console.log("gameStart");
        this.isRuning = true;
        this.addBlock();
        this.schedule(this.gameRun,0.002);
    },
    gameRun:function(){
        console.log("gameRun");
        var runningBlock = this.blocks[this.blocksHeader];
        if(runningBlock.canTouch){
            if(runningBlock.actionHorizon.isDone()){
                this.blockMoveDown(runningBlock);
            }
        }
        else if(runningBlock.actionMoveDown.isDone()){
            runningBlock.stopAction(runningBlock.actionMoveDown);
            this.removeBlock();
        }
    },
    blockMoveDown:function(block){
        console.log("blockMoveDown");
        block.canTouch = false;
        block.stopAction(block.actionHorizon);
        var actionMoveDown = cc.moveTo(0.6,cc.p(block.x,this.stopHeight)).easing(cc.easeOut(0.4));
        block.actionMoveDown = actionMoveDown;
        block.runAction(actionMoveDown);
    },
    addBlock:function(){
        console.log("addBlock");
        var block = new cc.Sprite(res.block);
        var randomWidth = cc.randomMinus1To1();
        var blockWidth = 250 + randomWidth*80;
        var blockY = this.size.height - 100;

        //init the new block
        block.moveDir = randomWidth > 0?this.RIGHT:this.LEFT;

        block.attr({
            height:this.blockHeight,
            width:blockWidth,
            y:blockY,
            x:block.moveDir > 0?-blockWidth:this.size.width,
            anchorX:0,
            anchorY:0
        });
        block.canTouch = true;
        block.setVertexRect(cc.rect(0,0,block.width,this.blockHeight));

        //add action
        var moveToPoint = cc.p(block.moveDir == this.RIGHT?this.size.width - blockWidth:0,blockY);
        var actionHorizon = cc.moveTo(0.8,moveToPoint ).speed(this.moveSpeed);
        this.moveSpeed *= 1.02;
        block.actionHorizon = actionHorizon;
        block.runAction(actionHorizon);

        //push the new block into blocks
        this.blocks.push(block);
        this.bgLayer.addChild(block);
        this.blocksHeader++;
        if(!this.needRemoveBlock && this.blocksHeader >= 2){
            this.needRemoveBlock = true;
        }
    },
    removeBlock:function(){
        console.log("removeBlock");
        this.unscheduleAllCallbacks();
        if(this.needRemoveBlock){
            var obj = this;
            for(var i = 0 ; i < 3 ; i++){
                (function(i){
                    var block = obj.blocks[obj.blocksHeader - i];
                    var action = cc.moveTo(0.2,cc.p(block.x,block.y - obj.blockHeight)).easing(cc.easeOut(0.5));
                    block.removeAction = action;
                    block.runAction(block.removeAction);
                }).call(this,i);
            }
            setTimeout(function(){
                if(obj.blocks[obj.blocksHeader].removeAction.isDone()
                    && obj.blocks[obj.blocksHeader - 1].removeAction.isDone()
                    && obj.blocks[obj.blocksHeader - 2].removeAction.isDone()){
                    var objBlocksHeader = obj.blocksHeader;
                    var objBlocks = obj.blocks;
                    objBlocks[objBlocksHeader - 2].removeFromParent();
                    objBlocks[objBlocksHeader - 2] = null;
                    obj.stopHeight = objBlocks[objBlocksHeader].y + obj.blockHeight;
                    obj.addBlock();
                    obj.schedule(obj.gameRun,0.002);
                }
            },300);
        }
        else{
            this.stopHeight = this.blocks[this.blocksHeader].y + this.blockHeight;
            this.addBlock();
            this.schedule(this.gameRun,0.002);
        }
    }
});