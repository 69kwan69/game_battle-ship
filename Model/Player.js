import Gameboard from './Gameboard.js';
import Ship from './Ship.js';

export default class Player {
  constructor(name = 'pc') {
    this.name = name;
    this.fleet = this.initializeFleet();
    this.field = new Gameboard(10);
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

  isLost() {
    const shipLeft = this.fleet.filter((ship) => ship.isSunk());
    if (shipLeft.length === 0) return true;
    else return false;
  }
}
