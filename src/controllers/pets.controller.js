import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js";
import __dirname from "../utils/index.js";
import CustomError from "../services/errors/custom-error.js";
import generateErrorInfo from "../services/errors/info.js";
import EErrors from "../services/errors/enum.js";

const getAllPets = async (req, res, next) => {
  try {
    const pets = await petsService.getAll();
    res.send({ status: "success", payload: pets });
  } catch (error) {
    next(error);
  }
};

const createPet = async (req, res, next) => {
  try {
    const { name, specie, birthDate } = req.body;

    if (!name || !specie || !birthDate) {
      throw CustomError.createError({
        name: "InvalidPetDataError",
        cause: generateErrorInfo("pet", { name, specie, birthDate }),
        message: "Incomplete or invalid pet data.",
        code: EErrors.INVALID_TYPE,
      });
    }

    const pet = PetDTO.getPetInputFrom({ name, specie, birthDate });
    const result = await petsService.create(pet);
    res.send({ status: "success", payload: result });
  } catch (error) {
    next(error);
  }
};

const updatePet = async (req, res, next) => {
  try {
    const petId = req.params.pid;
    const petUpdateBody = req.body;

    const pet = await petsService.getPetById(petId);
    if (!pet) {
      throw CustomError.createError({
        name: "PetNotFoundError",
        cause: generateErrorInfo("pet", { id: petId, notFound: true }),
        message: "Pet not found.",
        code: EErrors.NOT_FOUND,
      });
    }

    await petsService.update(petId, petUpdateBody);
    res.send({ status: "success", message: "Pet updated" });
  } catch (error) {
    next(error);
  }
};

const deletePet = async (req, res, next) => {
  try {
    const petId = req.params.pid;
    const pet = await petsService.getPetById(petId);
    if (!pet) {
      throw CustomError.createError({
        name: "PetNotFoundError",
        cause: generateErrorInfo("pet", { id: petId, notFound: true }),
        message: "Pet not found.",
        code: EErrors.NOT_FOUND,
      });
    }

    await petsService.delete(petId);
    res.send({ status: "success", message: "Pet deleted" });
  } catch (error) {
    next(error);
  }
};

const createPetWithImage = async (req, res, next) => {
  try {
    const file = req.file;
    const { name, specie, birthDate } = req.body;

    if (!name || !specie || !birthDate || !file) {
      throw CustomError.createError({
        name: "InvalidPetDataError",
        cause: generateErrorInfo("pet", { name, specie, birthDate, file }),
        message: "Incomplete or invalid pet data.",
        code: EErrors.INVALID_TYPE,
      });
    }

    const pet = PetDTO.getPetInputFrom({
      name,
      specie,
      birthDate,
      image: `${__dirname}/../public/img/${file.filename}`,
    });

    const result = await petsService.create(pet);
    res.send({ status: "success", payload: result });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllPets,
  createPet,
  updatePet,
  deletePet,
  createPetWithImage,
};
