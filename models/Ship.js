export default class Ship {
  constructor(name, length) {
    this.name = name;
    this.length = length;
    this.hits = 0;
    this.coords = [];
  }

  hit() {
    this.hits++;
  }

  isSunk() {
    if (this.hits >= this.length) return true;
    return false;
  }

  isDeployed() {
    return !!this.coords.length;
  }
}
