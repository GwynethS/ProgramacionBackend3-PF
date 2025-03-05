import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe("Testing de la App Web Adoptame", () => {
  describe("Testing de Mascotas", () => {
      it("Endpoint POST /api/pets debe crear una mascota correctamente", async () => {

          const pichichoMock = {
              name: "Firulais", 
              specie: "Pichicho", 
              birthDate: "2021-03-10"
          };

          const { statusCode, ok, _body } = await requester.post("/api/pets").send(pichichoMock);

          console.log(statusCode); 
          console.log(ok);
          console.log(_body); 

          expect(_body.payload).to.have.property("_id"); 
      })

      it("Al crear una mascota sólo con los datos elementales. Se debe corroborar que la mascota creada cuente con una propiedad adopted : false", async () => {
          const nuevaMascota = {
              name: "Rex", 
              specie: "Perro", 
              birthDate: "2020-01-01"
          }; 

          const {statusCode, _body} =  await requester.post("/api/pets").send(nuevaMascota); 

          expect(statusCode).to.equal(200); 
          expect(_body.payload).to.have.property("adopted").that.equals(false); 
      })

      it("Si se desea crear una mascota sin el campo  nombre, el módulo debe responder con un status 400.", async () => {
          const mascotaSinNombre = {
              specie: "Gato", 
              birthDate: "2024-12-24"
          }; 

          const { statusCode } = await requester.post("/api/pets").send(mascotaSinNombre); 

          expect(statusCode).to.equal(400);

      })

      it("Al obtener a las mascotas con el método GET, la respuesta debe tener los campos status y payload. Además, payload debe ser de tipo arreglo.", async () => {
          const { statusCode, _body }  = await requester.get("/api/pets"); 

          expect(statusCode).to.equal(200); 
          expect(_body).to.have.property("status").that.equals("success"); 
          expect(_body).to.have.property("payload").that.is.an("array"); 
      })

      it("El método PUT debe poder actualizar correctamente a una mascota determinada ", async () => {
          const idMascotaExistente = "6aaa84bad4dd297ffbe7bc1a"; 

          const datosActualizados = {
              name: "Mili", 
              specie: "cat"
          }

          const { statusCode} = await requester.put(`/api/pets/${idMascotaExistente}`).send(datosActualizados); 

          expect(statusCode).to.equal(200); 
      })

      it("El método DELETE debe poder borrar la última mascota agregada, ésto se puede alcanzar agregando a la mascota con un POST, tomando el id, borrando la mascota  con el DELETE, y luego corroborar si la mascota existe con un GET", async () => {
          const nuevaMascota = {
              name: "Mascota a borrar",
              specie: "Perro", 
              birthDate: "2023-02-20"
          }

          const {_body: {payload: {  _id } } } = await requester.post("/api/pets").send(nuevaMascota);

          const {statusCode} =  await requester.delete(`/api/pets/${_id}`);

          expect(statusCode).to.equal(200); 
      })
  })

  describe("Test Avanzado", () => {
      let cookie; 

      it("Debe registrar correctamente a un usuario", async () => {
          const mockUsuario = {
              first_name: "Pepe", 
              last_name: "Argento", 
              email: "pepeee@zapateriagarmendia.com",
              password: "1234"
          }

          const {_body} = await requester.post("/api/sessions/register").send(mockUsuario); 

          expect(_body.payload).to.be.ok; 
      })

      it("Debe loguear correctamente al usuario y recuperar la cookie", async () => {
          const mockUsuario = {
              email: "pepe@zapateriagarmendia.com",
              password: "1234"
          }

          const resultado = await requester.post("/api/sessions/login").send(mockUsuario); 

          const cookieResultado = resultado.headers["set-cookie"]["0"]; 

          expect(cookieResultado).to.be.ok; 

          cookie = {
              name: cookieResultado.split("=") ["0"],
              value: cookieResultado.split("=") ["1"]
          }

          expect(cookie.name).to.be.ok.and.eql("coderCookie"); 
          expect(cookie.value).to.be.ok; 
      })

      it("Debe enviar la cookie que contiene el usuario", async () => {

          const {_body} = await requester.get("/api/sessions/current").set("Cookie",[`${cookie.name}=${cookie.value}`]); 

          expect(_body.payload.email).to.be.eql("pepe@zapateriagarmendia.com");
      })
  })

  describe("Testeamos la carga de imagenes", () => {
      it("Creamos una mascota con imagen", async () => {
          const pet = {
              name: "Bingo", 
              specie: "dog", 
              birthDate: "2024-10-01"
          }

          const resultado = await requester.post("/api/pets/withimage")
              .field("name", pet.name)
              .field("specie", pet.specie)
              .field("birthDate", pet.birthDate)
              .attach("image", "./test/ambar-perrito.jpg");

          expect(resultado.status).to.be.eql(200); 
          expect(resultado._body.payload).to.have.property("_id"); 
          expect(resultado._body.payload.image).to.be.ok; 
      })
  })
})