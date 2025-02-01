import { generateMockPets, generateMockUsers } from "../services/mocking.js";
import { usersService } from "../services/index.js";
import { petsService } from "../services/index.js";

export const getMockingPets = (req, res) => {
  const nPets = parseInt(req.params.nPets, 10) || 100;

  const result = generateMockPets(nPets);

  res.send({ status: "success", payload: result });
};

export const getMockingUsers = async (req, res) => {
  const nUsers = parseInt(req.params.nUsers, 10) || 50;
  try {
    const result = await generateMockUsers(nUsers);

    res.send({ status: "success", payload: result });
  } catch (e) {
    res
      .status(500)
      .send({ status: "error", message: "Error generating users" });
  }
};

export const generateData = async (req, res) => {
  const usersCount = parseInt(req.params.users, 10);
  const petsCount = parseInt(req.params.pets, 10);

  try {
    const mockUsers = await generateMockUsers(usersCount);
    const mockPets = generateMockPets(petsCount);

    const resultUsers = await usersService.insertMany(mockUsers);
    const resultPets = await petsService.insertMany(mockPets);

    res.send({
      status: "success",
      payload: { users: resultUsers, pets: resultPets },
    });
  } catch (e) {
    res.status(500).send({
      status: "error",
      message: "Error generating data",
      error: e.message,
    });
  }
};
