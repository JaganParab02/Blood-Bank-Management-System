# Blood-Bank-Management-System

A full-stack web application for managing blood donations, donor registrations, and blood requests. The system facilitates the connection between blood donors and recipients while providing administrative controls for blood bank management.

## Features

- **User Management**
  - Donor registration and authentication
  - User (recipient) registration and authentication
  - Admin dashboard and controls

- **Blood Donation Management**
  - Track blood donations
  - Manage blood stock levels
  - Monitor donation history

- **Blood Request System**
  - Submit blood requests
  - Track request status
  - Admin approval workflow

- **Search Functionality**
  - Find donors by blood group and location
  - Real-time blood stock availability

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router DOM
- Formik & Yup for form validation
- React Toastify for notifications
- JWT for authentication

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Express Validator for input validation

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd JAKE

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

cd server
npm start

cd client
npm start

Trae
27 context(s) used
Workspace
.gitignore
21-21
.gitignore
1-26
.gitignore
1-25
package.json
1-25
index.html
37-45
...More
(21+)
Based on the project files I've analyzed, I'll create a comprehensive README.md for your GitHub repository. Here's the content:

README.md
Apply
# Blood Bank Management SystemA full-stack web application for managing blood donations, donor registrations, and blood requests. The system facilitates the connection between blood donors and recipients while providing administrative controls for blood bank management.## Features- **User Management**  - Donor registration and   authentication  - User (recipient) registration and   authentication  - Admin dashboard and controls- **Blood Donation Management**  - Track blood donations  - Manage blood stock levels  - Monitor donation history- **Blood Request System**  - Submit blood requests  - Track request status  - Admin approval workflow- **Search Functionality**  - Find donors by blood group and   location  - Real-time blood stock availability## Tech Stack### Frontend- React.js- Tailwind CSS- React Router DOM- Formik & Yup for form validation- React Toastify for notifications- JWT for authentication### Backend- Node.js- Express.js- MongoDB with Mongoose- JWT for authentication- bcryptjs for password hashing- Express Validator for input validation## Getting Started### Prerequisites- Node.js (v14 or higher)- MongoDB- npm or yarn### Installation1. Clone the repository```bashgit clone <your-repo-url>cd JAKE
Install dependencies for both frontend and backend
bash
Run
# Install frontend dependenciescd clientnpm install# Install backend dependenciescd ../servernpm install
Create a .env file in the server directory with the following variables:
plaintext

PORT=5000MONGODB_URI=your_mongodb_connection_stringJWT_SECRET=your_jwt_secret
Start the development servers
For backend:

bash
Run
cd servernpm start
For frontend:

bash
Run
cd clientnpm start
The frontend will run on http://localhost:3000 and the backend on http://localhost:5000.

API Endpoints
Donor Routes
POST /api/donors/register - Register new donor
POST /api/donors/login - Donor login
GET /api/donors/profile - Get donor profile
GET /api/donors/search - Search donors
GET /api/donors/donations - Get donation history
Admin Routes
POST /api/admin/login - Admin login
GET /api/admin/blood-stock - Get blood stock
PUT /api/admin/blood-stock/:bloodGroup - Update blood stock
GET /api/admin/blood-requests - Get blood requests
User Routes
POST /api/users/register - Register new user
POST /api/users/login - User login
Contributing
Fork the repository
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request

## Acknowledgments
- Thanks to all contributors who have helped shape this project
- Special thanks to the open-source community for the tools and libraries used


This README.md provides a comprehensive overview of your Blood Bank Management System, including its features, technology stack, setup instructions, and API endpoints. It will help users understand your project and get started with it quickly.
