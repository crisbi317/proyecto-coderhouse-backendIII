<<<<<<< HEAD
Proyecto en proceso para la cursada de Backend III en Coderhouse
=======
# Proyecto Final - Backend III

## DockerHub docker push crisbi317/server20251129:1.0.0

# Proyecto Final - API de Usuarios y Mascotas

Este proyecto es una API desarrollada con Node.js, Express y MongoDB, organizada con DAO/DTO. Incluye:

- Gestión de usuarios.
- Gestión de mascotas.
- Gestión de adopciones.
- Documentación con Swagger.
- Tests funcionales completos para el módulo de adopciones.
- Dockerización del proyecto.

---

## 1️ Requisitos

- Node.js v20+
- MongoDB corriendo localmente
- Docker (para generar la imagen)

---

## 2️ Instalación

### 1. Clonar el repositorio:


git clone <REPO_URL>
cd Proyecto-final

### 2. Instalar dependencias

npm install

### 3. Configurar MongoDB

mongodb://127.0.0.1:27017/testdb   para tests

## 4. Correr la API

node src/app.js

La API escucha en el puerto 8080.

Documentación Swagger disponible en: http://localhost:8080/api/docs

### Ejecutar test funcionales
- Los tests funcionales cubren todos los endpoints del módulo de adopciones usando DAO/DTO:

npx mocha src/test/dao/adoption.dao.test.js --timeout 10000

- Cubre casos de éxito: crear adopción, obtener todas, obtener por id, eliminar adopción.

- Cubre casos de error: usuario inexistente, mascota inexistente, mascota ya adoptada.

## 5. Dockerización

Se incluye un Dockerfile para generar la imagen del proyecto.

docker build -t crisbi317/server20251129

Ejecutar contenedor

docker run -p 8080:8080 crisbi317/server20251129

La API estará disponible en http://localhost:8080

Imagen en Dockerhub

Imagen subida a Dockerhub:

## 6. Documentación Swagger

Archivo swagger/swagger.json incluye toda la documentación de rutas de Users y otras.

Acceder desde la ruta /api/docs

src/
  dao/           # DAO de Users, Pets, Adoptions
  dto/           # DTOs
  routes/        # Rutas de API (si se usan)
  controllers/   # Lógica de endpoints
  services/      # Servicios que usan DAO
  test/          # Tests funcionales
swagger/
  swagger.json   # Documentación de la API
app.js          # Archivo principal
Dockerfile      # Para dockerizar

## Notas Finales

Todos los tests funcionales están preparados para MongoDB local.

Docker permite ejecutar la API de forma reproducible sin depender de Node local.

Swagger proporciona documentación completa para el módulo de Users.
>>>>>>> 131e8f8 (entrega test docker)
