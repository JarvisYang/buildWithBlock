var GameScene = cc.Scene.extend({
    blocks:[],
    size:{},
    isStart:false,
    isRuning:false,
    isEnd:false,
    moveSpeed:1,
    RIGHT :1,
    LEFT:-1,
    blockHeight:50,
    stopHeight:100,
    blocksHeader:-1,
    needRemoveBlock:false,
    blocksShowNum:2,
    startHeight:0,
    randomHeight:0,
    ctor:function(){
        this._super();

        this.size = cc.winSize;
        this.width = this.size.width;
        this.height = this.size.height;
        this.x = 0;
        this.y = 0;

        this.bgLayer = new cc.Sprite(res.gameBg,cc.rect(0,0,this.size.width,this.size.height));
        this.bgLayer.attr({
            x:this.size.width/2,
            y:this.size.height/2,
            width:this.size.width,
            height:this.size.height,
            ignoreAnchorPointForPosition: false,
            color:cc.color(103, 170, 222)
        });

        this.bottomSprite = new cc.Sprite(res.gameBottom,cc.rect(0,0,this.size.width,this.stopHeight));
        this.bottomSprite.attr({
            x:0,
            y:0,
            width:this.size.width,
            height:this.stopHeight,
            anchorX:0,
            anchorY: 0
        });

        this.addChild(this.bgLayer);
        this.addChild(this.bottomSprite);
    },
    onEnter:function(){
        this._super();
        var  obj = this;
        if(!this.isStart){
            setTimeout(function(){
                obj.gameStart();
            },800);
            this.isStart = true;
        }
        cc.eventManager.addListener({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan:function(touch, event){
                if(obj.isRuning){
                    var block = obj.blocks[obj.blocksHeader];
                    if(block.canTouch) {
                        var target = event.getCurrentTarget();
                        var locationInNode = target.convertToNodeSpace(touch.getLocation());
                        var rect = cc.rect(block.x - 20, block.y - 10 , block.width + 40, block.height + 20);
                        if (cc.rectContainsPoint(rect, locationInNode)) {
                            obj.blockMoveDown(block);
                            return true;
                        }
                        return false;
                    }
                }
                return true;
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

        var runningBlock = this.blocks[this.blocksHeader];
        console.log("gameRun",runningBlock.canTouch);
        if(runningBlock.canTouch){
            if(runningBlock.actionHorizon.isDone()){
                this.blockMoveDown(runningBlock);
            }
        }
        else if(runningBlock.actionMoveDown.isDone()){
            runningBlock.stopAction(runningBlock.actionMoveDown);
            if(!this.isGameover()){
                this.removeBlock();
            }
        }
    },
    blockMoveDown:function(block){
        console.log("blockMoveDown");
        block.canTouch = false;
        block.stopAction(block.actionHorizon);
        var actionMoveDown = cc.moveTo(block.y/(this.size.height - this.stopHeight)* 0.5,cc.p(block.x,this.stopHeight)).easing(cc.easeOut(0.4));
        block.actionMoveDown = actionMoveDown;
        block.runAction(actionMoveDown);
    },
    addBlock:function(){
        console.log("addBlock");

        //init the new block
        var block = new cc.Sprite(res.block);
        var randomWidth = cc.randomMinus1To1();
        var blockWidth = 150 + randomWidth*60;

        if(!this.needRemoveBlock){
            this.startHeight = this.stopHeight + this.blockHeight + 100;
            this.randomHeight = this.size.height - this.blockHeight*2 - this.stopHeight - 100;
        }

        var blockY = this.startHeight + this.randomHeight*cc.random0To1();
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
        if(!this.needRemoveBlock && this.blocksHeader >= this.blocksShowNum){
            this.needRemoveBlock = true;
        }
    },
    removeBlock:function(){
        console.log("removeBlock");
        this.unscheduleAllCallbacks();
        if(this.needRemoveBlock){
            var obj = this;
            for(var i = 0 ; i <= obj.blocksShowNum ; i++){
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
                    objBlocks[objBlocksHeader - obj.blocksShowNum].removeFromParent();
                    objBlocks[objBlocksHeader - obj.blocksShowNum] = null;
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
    },
    isGameover:function(){
        console.log("isGameover");
        var blockFirst = this.blocks[this.blocksHeader];
        var blockSecond = this.blocks[this.blocksHeader - 1];
        if(!this.blocksHeader){
            return false;
        }
        if((blockFirst.x + blockFirst.width) <= blockSecond.x
            || blockFirst.x >= (blockSecond.x + blockSecond.width)){
            this.unscheduleAllCallbacks();
            this.gameOver();
            console.log("game over");
            return true;
        }
        return false;
    },
    gameOver:function(){
        this.bgLayer.removeAllChildren();
        this.blocks = [];
        this.isStart = false;
        this.isRuning = false;
        this.isEnd = false;
        this.moveSpeed = 1;
        this.stopHeight = 100;
        this.blocksHeader = -1;
        this.needRemoveBlock = false;
        this.startHeight = 0;
        this.randomHeight = 0;
        cc.director.runScene(new cc.TransitionFade(0.5, module.startScene,cc.color(255,255,255)) )
    }
});