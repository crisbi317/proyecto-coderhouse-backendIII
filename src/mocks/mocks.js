import {fakerES_MX as fa} from "@faker-js/faker"
import { createHash } from "../utils/index.js"

export const generateMockPet=()=>{
    // {name,specie,birthDate}
    let name=fa.animal.petName()
    let specie=fa.animal.type()
    let birthDate=fa.date.past({ years: 10 })

    return {
        name, 
        specie, 
        birthDate
    }
}
export const generateMockUser = async () => {
    // {first_name, last_name, email, password, role, pets}
    let first_name = fa.person.firstName()
    let last_name = fa.person.lastName()
    let email = fa.internet.email({ firstName: first_name, lastName: last_name })
    let password = await createHash("coder123")
    let role = fa.helpers.arrayElement(["user", "admin"])
    let pets = []

    return {
        first_name,
        last_name,
        email,
        password,
        role,
        pets
    }
}
