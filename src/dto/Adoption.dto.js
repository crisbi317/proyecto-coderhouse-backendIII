export default class AdoptionDTO {
  constructor(adoption) {
    this.owner = adoption.owner;
    this.pet = adoption.pet;
  }
}
