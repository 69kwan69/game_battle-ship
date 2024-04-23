export default class Gameboard {
  constructor(size = 10) {
    this.size = size;
    this.grid = this.initializeGrid(size);
  }

  initializeGrid(size) {
    const arr = [];
    for (let i = 0; i < size; i++) {
      arr[i] = [];
      for (let j = 0; j < size; j++) {
        arr[i][j] = { isShot: false, ship: null };
      }
    }
    return arr;
  }

  deployShip(ship, coords, direction = 1, length = ship.length) {
    // 'length' represent number of parts divided from the ship
    // Using 'direction', we can calculate each coords for each 'part' based on the original coords
    if (!this.isDeployable(coords)) return false;

    // Get the translation rules
    let translation = [];
    switch (direction) {
      case 1:
        translation = [0, 1];
        break;
      case 2:
        translation = [1, 0];
        break;
      case 3:
        translation = [0, -1];
        break;
      case 4:
        translation = [-1, 0];
        break;
    }

    // Generate the coords
    const coordsList = [coords];
    for (let i = 0; i < length - 1; i++) {
      const previousCoords = coordsList[coordsList.length - 1];
      const currentCoords = [
        previousCoords[0] + translation[0],
        previousCoords[1] + translation[1],
      ];
      if (!this.isDeployable(currentCoords)) return false;
      coordsList.push(currentCoords);
    }

    // Place the parts on the coords
    coordsList.forEach((coords) => {
      this.grid[coords[0]][coords[1]].ship = ship;
    });

    // Save coords on the ship itself
    ship.coords = coordsList;

    return true;
  }

  undeployShip(ship) {
    const coords = ship.coords;
    coords.forEach((coord) => {
      this.grid[coord[0]][coord[1]].ship = null;
    });
    ship.coords = [];
  }

  isDeployable(coords) {
    if (
      coords[0] < 0 ||
      coords[1] < 0 ||
      coords[0] > this.size - 1 ||
      coords[1] > this.size - 1 ||
      this.grid[coords[0]][coords[1]].ship
    )
      return false;
    return true;
  }

  receiveAttack(coords) {
    const area = this.grid[coords[0]][coords[1]];
    if (area.isShot) {
      return false;
    } else if (area.ship) {
      area.ship.hit();
      area.isShot = true;
      return 'hit';
    } else {
      area.isShot = true;
      return 'missed';
    }
  }
}
