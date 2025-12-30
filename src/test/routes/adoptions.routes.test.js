import request from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';

import app from '../../app.js';
import UserModel from '../../dao/models/User.js';
import PetModel from '../../dao/models/Pet.js';
import AdoptionModel from '../../dao/models/Adoption.js';

describe('Adoptions API - Tests funcionales', function () {
  let user;
  let pet;
  let adoptionId;

  before(async function () {
    await mongoose.connect('mongodb://127.0.0.1:27017/testdb'); 
    await UserModel.deleteMany({});
    await PetModel.deleteMany({});
    await AdoptionModel.deleteMany({});

    user = await UserModel.create({
      first_name: 'Test',
      last_name: 'User',
      email: 'test@mail.com',
      pets: []
    });

    pet = await PetModel.create({
      name: 'Firulais',
      adopted: false
    });
  });

  after(async function () {
    await mongoose.connection.close();
  });

  it('GET /api/adoptions → 200 y array', async function () {
    const res = await request(app).get('/api/adoptions');
    expect(res.status).to.equal(200);
    expect(res.body.payload).to.be.an('array');
  });

  it('POST /api/adoptions/:uid/:pid → 200 y adopción exitosa', async function () {
    const res = await request(app).post(`/api/adoptions/${user._id}/${pet._id}`);
    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal('success');

    const adoption = await AdoptionModel.findOne({ pet: pet._id });
    adoptionId = adoption._id;
  });

  it('GET /api/adoptions/:aid → 200 y adopción específica', async function () {
    const res = await request(app).get(`/api/adoptions/${adoptionId}`);
    expect(res.status).to.equal(200);
    expect(res.body.payload.pet).to.equal(pet._id.toString());
    expect(res.body.payload.owner).to.equal(user._id.toString());
  });

  it('GET /api/adoptions/:aid → 404 si no existe', async function () {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/adoptions/${fakeId}`);
    expect(res.status).to.equal(404);
    expect(res.body.status).to.equal('error');
  });

  it('POST /api/adoptions/:uid/:pid → 404 si usuario no existe', async function () {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).post(`/api/adoptions/${fakeId}/${pet._id}`);
    expect(res.status).to.equal(404);
    expect(res.body.status).to.equal('error');
  });

  it('POST /api/adoptions/:uid/:pid → 404 si mascota no existe', async function () {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).post(`/api/adoptions/${user._id}/${fakeId}`);
    expect(res.status).to.equal(404);
    expect(res.body.status).to.equal('error');
  });

  it('POST /api/adoptions/:uid/:pid → 400 si mascota ya adoptada', async function () {
    const res = await request(app).post(`/api/adoptions/${user._id}/${pet._id}`);
    expect(res.status).to.equal(400);
    expect(res.body.status).to.equal('error');
  });
});
