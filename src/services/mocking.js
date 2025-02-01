import { faker } from "@faker-js/faker";
import { createHash } from "../utils/index.js";

const petSpecies = ["dog", "cat", "rabbit", "parrot", "hamster", "turtle", "guinea pig"];

export const generateMockPets = (count = 100) => {
  const pets = [];

  for (let i = 0; i < count; i++) {
    pets.push({
      _id: faker.database.mongodbObjectId(),
      name: faker.animal.petName(),
      specie: faker.helpers.arrayElement(petSpecies),
      birthDate: faker.date.birthdate({ mode: 'age', min: 1, max: 15 }),
      adopted: false,
      owner: null,
      image: faker.image.url()
    });
  }

  return pets;
};

export const generateMockUsers = async (count = 50) => {
  const users = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email();
    
    const password = await createHash('coder123');
    
    const role = faker.helpers.arrayElement(['user', 'admin']);
    
    users.push({
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      role: role,
      pets: [],
    });
  }
  
  return users;
};