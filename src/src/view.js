import Game from "./game.js";
import GameController from "./gameController.js";

export default class View {
    static colors = {
        '1': 'rgb(211,154,33)',
        '2': 'rgb(138,212,223)',
        '3': 'rgb(196,87,85)',
        '4': 'rgb(90,157,103)',
        '5': 'rgb(81,56,82)',
        '6': 'rgb(42,141,182)',
        '7': 'rgb(146,108,145)',
    };

    constructor(element, width, height, rows, columns, game) {
        this.element = element;
        this.width = width;
        this.height = height;

        this.game = game;

        this.right = document.createElement('canvas');
        const right = this.right;
        right.id = 'right';
        right.width = 200;
        right.height = this.height;
        this.right = right.getContext('2d');
        this.element.appendChild(right);

        this.canvas = document.createElement('canvas');
        const canvas = this.canvas;
        canvas.id = '';

        canvas.width = this.width;
        canvas.height = this.height;
        
        this.context = canvas.getContext('2d');

        this.blockWidth = this.width / columns;
        this.blockHeight = this.height / rows;

        this.element.appendChild(canvas);

        this.canvasPanel = document.createElement('canvas');
        const canvasPanel = this.canvasPanel;
        canvasPanel.width = 200;
        canvasPanel.height = this.height;
        this.ctx = this.canvasPanel.getContext('2d');
        this.element.appendChild(this.canvasPanel);
    }

    renderMainScreen(state) {
        this.canvas.id = 'canv';
        this.clearScreen();
        if(this.game.getState().level % 2 === 1) {
            this.renderRotatePlayfield(state);
        }
        else {
            this.renderPlayfield(state);
        }
        this.renderPanel(state);
    }

    clearScreen() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    renderStartScreen() {
        
        this.context.fillStyle = 'rgb(238,193,95)';
        this.context.font = '25px "Neon"';
        this.context.textAlign = 'center';
        this.context.shadowColor = 'rgb(211,154,33)';
        this.context.shadowOffsetX = 0;
        this.context.shadowOffsetY = 0;
        this.context.shadowBlur = 10;    
        this.context.textBaseline = "middle";
        this.context.fillText('Press ENTER to Start', this.width/2, this.height/2);
    }

    renderPauseScreen() {
        this.context.fillStyle = 'rgba(0,0,0,0.75)';
        this.context.fillRect(0, 0, this.width, this.height);

        this.context.fillStyle = 'rgb(238,193,95)';
        this.context.font = '25px "Neon"';
        this.context.textAlign = 'center';

        this.context.shadowColor = 'rgb(211,154,33)';
        this.context.shadowOffsetX = 0;
        this.context.shadowOffsetY = 0;
        this.context.shadowBlur = 10;

        this.context.textBaseline = "middle";
        this.context.fillText('Press    ENTER', this.width/2, this.height/2 - 48);
        this.context.fillText('to    Resume', this.width/2, this.height/2);
    }

    renderEndScreen({ score }) {
        this.clearScreen();

        this.context.fillStyle = 'rgb(238,193,95)';
        this.context.font = '25px "Neon"';
        this.context.textAlign = 'center';

        this.context.shadowColor = 'rgb(211,154,33)';
        this.context.shadowOffsetX = 0;
        this.context.shadowOffsetY = 0;
        this.context.shadowBlur = 10;

        this.context.textBaseline = "middle";
        this.context.fillText('GAME OVER', this.width/2, this.height/2 - 48);
        this.context.fillText('Score    ' + score, this.width/2, this.height/2);
        
    }

    renderPlayfield({ playfield }) {
        for (let y = 0; y < playfield.length; y++) {
            const line = playfield[y];

            for (let x = 0; x < line.length; x++) {
                const block = line[x];

                if (block) {
                    this.renderBlock(x * this.blockWidth, 
                        y * this.blockHeight, 
                        this.blockWidth, 
                        this.blockHeight, 
                        View.colors[block]);
                }
            }
        }
    }

    renderRotatePlayfield({ playfield }) {
        for (let y = 0; y < playfield.length; y++) {
            const line = playfield[y];

            for (let x = 0; x < line.length; x++) {
                const block = line[x];

                if (block) {
                    this.renderBlock(x * this.blockWidth, 608 - y * this.blockHeight, this.blockWidth, this.blockHeight, View.colors[block]);
                }
            }
        }
    }

    renderPanel({ level, score, lines, }) {
        this.ctx.clearRect(0, 0, 200, 640);
        this.ctx.textAlign = 'start';
        this.ctx.textBaseline = 'top';
        this.ctx.fillStyle = 'rgb(172,238,248)';
        this.ctx.font = '20px "Neon"';
        this.ctx.shadowColor = 'rgb(138,212,223)';
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.shadowBlur = 10;       

        this.ctx.fillText('Level   '+ level, 40, 24);
        this.ctx.fillText('Lines   '+ lines, 40, 48);

        this.ctx.textAlign = 'start';
        this.ctx.textBaseline = 'top';
        this.ctx.fillStyle = 'rgb(238,193,95)';
        this.ctx.font = '20px "Neon"';
        this.ctx.shadowColor = 'rgb(211,154,33)';
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.shadowBlur = 10;

        this.ctx.fillText('Score   '+ score, 40, 96);

        this.right.clearRect(0, 0, 200, 640);
        this.right.textAlign = 'right';
        this.right.textBaseline = 'top';
        this.right.fillStyle = 'rgb(172,238,248)';
        this.right.font = '20px "Neon"';
        this.right.shadowColor = 'rgb(138,212,223)';
        this.right.shadowOffsetX = 0;
        this.right.shadowOffsetY = 0;
        this.right.shadowBlur = 10;       
        this.right.fillText('← →  Left Right', 160, 24);
        this.right.fillText('↑                    Rotate', 160, 48);
        this.right.fillText('↓                         Down', 160, 72);

        this.right.textAlign = 'right';
        this.right.textBaseline = 'top';
        this.right.fillStyle = 'rgb(238,193,95)';
        this.right.font = '20px "Neon"';
        this.right.shadowColor = 'rgb(211,154,33)';
        this.right.shadowOffsetX = 0;
        this.right.shadowOffsetY = 0;
        this.right.shadowBlur = 10;
        this.right.fillText('Enter        Pause', 160, 96);
    }

    renderBlock(x, y, width, height, color) {
        const gr = this.context.createRadialGradient(x+16, y+16, 8, x+16, y+16, 22)
        gr.addColorStop(0, "rgba(255, 255, 255, 0.62)");
        gr.addColorStop(1, color);
        
        this.context.fillStyle = gr;
        this.context.strokeStyle = color;
        this.context.shadowColor = color;
        this.context.shadowBlur = 5;
        this.context.shadowOffsetX = 0;
        this.context.shadowOffsetY = 0;
        this.context.lineWidth = 2;

        this.context.fillRect(x, y, width, height);
        this.context.strokeRect(x, y, width, height);
    }
}