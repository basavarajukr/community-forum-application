 Community Forum Application

A Full Stack Community Forum built with:
- Frontend: React.js
- Backend: Node.js, Express.js, Prisma ORM
- Database: MySQL

 Project Structure

Community-forum/
- backend/
- frontend/

Getting Started

Clone the Repository

git clone https://github.com/basavarajukr/community-forum-application.git
cd community-forum-application

Backend Setup (Node.js + Prisma + MySQL)

Step 1: Navigate to backend folder
cd backend

Step 2: Install backend dependencies
npm install

Step 3: Configure .env
Create a .env file in the backend folder and add your MySQL database connection string:
DATABASE_URL="mysql://yourusername:yourpassword@localhost:3306/yourdbname"
JWT_SECRET="yoursecretkey"

Step 4: Run Prisma migrations
npx prisma migrate dev

Step 5: Generate Prisma client
npx prisma generate

Step 6: Start the backend server
npm run dev
The backend server will start on http://localhost:5000

Frontend Setup (React.js)

Step 1: Open new terminal and navigate to frontend folder
cd ../frontend

Step 2: Install frontend dependencies
npm install

Step 3: Start the frontend app
npm start

The frontend app will run on http://localhost:3000

Now Open Your App

Frontend: http://localhost:3000

Backend API: http://localhost:5000

Tech Stacks used:

Frontend: React.js, Axios, React Router, Redux, TypScript

Backend: Node.js, Express.js, Prisma ORM

Database: MySQL

Authentication: JWT + Passport.js
