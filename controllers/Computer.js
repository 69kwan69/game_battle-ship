import Player from '../models/Player.js';

export default class Computer {
  static autoDeploy(player) {
    player.fleet.forEach((ship) => {
      while (!ship.isDeployed()) {
        player.board.deployShip(
          ship,
          this.randomCoords(),
          this.randomDirection()
        );
      }
    });
  }

  static autoAim(player) {
    const { grid } = player.board;
    let taskCompleted = false;
    while (!taskCompleted) {
      const [long, lat] = [...this.randomCoords()];
      if (!grid[long][lat].hit) return { long, lat };
    }
  }

  static randomCoords(size = 10) {
    return [parseInt(Math.random() * size), parseInt(Math.random() * size)];
  }

  static randomDirection(n = 4) {
    return parseInt(Math.random() * n + 1);
  }
}
