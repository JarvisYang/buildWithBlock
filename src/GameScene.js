var GameScene = cc.Scene.extend({
    blocks:[],
    size:{},
    isStart:false,
    isRuning:false,
    isEnd:false,
    moveSpeed:1,
    RIGHT :1,
    LEFT:-1,
    blockHeight:30,
    groundHeight:25,
    stopHeight:0,
    blocksHeader:-1,
    needRemoveBlock:false,
    blocksShowNum:6,
    startHeight:0,
    randomHeight:0,
    gravity:-2000,
    bottomSprite:null,
    space:null,
    walls:[],
    physics:null,
    blockStaticShape:[],
    ctor:function(){
        this._super();

        this.size = cc.winSize;
        this.width = this.size.width;
        this.height = this.size.height;
        this.x = 0;
        this.y = 0; 

        this.stopHeight = this.groundHeight + this.blockHeight/2.0

        this.bgLayer = new cc.Sprite(res.gameBg,cc.rect(0,0,this.size.width,this.size.height));
        this.bgLayer.attr({
            x:this.size.width/2,
            y:this.size.height/2,
            width:this.size.width,
            height:this.size.height,
            ignoreAnchorPointForPosition: false
        });

        this.gameLayer = new cc.Layer();
        this.gameLayer.attr({
            x:0,
            y:0,
            width:this.size.width,
            height:this.size.height
        });

        this.bottomSprite = new cc.Sprite(res.gameBottom,cc.rect(0,0,this.size.width,this.groundHeight + 7));
        this.bottomSprite.attr({
            x:0,
            y:0,
            width:this.size.width,
            height:this.stopHeight,
            anchorX:0,
            anchorY: 0
        });

        this.scoreBar = new cc.Sprite(res.scoreBar,cc.rect(0,0,259,35));
        this.scoreBar.attr({
            x:this.size.width/2,
            y:this.size.height - 80
        });

        this.scoreLabel = new cc.LabelTTF("0","",30,"");
        this.scoreLabel.attr({
            x:this.scoreBar.width/2,
            y:this.scoreBar.height/2,
            color:cc.color(255,255,255)
        });

        this.scoreBar.addChild(this.scoreLabel);

        this.initPhysics();

        this.addChild(this.bgLayer,1);
        this.addChild(this.scoreBar,2);
        this.addChild(this.gameLayer,3);
        this.addChild(this.bottomSprite,4);
    },
    onEnter:function(){
        this._super();
        this.scoreLabel.string = 0;
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
//                        var target = event.getCurrentTarget();
//                        var locationInNode = target.convertToNodeSpace(touch.getLocation());
//                        var rect = cc.rect(block.x - 30, block.y - 20 , block.width + 60, block.height + 40);
//                        if (cc.rectContainsPoint(rect, locationInNode)) {
                            console.log("TOUCH");
                            if(obj.isGameover()){
                                obj.addPhysicsBlock();
                            }
                            else{
                                obj.blockMoveDown(block);
                            }
                            return true;
//                        }
//                        return false;
                    }
                }
                return true;
            }
        },this);
    },
    initPhysics:function(){
        var elasticity = 0.5;
        var friction = 100;
        this.space = new cp.Space();
        this.space.gravity = cp.v(0,this.gravity);
        this.space.damping = 2;

        this.CPgroundShape = new cp.SegmentShape(this.space.staticBody,
                                    cp.v(0,0),cp.v(this.size.width,0),this.groundHeight);
        this.CPgroundShape.setElasticity(elasticity);
        this.CPgroundShape.setFriction(friction);

        this.bottomSprite.shape = this.CPgroundShape;

        this.walls =    [
                            new cp.SegmentShape(this.space.staticBody,
                                cp.v(0,0),cp.v(0,this.size.height),0),
                            new cp.SegmentShape(this.space.staticBody,
                                cp.v(this.size.width,0),cp.v(this.size.width,this.size.height),0)
                        ];


        this.walls[0].setElasticity(elasticity);
        this.walls[0].setFriction(friction);
        this.walls[1].setElasticity(elasticity);
        this.walls[1].setFriction(friction);

        this.space.addStaticShape(this.CPgroundShape);
        this.space.addStaticShape(this.walls[0]);
        this.space.addStaticShape(this.walls[1]);

        this._debugNode = new cc.PhysicsDebugNode(this.space);
        this.addChild(this._debugNode, 10);
    },
    gameStart:function(){
        console.log("gameStart");
        this.isRuning = true;
        this.addBlock();
        this.scheduleUpdate();
        // this.schedule(this.gameRun,0.002);
    },
    update:function(dt){
        this.space.step(dt);
        var runningBlock = this.blocks[this.blocksHeader];
        //console.log("gameRun",runningBlock.canTouch);
        switch(true){
            case this.isRuning:
                if(runningBlock.canTouch){
                    if(runningBlock.actionHorizon.isDone()){
                        if(this.isGameover()){
                            this.addPhysicsBlock();
                        }
                        else{
                            this.blockMoveDown(runningBlock);
                        }
                    }
                }
                else if(runningBlock.actionMoveDown.isDone()){
                        this.scoreLabel.string = this.blocksHeader + 1;
                        this.removeBlock();
                }
                break;
            case this.isEnd:
                break;
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
        var randomWidth = cc.randomMinus1To1();
        var blockWidth = 100 + randomWidth*30;
        var block = null;
        switch(true){
            case blockWidth < 90:
                block = new cc.Sprite(res.block1);
                break;
            case blockWidth < 110:
                block = new cc.Sprite(res.block2);
                break;
            default :
                block = new cc.Sprite(res.block3);
                break;
        }

        if(!this.needRemoveBlock){
            this.startHeight = this.stopHeight + this.blockHeight + 100;
            this.randomHeight = this.size.height - this.blockHeight*2 - this.stopHeight - 130;
        }

        var blockY = this.startHeight + this.randomHeight*cc.random0To1();
        block.moveDir = cc.randomMinus1To1() > 0?this.RIGHT:this.LEFT;

        block.attr({
            height:this.blockHeight,
            width:blockWidth,
            y:blockY,
            x:block.moveDir > 0?-blockWidth/2:this.size.width + blockWidth/2,
            anchorX:0.5,
            anchorY:0.5
        });
        block.canTouch = true;
        block.setVertexRect(cc.rect(0,0,block.width,this.blockHeight));

        //add action
        var moveToPoint = cc.p(block.moveDir == this.RIGHT?this.size.width - blockWidth/2:blockWidth/2,blockY);
        var actionHorizon = cc.moveTo(0.8,moveToPoint ).speed(this.moveSpeed);
        this.moveSpeed *= 1.02;
        block.actionHorizon = actionHorizon;
        block.runAction(actionHorizon);

        //push the new block into blocks
        this.blocks.push(block);
        this.gameLayer.addChild(block);
        this.blocksHeader++;
        if(!this.needRemoveBlock && this.blocksHeader >= this.blocksShowNum){
            this.needRemoveBlock = true;
        }
    },
    addPhysicsBlock:function(){
        console.log("addPhysicsBlock")

        var block = this.blocks[this.blocksHeader];
        var width = block.width;
        var elasticity = 0;
        var friction = 10;
        switch(true){
            case width < 90:
                this.physicsBlock = new cc.PhysicsSprite(res.block1);
                break;
            case width < 110:
                this.physicsBlock = new cc.PhysicsSprite(res.block2);
                break;
            default :
                this.physicsBlock = new cc.PhysicsSprite(res.block3);
                break;
        }

        this.physicsBlock.attr({
            height:this.blockHeight,
            width:width,
            // y:blockY,
            // x:block.moveDir > 0?-blockWidth:this.size.width,
            anchorX:0.5,
            anchorY:0.5
        });

        this.physicsBlock.body = new cp.Body(width,cp.momentForBox(width,width,this.blockHeight));
        this.physicsBlock.body.setPos(cc.p(block.x,block.y));
        this.space.addBody(this.physicsBlock.body);
        this.physicsBlock.shape = new cp.BoxShape(this.physicsBlock.body,width,this.blockHeight);
        this.physicsBlock.shape.setElasticity(elasticity);
        this.physicsBlock.shape.setFriction(friction);
        this.space.addShape(this.physicsBlock.shape);
        this.physicsBlock.setBody(this.physicsBlock.body);
        this.physicsBlock.setVertexRect(cc.rect(0,0,this.physicsBlock.width,this.blockHeight));

        this.gameLayer.removeChild(this.blocks[this.blocksHeader]);
        this.blocks.pop();
        this.blocksHeader--;
        this.setBlockStaticShape();
        this.gameLayer.addChild(this.physicsBlock);


    },
    setBlockStaticShape:function(){
        for(var i = this.blocksHeader; i >= 0 && this.blocks[i] !== null; i--){
            (function(i){
                var block = this.blocks[i];
                var width = block.width;
                var y = block.y - this.blockHeight/2;
                var x = block.x - width/2;

                var shape = new cp.SegmentShape(this.space.staticBody,
                                cp.v(x,y),cp.v(x + width,y),this.blockHeight);
                this.blockStaticShape.push(shape);
                this.space.addStaticShape(shape);
            }).call(this,i);
        }
    },
    removeBlockStaticShape:function(){
        var length = this.blockStaticShape.length;
        for(var i = 0; i < length; i++){
            (function(i){
                var shape = this.blockStaticShape.pop();
                this.space.removeStaticShape(shape);
            }).call(this,i);
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
                    // obj.schedule(obj.gameRun,0.002);
                    obj.scheduleUpdate();
                }
            },300);
        }
        else{
            this.stopHeight = this.blocks[this.blocksHeader].y + this.blockHeight;
            this.addBlock();
            // this.schedule(this.gameRun,0.002);
            this.scheduleUpdate();
        }
    },
    isGameover:function(){
        console.log("isGameover");
        var blockFirst = this.blocks[this.blocksHeader];
        var blockSecond = this.blocks[this.blocksHeader - 1];
        if(!this.blocksHeader){
            return false;
        }
        if(Math.abs(blockSecond.x - blockFirst.x) >= Math.abs(blockSecond.width/2)){
             this.isRuning = false;
             this.isEnd = true;
             this.gameOver();
            //console.log("game over");
            return true;
        }
        return false;
    },
    gameOver:function(){
        console.log("gameOver")
        var obj = this;
        setTimeout(function(){
            obj.reset();
            cc.director.runScene(new cc.TransitionFade(1.5, module.startScene,cc.color(255,255,255)) );
        },1500)

    },
    reset:function(){
        var score = this.blocksHeader + 1;
        module.bestScore = module.bestScore < score? score :module.bestScore;
        this.gameLayer.removeAllChildren();
        this.removeBlockStaticShape();
        this.space.removeShape(this.physicsBlock.shape);
        this.space.removeBody(this.physicsBlock.body);
        this.blocks = [];
        this.isStart = false;
        this.isRuning = false;
        this.isEnd = false;
        this.moveSpeed = 1;
        this.stopHeight = this.groundHeight + this.blockHeight/2.0
        this.blocksHeader = -1;
        this.needRemoveBlock = false;
        this.startHeight = 0;
        this.randomHeight = 0;
    }
});