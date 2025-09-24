# Fastag App 🚗💳

A full-stack **FASTag management system** built with **React (frontend)**, **Node.js + Express (backend)**, and **MySQL (database)**.  
This app allows users to view FASTag balances, recharge accounts, and track transactions.

---

## 📂 Project Structure
astag-app/
│
├── backend/ # Node.js + Express backend
│ ├── server.js # Entry point for backend
│ ├── db.js # MySQL connection
│ ├── routes/ # API route handlers
│ │ ├── users.js
│ │ ├── transactions.js
│ │ └── recharge.js
│ └── package.json
│
├── frontend/ # React frontend
│ ├── public/
│ │ └── index.html
│ ├── src/
│ │ ├── App.js
│ │ ├── index.js
│ │ ├── App.css
│ │ └── components/
│ │ ├── Navbar.js
│ │ ├── Balance.js
│ │ ├── Transactions.js
│ │ └── Recharge.js
│ └── package.json
│
└── README.md


---

## ⚙️ Setup Instructions

### 1. Clone the Repository

git clone https://github.com/your-username/fastag-app.git
cd fastag-app

2. Setup Backend
cd backend
npm install


Create .env in backend/:

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=fastagdb


Run backend:

npm start


You should see:

Server running on port 5000
Connected to MySQL

3. Setup Database
CREATE DATABASE fastagdb;

USE fastagdb;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  balance DECIMAL(10,2)
);

CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  amount DECIMAL(10,2),
  type ENUM('debit','credit'),
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);


Insert sample users:

INSERT INTO users (name, balance) VALUES
('Ravi Kumar', 500.00),
('Sneha Sharma', 1200.00),
('Amit Verma', 800.00);

4. Setup Frontend
cd ../frontend
npm install
npm start


Runs at http://localhost:3000

🚀 Features

User balance display

Transaction history

Recharge wallet functionality

MySQL integration

API built with Express

📡 API Endpoints
Method	Endpoint	Description
GET	/api/users/:id	Get user balance
GET	/api/transactions/:id	Get user transaction history
POST	/api/recharge	Recharge user wallet
🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

