# Medical Vault & Health Management

A full-stack health management application that provides a personal medical vault for users, complete with health statistics, an AI-powered symptom checker, and document upload capabilities. 

## Features

- **Medical Vault**: Upload, store, and manage your medical documents securely.
- **Health Statistics Dashboard**: Track vital signs (BP, Pulse, SpO2, BMI, etc.) extracted from uploaded medical reports.
- **AI Symptom Checker**: Integrated with Google Gemini for intelligent symptom analysis and chatbot capabilities.
- **Image Capture & Analysis**: Capture or upload images for AI processing.
- **Authentication**: Secure login and user profile management.

## Tech Stack

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.5
- **Language**: Java 21
- **Database**: MySQL (TiDB Cloud for production)
- **Security**: Spring Security
- **Data Access**: Spring Data JPA
- **Build Tool**: Maven

### Frontend (React)
- **Framework**: React 19 (via Vite)
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Getting Started

### Prerequisites
- Java 21
- Maven
- Node.js & npm
- MySQL (or TiDB Cloud credentials)
- Google Gemini API Key

### Backend Setup
1. Navigate to the root directory.
2. Update `src/main/resources/application.properties` with your database credentials and API keys.
3. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file with the backend API URL and other necessary variables.
4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

- The backend is Dockerized (see `Dockerfile`) and can be deployed to services like Render.
- The frontend can be built using `npm run build` and deployed to static hosting platforms like Vercel.
