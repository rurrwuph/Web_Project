# TripSync - Bus Management System

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</p>

TripSync is a comprehensive and modern bus trip management platform designed to streamline the booking process for passengers and provide robust management tools for transport operators. Built with a focus on usability and efficiency, it offers a seamless experience from searching for trips to final seat selection and payment.

## Key Features

- **Intuitive Trip Search**: Easily find bus trips by specifying origin, destination, and travel date.
- **Interactive Seat Selection**: Visual bus layouts that allow users to pick their preferred seats in real-time.
- **Dynamic Booking System**: Manage bookings, view e-tickets, and handle partial cancellations.
- **Secure Payment Gateway**: Integration for secure transactions with support for coupon-based discounts.
- **Operator & Admin Dashboards**: 
  - Manage buses, routes, and trips.
  - Track revenue, booking analytics, and route profitability.
  - Monitor past and upcoming trips.
- **User Profile Management**: Personalized dashboards for users to track travel history and manage account settings.
- **Email Notifications**: Automated email confirmations for bookings and cancellations (Powered by EmailJS).
- **Modern Tech Stack**: Built using React, Node.js, Express, and PostgreSQL.

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Project
   ```

2. **Backend Setup**:
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file in the `backend` folder and add your environment variables:
     ```env
     PORT=5000
     DB_USER=your_db_user
     DB_PASSWORD=your_db_password
     DB_HOST=localhost
     DB_PORT=5432
     DB_NAME=your_db_name
     JWT_SECRET=your_secret_key
     ```
   - Start the server:
     ```bash
     npm run server
     ```

3. **Frontend Setup**:
   - Navigate to the frontend directory:
     ```bash
     cd ../frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file in the `frontend` folder:
     ```env
     VITE_EMAILJS_SERVICE_ID=your_service_id
     VITE_EMAILJS_TEMPLATE_ID=your_template_id
     VITE_EMAILJS_PUBLIC_KEY=your_public_key
     VITE_EMAIL_SERVICE_ENABLED=true
     ```
   - Start the development server:
     ```bash
     npm run dev
     ```

## Important Note

> [!IMPORTANT]
> **Point Reward System**: The point reward and loyalty system is currently under development. While the interface may show point-related elements, the logic is not yet functional. It is expected to be fully operational within a few days.


