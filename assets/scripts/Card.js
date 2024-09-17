class Card extends Phaser.GameObjects.Sprite {
    constructor(scene,value) { 
        super(scene, 0, 0, 'card');
        this.scene = scene; //создаем ссылку на сцену,
        this.value = value;
        this.scene.add.existing(this); //add created elem to scene 
        this.setInteractive();
        this.opened = false;
    }

    move(param){
        this.scene.tweens.add({
            targets: this,
            x: param.x,
            y: param.y,
            ease: 'Linear',
            delay: param.delay,
            duration: 300,
            onComplete: () => {
                if(param.callback) {
                    param.callback();
                }
            }
        })
    }

    init(position){
        this.position = position;
        this.close();
        this.setPosition(-this.width, -this.height);
    }

    flip(callback) {
        //animation 
        this.scene.tweens.add({
            targets: this,
            scaleX: 0,
            ease: 'Linear',
            duration: 150,
            onComplete: () => {
               this.show(callback);
            }
        })
    }
    show(callback) {
        let param = this.opened ? 'card' + this.value : 'card';
        this.setTexture(param);
        this.scene.tweens.add({
            targets: this,
            scaleX: 1,
            ease: 'Linear',
            duration: 150,
            onComplete: () => {
                if(callback) {
                    callback();
                }
            }
        });
    }
    open(callback) {
        this.opened = true;
        this.flip(callback);
    }
    close() {
        if(this.opened){
            this.opened = false;
            this.flip();
        }
    }
}