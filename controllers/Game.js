import Player from '../models/Player.js';
import Computer from './Computer.js';
import DeploymentView from '../views/Deployment.js';
import BattleView from '../views/Battle.js';
import Component from '../views/Component.js';

export default class Game {
  constructor(container) {
    this.container = container;
    this.player = new Player('player');
    this.enemy = new Player('pc');
  }

  start() {
    this.deploymentStage();
    this.observeStages();
  }

  observeStages() {
    const { container } = this;
    const observer = new MutationObserver((mutations) => {
      for (let mutation of mutations) {
        if (mutation.type !== 'attributes') return;
        if (!mutation.target.classList.contains('next-stage')) return;

        const classList = container.classList;
        if (classList.contains('deployment')) this.battleStage();
        else if (classList.contains('battle')) this.announceResult();
        else if (classList.contains('result')) this.deploymentStage();
      }
    });

    observer.observe(container, { attributes: true });
  }

  deploymentStage() {
    const { container, player, enemy } = this;
    container.className = 'deployment';

    Computer.autoDeploy(enemy);

    const deployZone = new DeploymentView(player, container);
    deployZone.attachEventHandlers();
    deployZone.appendToDOM();
  }

  battleStage() {
    const { container, player, enemy } = this;
    container.className = 'battle';

    const battlefield = new BattleView(container, player, enemy);
    battlefield.appendToDOM();
    battlefield.attachEventHandlers();
  }

  announceResult() {
    const { container, player, enemy } = this;
    container.className = 'result';

    const result = document.createElement('h1');
    result.textContent = `${container.dataset.winner} wins!`;

    const restartBtn = Component.createBtn('restart btn', 'Play again');
    restartBtn.addEventListener('click', () => {
      container.classList.add('next-stage');
      container.innerHTML = '';
      container.dataset.winner = '';
      this.player = new Player(player.name);
      this.enemy = new Player(enemy.name);
    });

    container.append(result, restartBtn);
  }
}
