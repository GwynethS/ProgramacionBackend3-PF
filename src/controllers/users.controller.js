import { usersService } from "../services/index.js";
import CustomError from "../services/errors/custom-error.js";
import generateErrorInfo from "../services/errors/info.js";
import EErrors from "../services/errors/enum.js";

const getAllUsers = async (req, res, next) => {
  try {
    const users = await usersService.getAll();
    res.send({ status: "success", payload: users });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if (!user) {
      throw CustomError.createError({
        name: "UserNotFoundError",
        cause: generateErrorInfo("user", { id: userId, notFound: true }),
        message: "User not found.",
        code: EErrors.NOT_FOUND,
      });
    }
    res.send({ status: "success", payload: user });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const newUser = req.body;
    const result = await usersService.create(newUser);

    res.send({ status: "success", payload: result });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const updateBody = req.body;
    const userId = req.params.uid;

    const user = await usersService.getUserById(userId);
    if (!user) {
      throw CustomError.createError({
        name: "UserNotFoundError",
        cause: generateErrorInfo("user", { id: userId, notFound: true }),
        message: "User not found.",
        code: EErrors.NOT_FOUND,
      });
    }

    const result = await usersService.update(userId, updateBody);
    res.send({ status: "success", message: "User updated" });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if (!user) {
      throw CustomError.createError({
        name: "UserNotFoundError",
        cause: generateErrorInfo("user", { id: userId, notFound: true }),
        message: "User not found.",
        code: EErrors.NOT_FOUND,
      });
    }

    await usersService.delete(userId);
    res.send({ status: "success", message: "User deleted" });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
};
