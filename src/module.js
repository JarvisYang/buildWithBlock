var module = {
    init:function(){
        this.startScene = new StartScene();
        this.gameScene = new GameScene();
        this.restartScene = new RestartScene();
        this.bestScore = 0;
    }
};