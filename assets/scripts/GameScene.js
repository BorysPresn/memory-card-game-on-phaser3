class GameScene extends Phaser.Scene {
    constructor() {
        super("Game"); //calls  Phaser.Scene with parameter "Game" like in part 1 of this code
        this.score = 0;
        this.cardsInRow = 0;
        this.currentLevel = 0;
        this.cards = [];
    }
    preload() {
        // 1. загрузить бэкгранд
        this.load.image('bg', 'assets/sprites/background.png');
        this.load.image('card', 'assets/sprites/card.png')
        config.cards.forEach(value => {
            this.load.image('card' + value, 'assets/sprites/card' + value + '.png');
        });

        this.load.audio('theme', 'assets/sounds/theme.mp3');
        this.load.audio('card', 'assets/sounds/card.mp3');
        this.load.audio('success', 'assets/sounds/success.mp3');
        this.load.audio('timeout', 'assets/sounds/timeout.mp3');
        this.load.audio('complete', 'assets/sounds/complete.mp3');
    }

    create() {
        this.timeout = config.timeout;
        this.createSounds();
        this.createTimer();
        this.createBackground();
        // this.createCards();
        this.createText()
        this.start();
        // console.log(this);
    }
    restart() {
        let count = 0;
        let onCardMoveComplete = () => {
            ++count;
            if(count >= this.cards.length) {
                this.start();
            }
        }
        this.cards.forEach(card => {
            card.move({
                x: this.sys.game.config.width + card.width,
                y: -card.height,
                delay: card.position.delay,
                callback: onCardMoveComplete
            });
        });
    }
    start() {
        this.createCards();
        this.initCardPositions();
        this.timeout = config.levels[this.currentLevel].timeout;
        this.openedCard = null;
        this.openedCardsCount = 0;
        this.timer.paused = false;
        this.initCards();
        this.showCards();
        this.levelText.setText('Level: ' + (this.currentLevel + 1));
    }
    showCards() {
        this.cards.forEach(card => {
            card.depth = card.position.delay;
            card.move({
                x: card.position.x,
                y: card.position.y,
                delay: card.position.delay
            });
        });
    }
    createSounds() {
        this.sounds = {                         //creating obj "sounds"  in SCENE to get acces from any part of code
            card: this.sound.add('card'),      //"this.sound" - WebAudioSoundManager
            theme: this.sound.add('theme'),
            success: this.sound.add('success'),
            timeout: this.sound.add('timeout'),
            complete: this.sound.add('complete'),
        };

        this.sounds.theme.play({
            volume: 0.05,
            loop: true
        });
    }
    createTimer() {
        this.timer = this.time.addEvent({
            delay: 1000,
            callback: this.onTimerTick,
            callbackScope: this,
            loop: true
        });
    }
    onTimerTick() {
        this.timeoutText.setText('Time: ' + this.timeout);
        if (this.timeout <= 0) {
            this.timer.paused = true;
            this.sounds.timeout.play({volume: 0.5});
            this.restart();
        } else {
            --this.timeout;
        }
    }
    createText() {
        // let textOffsetX = ((this.sys.game.config.width - cardWidth * config.cols) / 2 + cardWidth / 2) - 
        let textOffsetY = (this.sys.game.config.height / 2) - 32; //32 - font size 2 rem
        this.timeoutText = this.add.text(20, textOffsetY + 48, 'Time: ', config.text);
        this.scoreText = this.add.text(20, textOffsetY-30, 'Score: \n0', config.text);
        this.levelText = this.add.text(20, textOffsetY-68, 'Level: ', config.text);
    }
    
    initCards() {
        let positions = Phaser.Utils.Array.Shuffle(this.positions);

        this.cards.forEach(card => {
            card.init(positions.pop())
        })
    }

    createBackground() {
        this.add.sprite(0, 0, 'bg').setOrigin(0, 0);
    }

    createCards(){
        this.cards.forEach(card => card.destroy());
        this.cards = [];
        let cards = config.cards.slice(0, (config.levels[this.currentLevel].cardsPairs));
        for( let value of cards) {
            for (let i = 0; i < 2; i++){
                this.cards.push(new Card(this, value)) //pass "this" as a parameter and position to class Card
            }
        }
        this.input.on("gameobjectdown", this.onCardClicked, this);
    }

    // pointer has an info of input (coordinates of click, etc.)
    // card is an object, with wich interaction occured
    // Phaser contains an input manager (Phaser.Input.InputManager) that handles all user interactions.
    // When you click on the screen or click the mouse, the input manager processes this input and determines which 
    // game object was clicked.
    // So, this 2 params has been returned by input manager
    
    onCardClicked(pointer, card) {
        if(card.opened) {
            return false;
        }

        this.sounds.card.play({volume: 0.5});

        if(this.openedCard){                            //if we already have opened card we need to check them
            if(this.openedCard.value === card.value){   //if they match - set opened card null, it lives that cards opened
                this.sounds.success.play({volume: 0.5});   
                this.openedCard = null;
                ++this.openedCardsCount;
                this.score += config.cardsInRowPoints[this.cardsInRow];
                ++this.cardsInRow;
                this.scoreText.setText('Score: \n' + this.score)
            } else {
                this.openedCard.close();                // if they doesn't match - we close opened card
                this.openedCard = card;  
                this.cardsInRow = 0;               
            }
        } else {
            this.openedCard = card;                     //and if we don't already have an opened card - assign 
        }

        card.open(() => {
            if (this.openedCardsCount === this.cards.length / 2) {
                if(this.currentLevel < config.levels.length-1){
                    ++this.currentLevel;
                }
                this.sounds.complete.play({volume: 0.5});
                this.restart();
            }
        });
    }

    initCardPositions() {
        let positions = [];
        let cols = config.levels[this.currentLevel].cardsPairs;
        //getting card element from SCENE -> TEXTURES. It has params width & height like usual <img>
        let cardTexture = this.textures.get('card').getSourceImage();  
        
        //getting card params with margin
        let cardWidth = cardTexture.width + 5;
        let cardHeight = cardTexture.height + 5;
    
        //calculating margins form page edges
        let offsetX = (this.sys.game.config.width - cardWidth * cols) / 2 + cardWidth / 2;
        let offsetY = (this.sys.game.config.height - cardHeight * config.rows) / 2 + cardHeight / 2;

        for( let row = 0; row < config.rows; row++){
            for(let col = 0; col < cols; col++){
                positions.push({
                    delay: row * col * 100,
                    x: offsetX + col * cardWidth,
                    y: offsetY + row * cardHeight,
                })
            }
        }
        this.positions = positions;
    }
}
 