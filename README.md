# 🐾 App Adoptme

Este proyecto es una API RESTful desarrollada en Node.js con Express que permite gestionar adopciones de mascotas. La API maneja usuarios, mascotas y adopciones, proporcionando endpoints para crear, listar y gestionar estos recursos.

## 📝 Descripción

La API proporciona funcionalidades para:

- Crear y gestionar usuarios.
- Crear y listar mascotas disponibles para adopción.
- Permitir que los usuarios adopten mascotas.
- Consultar el historial de adopciones.

## ⚙️ Environment

```
MONGO_URL="mongodb+srv://GwynethS:HYzs8Rc7Vt1cyFmN@coderback.2iv25.mongodb.net/?retryWrites=true&w=majority&appName=CoderBack"
PORT=8080
```

## 🐳 Docker

Puedes encontrar la imagen del proyecto en DockerHub:

🔗 https://hub.docker.com/repository/docker/gwyneth22/appadoptme

Para ejecutar el contenedor:
```
docker run -d -p 8080:8080 -e MONGO_URL="mongodb+srv://GwynethS:HYzs8Rc7Vt1cyFmN@coderback.2iv25.mongodb.net/?retryWrites=true&w=majority&appName=CoderBack" -e PORT="8080" gwyneth22/appadoptme:v1
```