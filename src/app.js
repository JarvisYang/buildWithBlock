/**
 * Created by jarvis on 12/11/14.
 */
var MyScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var size = cc.director.getWinSize();
//        var sprite = cc.Sprite.create(res.bg_jpg);
//        sprite.attr({
//            x:0,
//            y:0
//        })
////        sprite.setPosition(0,0);
//        sprite.setScale(0.1);
//        this.addChild(sprite, 0);

        this.sprite = cc.Sprite.create(res.bg_jpg);
        this.sprite.setPosition(size.width / 2, size.height / 2);
        this.sprite.setScale(0.5);
        this.sprite.setRotation(180);
        var rotateToA = cc.RotateTo.create(2, 0);
        var scaleToA = cc.ScaleTo.create(2, 1, 1);
        this.sprite.runAction(rotateToA);
        this.sprite.runAction(scaleToA);
        //this.sprite.runAction(cc.Sequence.create(rotateToA, scaleToA));
        this.addChild(this.sprite, 0);

        var label = cc.LabelTTF.create("Hello World", "Arial", 40);
        label.setPosition(size.width / 2, size.height / 2);
        this.addChild(label, 1);
    }
});
