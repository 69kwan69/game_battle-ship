import Component from './Component.js';
import Player from '../models/Player.js';
import Computer from '../controllers/Computer.js';

export default class BattleView {
  constructor(container, player, enemy) {
    this.container = container;
    this.player = player;
    this.enemy = enemy;
    this.winner = null;

    this.playerGrid = Component.createGrid(player.board.grid);
    this.enemyGrid = Component.createGrid(enemy.board.grid);
  }

  appendToDOM() {
    const { container, playerGrid, enemyGrid } = this;

    const playerBoard = document.createElement('div');
    playerBoard.className = 'board player';
    playerBoard.append(playerGrid);

    const enemyBoard = document.createElement('div');
    enemyBoard.className = 'board enemy';
    enemyBoard.append(enemyGrid);

    container.append(playerBoard, enemyBoard);
  }

  attachEventHandlers() {
    const { enemyGrid } = this;
    enemyGrid.addEventListener('click', (e) => {
      if (!this.attacksEnemy(e)) return;
      if (this.checkWinner()) return;
      this.attacksPlayer();
      this.checkWinner();
    });
  }

  attacksEnemy(e) {
    if (!e.target.classList.contains('cell')) return;
    const cell = e.target;
    const { long, lat } = cell.dataset;

    if (!this.enemy.board.receiveAttack([long, lat])) return false;
    else {
      cell.classList.add('hit');
      return true;
    }
  }

  attacksPlayer() {
    const { playerGrid } = this;
    const player = new Player();
    const { long, lat } = Computer.autoAim(player);

    player.board.receiveAttack([long, lat]);

    const cell = playerGrid.querySelector(
      `.cell[data-long='${long}'][data-lat='${lat}']`
    );
    cell.classList.add('hit');
  }

  checkWinner() {
    let { container, player, enemy, winner } = this;

    if (enemy.isLost()) winner = player.name;
    else if (player.isLost()) winner = enemy.name;

    if (!winner) return false;

    container.dataset.winner = winner;
    setTimeout(() => this.removeView(), 500);
    return true;
  }

  removeView() {
    const { container } = this;
    container.classList.add('next-stage');
    container.innerHTML = '';
  }
}
