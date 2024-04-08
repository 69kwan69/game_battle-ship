export default class Component {
  static createTable(array) {
    const table = document.createElement('table');
    table.className = 'table';
    for (let i = 0; i < array.length; i++) {
      const tr = document.createElement('tr');
      for (let j = 0; j < array.length; j++) {
        const td = document.createElement('td');
        td.className = 'cell';
        td.dataset.long = i;
        td.dataset.lat = j;
        if (array[i][j].isShot) td.classList.add('hit');
        if (array[i][j].ship) td.classList.add('ship');
        tr.append(td);
      }
      table.append(tr);
    }
    return table;
  }

  static createShip(ship, index) {
    const table = document.createElement('table');
    table.className = 'ship';
    table.dataset.index = index;
    const tr = document.createElement('tr');
    for (let i = 0; i < ship.length; i++) {
      const td = document.createElement('td');
      td.className = 'part';
      tr.append(td);
    }
    table.append(tr);
    return table;
  }

  static createFleet(ships) {
    const fleet = document.createDocumentFragment();
    ships.forEach((ship, index) => {
      fleet.append(this.createShip(ship, index));
    });
    return fleet;
  }
}
