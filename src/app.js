import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import swaggerJSDoc from "swagger-jsdoc"; 
import swaggerUiExpress from "swagger-ui-express"; 

import usersRouter from "./routes/users.router.js";
import petsRouter from "./routes/pets.router.js";
import adoptionsRouter from "./routes/adoption.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import mockingRouter from "./routes/mocks.router.js";
import errorHandler from "./middleware/error.js";

const app = express();
const PORT = process.env.PORT || 8080;

const connection = mongoose.connect(
  `mongodb+srv://GwynethS:HYzs8Rc7Vt1cyFmN@coderback.2iv25.mongodb.net/?retryWrites=true&w=majority&appName=CoderBack`,
  { dbName: "Adoption" }
);

const swaggerOptions = {
  definition: {
      openapi: "3.0.1",
      info: {
          title: "AdoptMe API Documentation",
          description: "An API designed to help stray dogs find a loving home through adoption"
      }
  },
  apis: ["./src/docs/**/*.yaml"]
}

const specs = swaggerJSDoc(swaggerOptions); 
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs)); 

app.use(express.json());
app.use(cookieParser());

app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/adoptions", adoptionsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/mocks", mockingRouter);

app.use(errorHandler); 

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
