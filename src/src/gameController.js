export default class GameController {
    constructor(game, view) {
        this.game = game;
        this.view = view;
        this.intervalId = null;
        this.isPlaying = false;
        this.speedUpOut = false;

        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));

        this.view.renderStartScreen();
    }
    
    update() {
        this.game.moveFigureDown();
        this.updateView();   
    }
    pause() {
        this.isPlaying = false;
        this.stopTimer();
        this.updateView();
    }

    
    play() {
        this.isPlaying = true;
        this.startTimer();
        this.updateView();
    }

    updateView() {
        const state = this.game.getState();

        if (state.isGameOver) {
            this.view.renderEndScreen(state);
        }
        else if (!this.isPlaying) {
            this.view.renderPauseScreen();
        }
        else if (this.isPlaying) {
            this.view.renderMainScreen(state);
        }
    }

    startTimer() {
        let speed = this.randomSpeedUp(); 

        if (!this.intervalId){
            this.intervalId = setInterval(() => {
                this.update();
            }, speed > 0 ? speed : 100);

            const random = Math.random();
                 if (random * 10 > 5 && random * 10 < 6) {
                    this.speedUp = true;
                    console.log('speedUp');
                 }
                 else{
                    this.speedUp = false;
                    console.log('speedDown');
                 }
                console.log(random * 10);
        }
    }

    randomSpeedUp() {
        if (this.speedUp) {
            return 200;   
        }
        else {
            return 1000 - this.game.getState().level * 100;
        }
    }

    stopTimer() {
        if (this.intervalId){
            clearInterval(this.intervalId);
            this.intervalId = null;
        }    
    }

    handleKeyDown(event) {
        switch (event.keyCode) {
            case 13:
                if (this.isPlaying){
                    this.pause();
                }
                else{
                    this.play();
                }
                break;
            case 37:
                this.game.moveFigureLeft();
                this.updateView();
                break;
            case 38: 
                this.game.rotateFigure();
                this.updateView();
                break;
            case 39:
                this.game.moveFigureRight();
                this.updateView();
                break;
            case 40:
                this.stopTimer();
                this.game.moveFigureDown();
                this.updateView();
                break;
        }
    }

    handleKeyUp(event) {
        switch (event.keyCode) {
            case 40: 
                this.startTimer();
                break;
        }
    }
}