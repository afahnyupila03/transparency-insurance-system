
# Transparency Insurance System



A full-stack web application that empowers users to transparently manage and understand their car insurance coverage. Users can register, add multiple car profiles, and instantly view how long their insurance will last or calculate the cost for a selected coverage period. The backend computes coverage details based on user input and car profiles, returning results to the frontend for display.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Tasks](#development-tasks)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Database Design & Structure](#database-design--structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- User registration and authentication
- Add and manage multiple car profiles per user
- Calculate and display:
  - Remaining insurance coverage duration
  - Insurance cost for a selected coverage period
- Responsive, modern UI
- Secure backend API
- Persistent data storage with MongoDB

---

## Tech Stack

- **Frontend:** React, React Router, CSS, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm
- MongoDB instance (local or cloud)

---

## Development Tasks

### Frontend

- **Authentication**
  - [ ] Implement user registration form and validation
  - [ ] Implement login form and validation
  - [ ] Handle authentication state (JWT/localStorage)
  - [ ] Implement logout functionality

- **User Dashboard**
  - [ ] Display user profile information
  - [ ] List all car profiles for the user
  - [ ] Show summary of insurance coverage for each car

- **Car Profile Management**
  - [ ] Create form to add a new car profile
  - [ ] Edit existing car profile details
  - [ ] Delete car profile
  - [ ] Validate car profile input fields

- **Insurance Calculation**
  - [ ] UI for selecting a car and coverage period
  - [ ] Display calculated coverage duration and/or cost
  - [ ] Handle loading and error states for calculation requests

- **API Integration**
  - [ ] Connect frontend forms and views to backend endpoints
  - [ ] Handle API errors and display user-friendly messages

- **UI/UX**
  - [ ] Responsive layout with TCSS *(tentative)
  - [ ] Navigation bar and routing (React Router) *(tentative)
  - [ ] Consistent theming and accessibility

- **Testing**
  - [ ] Unit tests for components and utility functions
  - [ ] Integration tests for forms and API calls

---

### Backend

- **Authentication**
  - [ ] User registration endpoint (with password hashing)
  - [ ] User login endpoint (JWT issuance) *(tentative)
  - [ ] Middleware for route protection (JWT verification) *(tentative)

- **User Management**
  - [ ] Get user profile endpoint
  - [ ] Update user profile endpoint

- **Car Profile Management**
  - [ ] Create car profile endpoint
  - [ ] Get all car profiles for a user
  - [ ] Update car profile endpoint
  - [ ] Delete car profile endpoint
  - [ ] Input validation for car data

- **Insurance Calculation**
  - [ ] Endpoint to calculate remaining coverage duration for a car
  - [ ] Endpoint to calculate insurance cost for a selected period
  - [ ] Implement business logic for insurance calculations

- **Security**
  - [ ] Input validation and sanitization
  - [ ] Secure password storage (bcrypt)
  - [ ] Rate limiting and error handling

- **Testing**
  - [ ] Unit tests for business logic and models
  - [ ] Integration tests for API endpoints

---

### Database Design & Structure

- [ ] Design and implement User and Car models in Mongoose
- [ ] Set up relationships (user owns many cars)
- [ ] Index fields for efficient queries (e.g., user email, car regNum)
- [ ] Seed database with sample data for development/testing

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-org/transparency-insurance-system.git
   cd transparency-insurance-system
2. **Navigate to the FrontEnd folder and run the frontend application:**
   ```sh
   cd FrontEnd
   npm install
   npm run dev

   The frontend will start on http://localhost:5173 by default.


