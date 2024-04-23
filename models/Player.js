import Gameboard from './Gameboard.js';
import Ship from './Ship.js';

export default class Player {
  constructor(name = 'pc') {
    this.name = name;
    this.fleet = this.initializeFleet();
    this.board = this.initializeBoard();
  }

  initializeFleet() {
    const carrier = new Ship('Carrier', 5);
    const battleship = new Ship('Battleship', 4);
    const cruiser = new Ship('Cruiser', 3);
    const submarine = new Ship('Submarine', 3);
    const destroyer = new Ship('Destroyer', 2);

    const fleet = [carrier, battleship, cruiser, submarine, destroyer];
    return fleet;
  }

  initializeBoard(size = 10) {
    return new Gameboard(size);
  }

  isReady() {
    for (let ship of this.fleet) {
      if (!ship.isDeployed()) return false;
    }
    return true;
  }

  isLost() {
    for (let ship of this.fleet) {
      if (!ship.isSunk()) return false;
    }
    return true;
  }

  getShip(index) {
    return this.fleet[index];
  }

  deploy(index, coords, direction) {
    const ship = this.getShip(index);
    return this.board.deployShip(ship, coords, direction);
  }

  undeploy(index) {
    const ship = this.getShip(index);
    this.board.undeployShip(ship);
  }
}
