import { generateMockPet, generateMockUser } from "../mocks/mocks.js";
import { petsService, usersService } from "../services/index.js";
import logger from "../utils/logger.js";

const getMockingPets = async(req, res) => {
    try {
        const { cantidad = 100 } = req.query;
        logger.info(`Generating ${cantidad} mock pets`);
        
        let pets = [];
        for(let i = 0; i < cantidad; i++) {
            pets.push(generateMockPet());
        }
        
        logger.info(`Successfully generated ${cantidad} mock pets`);
        res.send({
            status: "success",
            payload: pets
        });
    } catch(error) {
        logger.error(`Error generating mock pets: ${error.message}`);
        res.status(500).send({
            status: "error",
            error: error.message
        });
    }
}

const getMockingUsers = async(req, res) => {
    try {
        logger.info('Generating 50 mock users');
        let users = [];
        
        for(let i = 0; i < 50; i++) {
            let user = await generateMockUser();
            users.push(user);
        }
        
        logger.info('Successfully generated 50 mock users');
        res.send({
            status: "success",
            payload: users
        });
    } catch(error) {
        logger.error(`Error generating mock users: ${error.message}`);
        res.status(500).send({
            status: "error",
            error: error.message
        });
    }
}

const generateData = async(req, res) => {
    try {
        const { users = 0, pets = 0 } = req.body;
        logger.info(`Request to generate data - Users: ${users}, Pets: ${pets}`);
        
        if(!users && !pets) {
            logger.warning('Generate data request without parameters');
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
        logger.info(`${users} users inserted successfully`);
        
        // Generar e insertar mascotas
        for(let i = 0; i < pets; i++) {
            let pet = generateMockPet();
            let petCreated = await petsService.create(pet);
            petsInserted.push(petCreated);
        }
        logger.info(`${pets} pets inserted successfully`);
        
        res.send({
            status: "success",
            message: "Datos generados e insertados correctamente",
            payload: {
                usersInserted: usersInserted.length,
                petsInserted: petsInserted.length
            }
        });
    } catch(error) {
        logger.error(`Error generating data: ${error.message}`);
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
