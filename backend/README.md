# Faculty Evaluation Backend

## Setup

1.  **Install Dependencies**:
    ```bash
    cd backend
    pip install -r requirements.txt
    ```

2.  **Environment Variables**:
    -   The `.env` file has been created with a template.
    -   **CRITICAL**: Update `MONGO_URL` in `.env` with your actual MongoDB Atlas connection string.
    -   Update `SECRET_KEY` with a secure random string.

3.  **Run the Server**:
    ```bash
    uvicorn app.main:app --reload
    ```
    The server will start at `http://127.0.0.1:8000`.

## API Documentation

-   **Swagger UI**: `http://127.0.0.1:8000/docs`
-   **ReDoc**: `http://127.0.0.1:8000/redoc`

## API Endpoints

### Authentication
-   `POST /login`: authenticates user and returns JWT token.

### Student
-   `GET /faculty`: List all faculty members.
-   `POST /feedback`: Submit feedback for a faculty member.

### Admin
-   `GET /admin/analytics`: Get dashboard analytics.
