var RestartScene = cc.Scene.extend({
	bgSprite:null,
    ctor:function(){
    	this._super();
    	this.size = cc.winSize;

    	this.bgSprite = new cc.Sprite(res.restartBg);
    	this.bgSprite.attr({
    		x:this.size.width/2,
    		y:this.size.height/2,
    		width:this.size.width,
    		height:this.size.height
    	});

    	this.restartBut = new cc.Sprite(res.restartBut);
    	this.restartBut.attr({
    		width:90,
    		height:81,
    		x:this.size.width/2 -90,
    		y:this.size.height/2 - 81
    	});

    	this.shareBut = new cc.Sprite(res.shareBut);
    	this.shareBut.attr({
    		width:90,
    		height:81,
    		x:this.size.width/2 + 90,
    		y:this.size.height/2 - 81
    	});

    	this.scoreLabel = new cc.LabelTTF(module.score.toString(),"Papyrus",60,"");
        this.scoreLabel.attr({
            x:this.size.width/2,
            y:this.size.height/2 + 80,
            color:cc.color(0,0,0),
            lineWidth:1
        });

        this.bestScoreLabel = new cc.LabelTTF("BEST : "+module.bestScore,"Papyrus",30,"");
        this.bestScoreLabel.attr({
            x:this.size.width/2,
            y:this.size.height/2 + 20,
            color:cc.color(0,0,0),
            lineWidth:1
        });

    	this.addChild(this.bgSprite);
    	this.addChild(this.restartBut,1);
    	this.addChild(this.shareBut,1);
    	this.addChild(this.scoreLabel,1);
    	this.addChild(this.bestScoreLabel,1);
    },
    onEnter:function(){
    	this._super();

    	this.scoreLabel.string     = module.score.toString();
    	this.bestScoreLabel.string = "BEST : "+module.bestScore;

    	cc.eventManager.addListener({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan:function(touch, event){
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var rect = cc.rect(0, 0, target.width, target.height);
                if(cc.rectContainsPoint(rect, locationInNode)){
                    return true;
                }
                return false;
            },
            onTouchEnded:function(touch, event){
                cc.director.runScene(new cc.TransitionZoomFlipX(0.5, module.gameScene) );

                return true;
            }
        },this.restartBut);
    }
});
