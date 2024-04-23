export default class Component {
  static createGrid(array) {
    const grid = document.createElement('div');
    grid.className = 'grid';
    grid.style.gridTemplateColumns = `repeat(${array.length}, 1fr)`;
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array.length; j++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.long = i;
        cell.dataset.lat = j;
        if (array[i][j].isShot) cell.classList.add('hit');
        if (array[i][j].ship) cell.classList.add('ship');
        grid.append(cell);
      }
    }
    return grid;
  }

  static createShip(ship, index) {
    const grid = document.createElement('div');
    grid.className = 'ship';
    grid.style.gridTemplateColumns = `repeat(${ship.length}, 1fr)`;
    grid.id = `ship${index}`;
    grid.dataset.index = index;
    grid.dataset.direction = 1;
    for (let i = 0; i < ship.length; i++) {
      const part = document.createElement('div');
      part.className = 'part';
      grid.append(part);
    }
    return grid;
  }

  static createFleet(ships) {
    const fleet = document.createDocumentFragment();
    ships.forEach((ship, index) => {
      fleet.append(this.createShip(ship, index));
    });
    return fleet;
  }

  static createBtn(className, textContent) {
    const btn = document.createElement('button');
    btn.className = className;
    btn.textContent = textContent;
    return btn;
  }
}
