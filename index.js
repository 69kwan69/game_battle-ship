import Player from './Model/Player.js';
import Component from './View/Component.js';

// # GAME FLOW

// ## Setup

// ### Pc player
// - 1 Board + 5 Ships
// const pc = new Player('pc');

// ### Man player
// - 1 Board + 5 Ships
const man = new Player('man');
const manField = man.field;

const board = Component.createTable(manField.board);

document.querySelector('.board').append(board);

board.classList.add('editing');
board.addEventListener('dragenter', dragEnter);
board.addEventListener('dragover', dragOver);
board.addEventListener('dragleave', dragLeave);
board.addEventListener('drop', dropItem);

function dragEnter(e) {
  e.preventDefault();
  if (!e.target.classList.contains('cell')) return;
  const cell = e.target;

  const shipData = JSON.parse(e.dataTransfer.getData('ship'));
  const ship = manFleet[shipData.index];
  const coords = [parseInt(cell.dataset.long), parseInt(cell.dataset.lat)];

  const result = manField.deployShip(ship, coords);

  if (result) {
    manField.undeployShip(ship);
    cell.classList.add('available');
  } else {
    cell.classList.add('unavailable');
  }
}

function dragOver(e) {
  e.preventDefault();
}

function dragLeave(e) {
  e.preventDefault();
  if (!e.target.classList.contains('cell')) return;
  e.target.classList.remove('available', 'unavailable');
}

function dropItem(e) {
  const shipData = JSON.parse(e.dataTransfer.getData('ship'));
  const ship = manFleet[shipData.index];
  const coords = [
    parseInt(e.target.dataset.long),
    parseInt(e.target.dataset.lat),
  ];

  manField.deployShip(ship, coords);
}

const manFleet = man.fleet;
const fleet = Component.createFleet(manFleet);
fleet.childNodes.forEach((ship) => {
  ship.draggable = true;
  ship.addEventListener('dragstart', dragStart);
  ship.addEventListener('dragend', dragEnd);
});
document.querySelector('.fleet').append(fleet);

function dragStart(e) {
  this.classList.add('held');
  setTimeout(() => {
    this.classList.add('invisible');
  }, 0);
  const index = this.dataset.index;
  const shipData = { index, direction: 1 };
  e.dataTransfer.setData('ship', JSON.stringify(shipData));
}

function dragEnd() {
  this.classList.remove('held', 'invisible');
}

// ## Deployment
// ### Pc's fleet deployment
// - Random cell deployment
// ### Man's fleet deployment
// - Show their empty board and 5 ships
// - Man can select cell to deploy ship, it should return valid/invalid
//   if the cell is available or not(occupied, out of range)
// - Man confirm the cell (Y: deploy next ship / N: Undeploy current ship and deploy again)
// - If all ships are deploy, MOVE TO THE NEXT STAGE.
// board.addEventListener('click', attack);
// function attack(e) {
//   if (e.target.classList.contains('cell')) {
//     const cell = e.target;
//     const long = cell.dataset.long;
//     const lat = cell.dataset.lat;
//     const message = manField.receiveAttack([long, lat]);
//     if (message === 'hit') {
//       cell.classList.add('ship', 'hit');
//     } else if (message === 'missed') {
//       cell.classList.add('hit');
//     }
//   }
// }
//
// ## Battle
// - Rotate between player's turn, at the end of each rotation (player's turn),
//   check if player lose (no: do nothing / yes: break the loop and MOVE TO NEXT STAGE)
// ### Man's turn (lady first)
// - Man select the cell to attack, if cell is marked then choose again,
//   else alert the message and continue
// ### Pc's turn
// - Random cell choice
//
// ## Result
// - Alert the winner
//
