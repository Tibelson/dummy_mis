Department Management System - Backend (Spring Boot)

This is the mockup backend for MIS Web 



### `controller`
Contains all the API endpoints used by the frontend. These include:

- `LecturerController` – Endpoints for lecturer login, student viewing, and result uploading.
- `StudentController` – Manage student records.
- `AuthController` – Authentication and login logic.

### `dto`
DTOs are used to define how data is passed between frontend and backend, avoiding direct exposure of entities.

### `exception`
Custom exceptions for user-friendly error handling:
- `ResourceNotFoundException`
- `AuthenticationFailedException` (if added later)

### `model`
Holds the JPA entity classes like:
- `Lecturer`
- `Student`
- `Course`
- `TA`

These classes map to your PostgreSQL tables.

### `repository`
Extends `JpaRepository` for each model to interact with the database. Example: `LecturerRepository`.

### `service`
Business logic lives here. For example, `LecturerService` handles lecturer login, student access, and grade upload logic.

### `util`
Contains helper utilities like `MapperUtil` to convert between DTOs and Entities.

---

##  Tech Stack

- **Backend**: Java 21, Spring Boot 3+
- **Database**: PostgreSQL
- **Build Tool**: Maven
- **Containerization**: Docker & Docker Compose

---

##  How to Run the Project

###  Clone the Repository
```bash
git clone https://github.com/your-repo-url
cd backEnd
docker-compose up --build

