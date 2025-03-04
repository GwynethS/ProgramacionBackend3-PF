import {
  adoptionsService,
  petsService,
  usersService,
} from "../services/index.js";
import CustomError from "../services/errors/custom-error.js";
import generateErrorInfo from "../services/errors/info.js";
import EErrors from "../services/errors/enum.js";

const getAllAdoptions = async (req, res, next) => {
  try {
    const result = await adoptionsService.getAll();
    res.send({ status: "success", payload: result });
  } catch (error) {
    next(error);
  }
};

const getAdoption = async (req, res, next) => {
  try {
    const adoptionId = req.params.aid;
    const adoption = await adoptionsService.getAdoptionById(adoptionId);
    if (!adoption) {
      throw CustomError.createError({
        name: "AdoptionNotFoundError",
        cause: generateErrorInfo("adoption", {
          id: adoptionId,
          notFound: true,
        }),
        message: "Adoption not found.",
        code: EErrors.NOT_FOUND,
      });
    }
    res.send({ status: "success", payload: adoption });
  } catch (error) {
    next(error);
  }
};

const createAdoption = async (req, res, next) => {
  try {
    const { uid, pid } = req.params;
    const user = await usersService.getUserById(uid);
    if (!user) {
      throw CustomError.createError({
        name: "UserNotFoundError",
        cause: generateErrorInfo("user", { id: uid, notFound: true }),
        message: "User not found.",
        code: EErrors.NOT_FOUND,
      });
    }

    const pet = await petsService.getPetById(pid);
    if (!pet) {
      throw CustomError.createError({
        name: "PetNotFoundError",
        cause: generateErrorInfo("pet", { id: pid, notFound: true }),
        message: "Pet not found.",
        code: EErrors.NOT_FOUND,
      });
    }

    if (pet.adopted) {
      throw CustomError.createError({
        name: "PetAlreadyAdoptedError",
        message: "Pet is already adopted.",
        code: EErrors.INVALID_OPERATION,
      });
    }

    user.pets.push(pet._id);
    await usersService.update(user._id, { pets: user.pets });
    await petsService.update(pet._id, { adopted: true, owner: user._id });
    await adoptionsService.create({ owner: user._id, pet: pet._id });

    res.send({ status: "success", message: "Pet adopted" });
  } catch (error) {
    next(error);
  }
};

export default {
  createAdoption,
  getAllAdoptions,
  getAdoption,
};
