# 💸 Wallet App — Personal Expense Tracker

A full-stack, cross-platform mobile application that helps users effortlessly track their income and expenses. Built with React Native, Node.js, PostgreSQL, and integrated with SMS and Gmail parsing to auto-track financial transactions.

## 🔥 Features

### 📱 Mobile App (React Native)
- Add, edit, and delete income or expense transactions.
- View real-time balance with categorized summaries.
- Categorize transactions (Food, Bills, Salary, etc.).
- Secure user authentication using Clerk.
- Automatically parse SMS and Gmail messages for transaction insights.
- Built with TypeScript, React Native, and Expo.

### 🛠️ Backend (Node.js + PostgreSQL)
- RESTful API using Express.js and Neon/PostgreSQL.
- Google OAuth integration to access and parse Gmail for transaction data.
- SMS message parsing logic for offline tracking support.
- Duplicate transaction prevention and secure data handling.
- Hosted with serverless Neon DB and deployed on Vercel/Render.

## ✨ Tech Stack

| Layer     | Technology                     |
|-----------|--------------------------------|
| Frontend  | React Native, TypeScript, Expo |
| Backend   | Node.js, Express.js            |
| Database  | PostgreSQL (Neon Serverless)   |
| Auth      | Clerk, Google OAuth            |
| Dev Tools | EAS (Expo Application Services), GitHub |

## 📂 Folder Structure
wallet-app/
├── backend/ # Node.js backend (API, DB, Auth)
├── mobile/ # React Native mobile frontend
├── README.md # You're here!


## 🚀 Getting Started

### Prerequisites
- Node.js
- Expo CLI
- PostgreSQL DB (Neon recommended)
- Clerk account for authentication
- Google Developer Console project for OAuth

### Setup

#### Backend
```bash
cd backend
npm install
touch .env
# Add DATABASE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, etc.
npm start
```
Mobile App
```bash
cd mobile
npm install
npx expo start
```
🧠 Smart Parsing Logic
  📩 SMS Parsing: Uses regex patterns to extract amounts and categorize transactions as income or expense from SMS texts.
  📧 Email Parsing: Secure Google OAuth-based Gmail integration to fetch and parse transaction-related emails.

  📸 Screenshots
  ![photo_2025-07-20_15-35-40](https://github.com/user-attachments/assets/6a3ff872-ee06-4979-b70c-71f16b9c4ea4)
  ![photo_2025-07-20_15-35-46](https://github.com/user-attachments/assets/063fdd7b-d373-458f-aeef-a12129921dbf)
  ![photo_2025-07-20_15-35-51](https://github.com/user-attachments/assets/c3eae20b-a803-4873-98d7-e4d2e3fb1383)

🛡️ Security & Privacy
  OAuth tokens and user data are securely handled and never stored insecurely.
  Duplicate entries are detected using timestamp, amount, and description logic.

📄 License
This project is licensed under the MIT License.

