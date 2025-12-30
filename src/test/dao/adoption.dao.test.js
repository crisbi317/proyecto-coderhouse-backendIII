import chai from "chai";
import mongoose from "mongoose";
import Users from "../../dao/Users.dao.js";
import Pets from "../../dao/Pets.dao.js";
import Adoption from "../../dao/Adoption.dao.js";
import UserRepository from "../../repository/UserRepository.js";
import PetRepository from "../../repository/PetRepository.js";
import AdoptionRepository from "../../repository/AdoptionRepository.js";

const expect = chai.expect;

// Instanciamos DAOs
const usersDAO = new Users();
const petsDAO = new Pets();
const adoptionDAO = new Adoption();

// Instanciamos Repositories con validaciones
const usersService = new UserRepository(usersDAO);
const petsService = new PetRepository(petsDAO);
const adoptionsService = new AdoptionRepository(adoptionDAO, usersService, petsService);

describe("DAO Adoption - Tests funcionales", function () {
  let userId;
  let petId;
  let adoptionId;

  
  before(async function () {
    await mongoose.connect("mongodb://127.0.0.1:27017/test_adoptions", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const user = await usersService.create({ 
      first_name: "Test User", 
      last_name: "User",
      email: "test@mail.com", 
      password: "1234", 
      pets: [] });
    userId = user._id;

    const pet = await petsService.create({ name: "Firulais", specie: "dog", adopted: false });
    petId = pet._id;
  });

  
  after(async function () {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  it("Debe crear una adopción correctamente", async function () {
    const adoption = await adoptionsService.create({ owner: userId, pet: petId });
    adoptionId = adoption._id;
    expect(adoption).to.have.property("_id");
    expect(adoption.owner.toString()).to.equal(userId.toString());
    expect(adoption.pet.toString()).to.equal(petId.toString());
  });

  it("Debe obtener todas las adopciones", async function () {
    const adoptions = await adoptionsService.getAll();
    expect(adoptions.length).to.be.greaterThan(0);
  });

  it("Debe obtener una adopción por id", async function () {
    const adoption = await adoptionsService.getBy({ _id: adoptionId });
    expect(adoption._id.toString()).to.equal(adoptionId.toString());
  });

  it("Debe fallar al crear adopción con usuario inexistente", async function () {
    try {
      await adoptionsService.create({ owner: "000000000000000000000000", pet: petId });
      throw new Error("No se lanzó error para usuario inexistente");
    } catch (err) {
      expect(err.message).to.equal("User not found");
    }
  });

  it("Debe fallar al crear adopción con mascota inexistente", async function () {
    try {
      await adoptionsService.create({ owner: userId, pet: "000000000000000000000000" });
      throw new Error("No se lanzó error para mascota inexistente");
    } catch (err) {
      expect(err.message).to.equal("Pet not found");
    }
  });

  it("Debe fallar al crear adopción con mascota ya adoptada", async function () {
    try {
      
      await adoptionsService.create({ owner: userId, pet: petId });
      throw new Error("No se lanzó error para mascota ya adoptada");
    } catch (err) {
      expect(err.message).to.equal("Pet is already adopted");
    }
  });

  it("Debe eliminar una adopción", async function () {
    await adoptionsService.delete(adoptionId);
    const adoption = await adoptionsService.getBy({ _id: adoptionId });
    expect(adoption).to.be.null;
  });
});
