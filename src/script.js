import Game from './src/game.js';
import View from './src/view.js';
import GameController from './src/gameController.js'

const element = document.querySelector('#main')

const game = new Game();
const view = new View(element, 320, 640, 20, 10, game);
const controller = new GameController(game, view);

window.game = game;
window.view = view;
window.controller = controller;

