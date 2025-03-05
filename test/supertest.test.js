import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Adoptme App Tests", () => {
  describe("Pets API Testing", () => {
    it("POST /api/pets should successfully create a pet", async () => {
      const petMock = {
        name: "Firulais",
        specie: "Dog",
        birthDate: "2021-03-10",
      };

      const { statusCode, _body } = await requester
        .post("/api/pets")
        .send(petMock);

      expect(statusCode).to.equal(200);
      expect(_body.payload).to.have.property("_id");
    });

    it("When creating a pet with only basic data, it should have an 'adopted' property set to false", async () => {
      const newPet = {
        name: "Rex",
        specie: "Dog",
        birthDate: "2020-01-01",
      };

      const { statusCode, _body } = await requester
        .post("/api/pets")
        .send(newPet);

      expect(statusCode).to.equal(200);
      expect(_body.payload).to.have.property("adopted").that.equals(false);
    });

    it("Trying to create a pet without a name should return a 400 status code", async () => {
      const petWithoutName = {
        specie: "Cat",
        birthDate: "2024-12-24",
      };

      const { statusCode } = await requester
        .post("/api/pets")
        .send(petWithoutName);

      expect(statusCode).to.equal(400);
    });

    it("GET /api/pets should return a response containing 'status' and 'payload', and 'payload' should be an array", async () => {
      const { statusCode, _body } = await requester.get("/api/pets");

      expect(statusCode).to.equal(200);
      expect(_body).to.have.property("status").that.equals("success");
      expect(_body).to.have.property("payload").that.is.an("array");
    });

    it("PUT /api/pets/:pid should update a specific pet correctly", async () => {
      const existingPetId = "6aaa84bad4dd297ffbe7bc1a";

      const updatedData = {
        name: "Mili",
        specie: "Cat",
      };

      const { statusCode } = await requester
        .put(`/api/pets/${existingPetId}`)
        .send(updatedData);

      expect(statusCode).to.equal(200);
    });

    it("DELETE should remove the last added pet", async () => {
      const newPet = {
        name: "Pet to delete",
        specie: "Dog",
        birthDate: "2023-02-20",
      };

      const {
        _body: {
          payload: { _id },
        },
      } = await requester.post("/api/pets").send(newPet);

      const { statusCode } = await requester.delete(`/api/pets/${_id}`);

      expect(statusCode).to.equal(200);
    });

    it("POST /api/pets/withimage should create a pet with an image", async () => {
      const pet = {
        name: "Bingo",
        specie: "Dog",
        birthDate: "2024-10-01",
      };

      const result = await requester
        .post("/api/pets/withimage")
        .field("name", pet.name)
        .field("specie", pet.specie)
        .field("birthDate", pet.birthDate)
        .attach("image", "./test/ambar-perrito.jpg");

      expect(result.status).to.equal(200);
      expect(result._body.payload).to.have.property("_id");
      expect(result._body.payload.image).to.exist;
    });
  });

  describe("Users API Testing", () => {
    it("GET /api/users should return a list of users", async () => {
      const { statusCode, _body } = await requester.get("/api/users");

      expect(statusCode).to.equal(200);
      expect(_body).to.have.property("status").that.equals("success");
      expect(_body).to.have.property("payload").that.is.an("array");
    });

    it("GET /api/users/:uid should return a specific user if found", async () => {
      const existingUserId = "679d8c0f1f4448a0fc24d5b9";

      const { statusCode, _body } = await requester.get(
        `/api/users/${existingUserId}`
      );

      expect(statusCode).to.equal(200);
      expect(_body).to.have.property("status").that.equals("success");
      expect(_body.payload).to.have.property("_id").that.equals(existingUserId);
    });

    it("GET /api/users/:uid should return a 404 error if user is not found", async () => {
      const nonExistentUserId = "000000000000000000000000";

      const { statusCode, _body } = await requester.get(
        `/api/users/${nonExistentUserId}`
      );

      expect(statusCode).to.equal(404);
      expect(_body).to.have.property("message").that.equals("User not found.");
    });

    it("PUT /api/users/:uid should update an existing user", async () => {
      const existingUserId = "679d8c0f1f4448a0fc24d5b9";

      const updatedUserData = {
        email: "updateduser@example.com",
      };

      const { statusCode, _body } = await requester
        .put(`/api/users/${existingUserId}`)
        .send(updatedUserData);

      expect(statusCode).to.equal(200);
      expect(_body).to.have.property("status").that.equals("success");
      expect(_body).to.have.property("message").that.equals("User updated");
    });

    it("PUT /api/users/:uid should return a 404 error if user is not found", async () => {
      const nonExistentUserId = "000000000000000000000000";

      const updateData = {
        name: "Nonexistent User",
        email: "nonexistent@example.com",
      };

      const { statusCode, _body } = await requester
        .put(`/api/users/${nonExistentUserId}`)
        .send(updateData);

      expect(statusCode).to.equal(404);
      expect(_body).to.have.property("message").that.equals("User not found.");
    });

    it("DELETE /api/users/:uid should delete an existing user", async () => {
      const userToDelete = {
        first_name: "Temporary User",
        last_name: "To Delete",
        email: "userToDelete@example.com",
        password: "1234",
      };

      const createdUserResponse = await requester
        .post("/api/users")
        .send(userToDelete);

      const userId = createdUserResponse._body.payload._id;

      const { statusCode, _body } = await requester.delete(
        `/api/users/${userId}`
      );

      expect(statusCode).to.equal(200);
      expect(_body).to.have.property("status").that.equals("success");
      expect(_body).to.have.property("message").that.equals("User deleted");
    });

    it("DELETE /api/users/:uid should return a 404 error if user is not found", async () => {
      const nonExistentUserId = "000000000000000000000000";

      const { statusCode, _body } = await requester.delete(
        `/api/users/${nonExistentUserId}`
      );

      expect(statusCode).to.equal(404);
      expect(_body).to.have.property("message").that.equals("User not found.");
    });

    it("DELETE /api/users/:uid should return a 404 error if user is not found", async () => {
      const nonExistentUserId = "000000000000000000000000";

      const { statusCode, _body } = await requester.delete(
        `/api/users/${nonExistentUserId}`
      );

      expect(statusCode).to.equal(404);
      expect(_body).to.have.property("message").that.equals("User not found.");
    });
  });

  describe("Sessions API Testing", () => {
    let cookie;

    it("Should successfully register a user", async () => {
      const mockUser = {
        first_name: "John",
        last_name: "Doe",
        email: "johndoe@example.com",
        password: "password123",
      };

      const { _body } = await requester
        .post("/api/sessions/register")
        .send(mockUser);

      expect(_body.status).to.eql("success");
      expect(_body.payload).to.be.ok;
    });

    it("Should log in successfully and get a session cookie", async () => {
      const mockUser = {
        email: "johndoe@example.com",
        password: "password123",
      };

      const response = await requester
        .post("/api/sessions/login")
        .send(mockUser);

      const cookieResult = response.headers["set-cookie"]?.[0];

      expect(cookieResult).to.be.ok;

      cookie = {
        name: cookieResult.split("=")[0],
        value: cookieResult.split("=")[1].split(";")[0], // Extract only the value
      };

      expect(cookie.name).to.eql("coderCookie");
      expect(cookie.value).to.be.ok;
    });

    it("Should send the session cookie and retrieve the authenticated user's data", async () => {
      const { _body } = await requester
        .get("/api/sessions/current")
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);

      expect(_body.status).to.eql("success");
      expect(_body.payload.email).to.eql("johndoe@example.com");
    });

    it("Should log in using the unprotected route and retrieve an unprotected session cookie", async () => {
      const mockUser = {
        email: "johndoe@example.com",
        password: "password123",
      };

      const response = await requester
        .get("/api/sessions/unprotectedLogin")
        .send(mockUser);

      const cookieResult = response.headers["set-cookie"]?.[0];

      expect(cookieResult).to.be.ok;

      const unprotectedCookie = {
        name: cookieResult.split("=")[0],
        value: cookieResult.split("=")[1].split(";")[0],
      };

      expect(unprotectedCookie.name).to.eql("unprotectedCookie");
      expect(unprotectedCookie.value).to.be.ok;
    });

    it("Should get the user session from the unprotected route", async () => {
      const { _body } = await requester
        .get("/api/sessions/unprotectedCurrent")
        .set("Cookie", [`unprotectedCookie=${cookie.value}`]);

      expect(_body.status).to.eql("success");
      expect(_body.payload.email).to.eql("johndoe@example.com");
    });
  });

  describe("Adoptions API Testing", () => {
    let testUser = null;
    let testPet = null;

    before(async () => {
      const userMock = {
        first_name: "Test",
        last_name: "User",
        email: `test-user@mail.com`,
        password: "test1234",
      };

      const userResponse = await requester.post("/api/users").send(userMock);
      expect(userResponse.statusCode).to.equal(200);

      testUser = userResponse._body.payload;

      const petMock = {
        name: "Lucky",
        specie: "Dog",
        birthDate: "2022-08-10",
      };

      const petResponse = await requester.post("/api/pets").send(petMock);
      expect(petResponse.statusCode).to.equal(200);
      testPet = petResponse._body.payload;
    });

    it("POST /api/adoptions/:uid/:pid should create an adoption", async () => {
      const { statusCode, _body } = await requester.post(
        `/api/adoptions/${testUser._id}/${testPet._id}`
      );

      expect(statusCode).to.equal(200);
      expect(_body.status).to.equal("success");
    });

    it("POST /api/adoptions/:uid/:pid should not allow adopting the same pet twice", async () => {
      const { statusCode } = await requester.post(
        `/api/adoptions/${testUser._id}/${testPet._id}`
      );

      expect(statusCode).to.equal(400);
    });

    it("GET /api/adoptions should return a list of adoptions", async () => {
      const { statusCode, _body } = await requester.get("/api/adoptions");

      expect(statusCode).to.equal(200);
      expect(_body.status).to.equal("success");
      expect(_body.payload).to.be.an("array");
    });

    it("GET /api/adoptions/:aid should return a single adoption", async () => {
      const { statusCode, _body } = await requester.get(
        `/api/adoptions/679e6d6a17a0caa94b05b6a8`
      );

      expect(statusCode).to.equal(200);
      expect(_body.status).to.equal("success");
      expect(_body.payload)
        .to.have.property("_id")
        .that.equals("679e6d6a17a0caa94b05b6a8");
    });

    it("GET /api/adoptions/:aid should return 404 if adoption does not exist", async () => {
      const fakeId = "000000000000000000000000";
      const { statusCode, _body } = await requester.get(
        `/api/adoptions/${fakeId}`
      );

      expect(statusCode).to.equal(404);
      expect(_body.status).to.equal("error");
      expect(_body.message).to.equal("Adoption not found.");
    });

    after(async () => {
      if (testUser) {
        await requester.delete(`/api/users/${testUser._id}`);
      }
      if (testPet) {
        await requester.delete(`/api/pets/${testPet._id}`);
      }
    });
  });
});
