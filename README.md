# Marti Music

Proyecto académico de temática musical desarrollado con Angular 21, NestJS 11, TypeORM 1.x y MariaDB. La aplicación permite explorar canciones por género, consultar sus detalles, registrarse/iniciar sesión y crear playlists personales.

## Tecnologías

### Frontend
- Angular 21 con Standalone Components
- Signals: `signal()`, `computed()` y `effect()`
- Flujo de control: `@if`, `@else`, `@for`, `@empty`, `@switch`
- Carga diferida con `@defer` y `@placeholder`
- HttpClient, interceptor JWT y guards funcionales
- Reactive Forms
- TailwindCSS + DaisyUI

### Backend
- NestJS 11
- TypeORM 1.x
- MariaDB 11 mediante Docker
- JWT + Passport
- bcrypt
- class-validator / class-transformer
- Repository Pattern con `@InjectRepository`

## Módulos principales

- `AuthModule`: registro, login y JWT.
- `CommonModule`: utilidades compartidas y `PaginationDto`.
- `SongsModule`: catálogo musical con CRUD, paginación y filtro por género.
- `GenresModule`: administración de géneros musicales.
- `PlaylistsModule`: creación y administración de playlists por usuario.
- `SeedModule`: carga de usuarios, géneros y canciones de prueba.

## MariaDB con Docker

Crear el contenedor por primera vez:

```powershell
docker run --name proyecto-mariadb -e MARIADB_ROOT_PASSWORD=root1234 -e MARIADB_DATABASE=marti_music -e MARIADB_USER=proyecto_user -e MARIADB_PASSWORD=proyecto1234 -p 3306:3306 -v proyecto_mariadb_data:/var/lib/mysql -d mariadb:11
```

En ejecuciones posteriores:

```powershell
docker start proyecto-mariadb
```

Si ya tienes el contenedor `proyecto-mariadb` de una versión anterior, puedes crear una base limpia para esta temática sin borrar nada:

```powershell
docker exec -it proyecto-mariadb mariadb -u root -proot1234 -e "CREATE DATABASE IF NOT EXISTS marti_music;"
```

## Variables de entorno

Crear `Backend/.env` tomando como referencia `Backend/.env.template`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=marti_music
DB_USERNAME=proyecto_user
DB_PASSWORD=tu_password
JWT_SECRET=tu_clave_jwt
```

## Ejecutar backend

```powershell
cd Backend
npm install
npm run start:dev
```

API: `http://localhost:3000`

Seed: `GET http://localhost:3000/seed`

Usuarios de prueba del seed:

- Admin: `admin@martimusic.com` / `Admin123`
- User: `usuario@martimusic.com` / `Usuario123`

## Ejecutar frontend

```powershell
cd ProyectoFinalFront
npm install
npm start
```

Frontend: `http://localhost:4200`

## Endpoints principales

### Auth
- `POST /auth/register`
- `POST /auth/login`

### Songs
- `GET /songs?limit=10&offset=0`
- `GET /songs?genre=rock`
- `GET /songs/:idSlug`
- `POST /songs` — admin
- `PATCH /songs/:id` — admin
- `DELETE /songs/:id` — admin

### Genres
- `GET /genres`
- `GET /genres/:idSlug`
- `POST /genres` — admin
- `PATCH /genres/:id` — admin
- `DELETE /genres/:id` — admin

### Playlists
- `POST /playlists` — autenticado
- `GET /playlists/mine` — autenticado
- `GET /playlists` — admin
- `GET /playlists/:id` — autenticado
- `PATCH /playlists/:id` — dueño/admin
- `DELETE /playlists/:id` — dueño/admin

### Users
- `GET /users?limit=10&offset=0` — admin

## Validación final

Backend:

```powershell
npm run build
```

Frontend:

```powershell
npm run build
npm test -- --watch=false
```

La colección de Postman se encuentra en `postman/Marti_Music_API.postman_collection.json`.
