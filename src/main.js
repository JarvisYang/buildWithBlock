/**
 * Created by jarvis on 12/11/14.
 */
window.onload = function(){
    yw.init({gameId: '10000197', pvEnabled:true});
    cc.game.onStart = function(){
        //load resources
        cc.view.setDesignResolutionSize(500, 800, cc.ResolutionPolicy.SHOW_ALL);
        cc.view.resizeWithBrowserSize(true);
        cc._loaderImage = "./res/loader.jpg";
        cc.LoaderScene.preload(g_resources, function () {
            module.init();
            cc.director.runScene(module.startScene);
        }, this);
    };
    cc.game.run();
};