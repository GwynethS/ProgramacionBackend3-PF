import { Router } from "express";
import {
  generateData,
  getMockingPets,
  getMockingUsers,
} from "../controllers/mocks.controller.js";

const router = Router();

router.get("/mockingpets/:nPets?", getMockingPets);
router.get("/mockingusers/:nUsers?", getMockingUsers);

router.post("/generateData/:users/:pets", generateData);

export default router;
