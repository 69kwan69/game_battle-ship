import Player from '../models/Player.js';
import Component from './Component.js';

export default class DeploymentView {
  constructor(player, container) {
    this.player = player;
    this.container = container;
    this.grid = Component.createGrid(player.board.grid);
    this.fleet = Component.createFleet(player.fleet);
    this.readyBtn = Component.createBtn('btn ready hidden', 'Battle');
  }

  attachEventHandlers() {
    const { grid, fleet, readyBtn } = this;
    grid.classList.add('editing');
    grid.addEventListener('dragover', (e) => e.preventDefault());
    grid.addEventListener('dragenter', (e) => this.showCellAvailability(e));
    grid.addEventListener('dragleave', (e) => this.hideCellAvailability(e));
    grid.addEventListener('drop', (e) => this.deployShip(e));

    fleet.childNodes.forEach((ship) => {
      ship.draggable = true;
      ship.addEventListener('dragstart', (e) => this.dragShip(e));
      ship.addEventListener('dragend', (e) => this.dropShip(e));
      ship.addEventListener('click', (e) => this.changeDirection(e));
    });

    readyBtn.addEventListener('click', () => this.removeView());
  }

  appendToDOM() {
    const { container, grid, fleet, readyBtn } = this;

    const board = document.createElement('div');
    board.className = 'board';
    board.append(grid);

    const ships = document.createElement('div');
    ships.className = 'ships';
    ships.append(fleet, readyBtn);

    container.append(board, ships);
  }

  removeView() {
    const { container } = this;
    container.classList.add('next-stage');
    container.innerHTML = '';
  }

  checkAllDeploy() {
    const { player } = this;
    if (player.isReady()) this.readyBtn.classList.remove('hidden');
    else this.readyBtn.classList.add('hidden');
  }

  dragShip(e) {
    const ship = e.currentTarget;

    ship.classList.add('held');
    setTimeout(() => {
      ship.classList.add('invisible');
      ship.classList.remove('failed');
    }, 0);

    e.dataTransfer.setData('id', e.target.id);

    this.player.undeploy(ship.dataset.index);
  }

  showCellAvailability(e) {
    e.preventDefault();
    if (!e.target.classList.contains('cell')) return;
    const { player } = this;
    const cell = e.target;

    const ship = document.querySelector(`#${e.dataTransfer.getData('id')}`);
    const { index, direction } = getShipDataset(ship);
    const { long, lat } = cell.dataset;
    const coords = [parseInt(long), parseInt(lat)];
    // ship.dataset.long = cell.dataset.long;
    // ship.dataset.lat = cell.dataset.lat;
    // const { index, direction, coords } = getShipDataset(ship);

    if (player.deploy(index, coords, direction)) {
      player.undeploy(index);
      cell.classList.add('available');
    } else {
      cell.classList.add('unavailable');
    }
  }

  hideCellAvailability(e) {
    e.preventDefault();
    if (!e.target.classList.contains('cell')) return;
    e.target.classList.remove('available', 'unavailable');
  }

  dropShip(e) {
    e.currentTarget.classList.remove('held', 'invisible');
  }

  deployShip(e) {
    if (!e.target.classList.contains('cell')) return;
    const { player, grid } = this;
    const cell = e.target;

    const id = e.dataTransfer.getData('id');
    const ship = document.querySelector(`#${id}`);
    ship.dataset.long = cell.dataset.long;
    ship.dataset.lat = cell.dataset.lat;

    const { index, coords, direction } = getShipDataset(ship);
    if (!player.deploy(index, coords, direction)) ship.classList.add('failed');

    grid.append(ship);
    cell.classList.remove('available', 'unavailable');
    ship.classList.add('deployed');
    ship.style.top = cell.offsetTop + 'px';
    ship.style.left = cell.offsetLeft + 'px';

    this.checkAllDeploy();
  }

  changeDirection(e) {
    const ship = e.currentTarget;
    if (!ship.classList.contains('deployed')) return;

    if (parseInt(ship.dataset.direction) == 4) ship.dataset.direction = 1;
    else ship.dataset.direction++;
    this.grid.append(ship);

    const { index, coords, direction } = getShipDataset(ship);

    const { player } = this;
    player.undeploy(index);
    ship.classList.remove('failed');

    if (!player.deploy(index, coords, direction)) ship.classList.add('failed');

    this.checkAllDeploy();
  }
}

function getShipDataset(ship) {
  const { index, direction, long, lat } = ship.dataset;

  return {
    index: parseInt(index),
    direction: parseInt(direction),
    coords: [parseInt(long), parseInt(lat)],
  };
}
