import { generateMockPet, generateMockUser } from "../mocks/mocks.js";
import { petsService, usersService } from "../services/index.js";

const getMockingPets = async(req, res) => {
    try {
        const { cantidad = 100 } = req.query;
        
        let pets = [];
        for(let i = 0; i < cantidad; i++) {
            pets.push(generateMockPet());
        }
        
        res.send({
            status: "success",
            payload: pets
        });
    } catch(error) {
        res.status(500).send({
            status: "error",
            error: error.message
        });
    }
}

const getMockingUsers = async(req, res) => {
    try {
        let users = [];
        
        for(let i = 0; i < 50; i++) {
            let user = await generateMockUser();
            users.push(user);
        }
        
        res.send({
            status: "success",
            payload: users
        });
    } catch(error) {
        res.status(500).send({
            status: "error",
            error: error.message
        });
    }
}

const generateData = async(req, res) => {
    try {
        const { users = 0, pets = 0 } = req.body;
        
        if(!users && !pets) {
            return res.status(400).send({
                status: "error",
                error: "Debe proporcionar al menos un parámetro (users o pets)"
            });
        }
        
        let usersInserted = [];
        let petsInserted = [];
        
        // Generar e insertar usuarios
        for(let i = 0; i < users; i++) {
            let user = await generateMockUser();
            let userCreated = await usersService.create(user);
            usersInserted.push(userCreated);
        }
        
        // Generar e insertar mascotas
        for(let i = 0; i < pets; i++) {
            let pet = generateMockPet();
            let petCreated = await petsService.create(pet);
            petsInserted.push(petCreated);
        }
        
        res.send({
            status: "success",
            message: "Datos generados e insertados correctamente",
            payload: {
                usersInserted: usersInserted.length,
                petsInserted: petsInserted.length
            }
        });
    } catch(error) {
        res.status(500).send({
            status: "error",
            error: error.message
        });
    }
}

export default {
    getMockingPets,
    getMockingUsers,
    generateData
}
