let config = {
    type: Phaser.AUTO, // webgl or canvas
    width: 1280,
    height: 720,
    rows: 2,
    cols: 5,
    cards: [1, 2, 3, 4, 5],
    cardsInRowPoints: [100, 250, 500, 1000, 5000],
    timeout: 30,
    text: {
        fontFamily: 'CurseCasual',
        fontSize: '2rem',
        fontStyle: 'bold'
    },
    levels: [
        {
            cardsPairs: 2,
            timeout: 15
        },
        {
            cardsPairs: 3,
            timeout: 20
        },
        {
            cardsPairs: 4,
            timeout: 25
        },
        {
            cardsPairs: 5,
            timeout: 30
        },
        {
            cardsPairs: 5,
            timeout: 25
        },
        {
            cardsPairs: 5,
            timeout: 20
        },
        {
            cardsPairs: 5,
            timeout: 15
        },
        {
            cardsPairs: 5,
            timeout: 13
        },
        {
            cardsPairs: 5,
            timeout: 10
        },
        {
            cardsPairs: 5,
            timeout: 8
        }
    ],
    scene: new GameScene(),
    scale: {
        mode: Phaser.Scale.FIT, // масштабирует канвас, чтобы он помещался на экране
        autoCenter: Phaser.Scale.CENTER_BOTH, // центрирование по горизонтали и вертикали
    }
};

let game = new Phaser.Game(config);

window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
   
});
window.addEventListener('orientationchange', () => {
    // Обновляем размеры игры и масштаб
    setTimeout(() => {
        game.scale.resize(window.innerWidth, window.innerHeight);
        game.scale.setZoom(1);  // сброс масштаба после изменения ориентации
    }, 500);
});