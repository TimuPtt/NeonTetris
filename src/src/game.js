export default class Game {
    static points = {
        '1': 40,
        '2': 100,
        '3': 300,
        '4': 1200
    };

    score = 0;
    lines = 0;

    topOut = false;

    playfield = this.createPlayfield();

    activeFigure = this.createFigure();
    nextFigure = this.createFigure();

    get level() {
        return Math.floor(this.lines * 0.2);
    }

    getState() {
        const playfield = this.createPlayfield();

        for (let y = 0; y < this.playfield.length; y++) {
            playfield[y] = [];

            for (let x = 0; x < this.playfield[y].length; x++) {
                playfield[y][x] = this.playfield[y][x];
            }
        }

        for (let y = 0; y < this.activeFigure.blocks.length; y++) {
            for (let x = 0; x < this.activeFigure.blocks[y].length; x++) {
                if (this.activeFigure.blocks[y][x]) {
                    playfield[this.activeFigure.y + y][this.activeFigure.x + x] = this.activeFigure.blocks[y][x];
                }
            }
        }
        
        return {
            score: this.score,
            level: this.level,
            lines: this.lines,
            nextFigure: this.nextFigure,
            playfield,
            isGameOver:  this.topOut,
            randomSpeedUp: this.randomSpeedUp
        };
    }

    createPlayfield() {
        const playfield = [];

        for (let y = 0; y < 20; y++) {
            playfield[y] = [];

            for (let x = 0; x < 10; x++) {
                playfield[y][x] = 0;
            }
        }
        
        return playfield;
    }

    createFigure() {
        const index = Math.floor(Math.random() * 7);
        const type = 'IJLOSTZ'[index];
        const figure = {}

        switch (type) {
            case 'I':
                figure.blocks = [
                    [0,0,0,0],
                    [1,1,1,1],
                    [0,0,0,0],
                    [0,0,0,0]
                ];
                break;
            case 'J':
                figure.blocks = [
                    [0,0,0],
                    [2,2,2],
                    [0,0,2]                  
                ];
                break;
            
            case 'L':
                figure.blocks = [
                    [0,0,0],
                    [3,3,3],
                    [3,0,0]                  
                ];
                break;

            case 'O':
                figure.blocks = [
                    [0,0,0,0],
                    [0,4,4,0],
                    [0,4,4,0],
                    [0,0,0,0]
                ];
                break;

            case 'S':
                figure.blocks = [
                    [0,0,0],
                    [0,5,5],
                    [5,5,0]                  
                ];
                break;

            case 'T':
                figure.blocks = [
                    [0,0,0],
                    [6,6,6],
                    [0,6,0]                  
                ];
                break;

            case 'Z':
                figure.blocks = [
                    [0,0,0],
                    [7,7,0],
                    [0,7,7]                  
                ];
                break;

            default:
                throw new Error('Неизвестный тип фигуры')
        }

        figure.x = Math.floor((10 - figure.blocks[0].length) / 2);
        figure.y = -1;
        
        return figure;
    }

    moveFigureLeft() {
        this.activeFigure.x -= 1;

        if (this.isFigureOutOfField()) {
            this.activeFigure.x += 1;
        }
    }

    

    moveFigureRight() {
        this.activeFigure.x += 1;

        if (this.isFigureOutOfField()) {
            this.activeFigure.x -= 1;
        }
    }

    moveFigureDown() {
        if (this.topOut){
            return;
        }
        
        this.activeFigure.y += 1;

        if (this.isFigureOutOfField()) {
            this.activeFigure.y -= 1;
            this.lockFigure();
            const clearedLines = this.clearLines();
            this.updateScore(clearedLines);
            this.updateFigures();
        }

        if (this.isFigureOutOfField()) {
            this.topOut = true;
        }
    }

    rotateFigure() {
        const blocks = this.activeFigure.blocks;
        const length = blocks.length;
        const temp = [];
        
        for (let i = 0; i < length; i++) {
            temp[i] = new Array(length).fill(0);
        }

        for (let y = 0; y < length; y++) {
            for (let x = 0; x < length; x++) {
                temp[x][y] = blocks[length - 1 - y][x];
            }
        }

        this.activeFigure.blocks = temp;

        if (this.isFigureOutOfField()) {
            this.activeFigure.blocks = blocks;
        }
    }

    isFigureOutOfField() {
        const {y: figureY, x: figureX, blocks} = this.activeFigure;
        
        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (
                    blocks[y][x] && 
                    ((this.playfield[figureY + y] === undefined || this.playfield[figureY + y][figureX + x] === undefined) ||
                    this.playfield[figureY + y][figureX + x])
                ) {
                    return true;
                }
            }
        }

        return false;
    }

    lockFigure() {
        const {y: figureY, x: figureX, blocks} = this.activeFigure;
        
        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (blocks[y][x]){
                    this.playfield[figureY + y][figureX + x] = this.activeFigure.blocks[y][x];
                }
            }
        }
    }

    clearLines() {
        const rows = 20;
        const columns = 10;

        let lines = [];
        
        for (let y = rows - 1 ; y >=0; y--) {
            let numberOfBlocks = 0;

            for (let x = 0; x < columns; x++) {
                if (this.playfield[y][x]){
                    numberOfBlocks += 1;
                }   
            }
            if (numberOfBlocks === 0) {
                break;
            }
            else if (numberOfBlocks < columns) {
                continue;
            }
            else if(numberOfBlocks === columns)
            {
                lines.unshift(y);
            }
        }
        
        for (let index of lines) {
            this.playfield.splice(index, 1);
            this.playfield.unshift(new Array(columns).fill(0)); 
        }

        return lines.length;
    }

    updateScore(clearedLines) {
        if (clearedLines > 0) {
            this.score += Game.points[clearedLines] * (this.level + 1);
            this.lines += clearedLines;
            console.log(this.score, this.lines, this.level);
        }
    }

    updateFigures() {
        this.activeFigure = this.nextFigure;
        this.nextFigure = this.createFigure();
    }
}