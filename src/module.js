var module = {
    init:function(){
    	this.bestScore = 0;
        this.score = 0;
        this.startScene = new StartScene();
        this.gameScene = new GameScene();
        this.restartScene = new RestartScene();
    }
};