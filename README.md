# Mediscripto - Medical Appointment Booking Platform

A full-stack healthcare platform that connects patients with doctors, featuring appointment scheduling, secure payments, and AI-powered chat assistance.

## 🌟 Features

### For Patients
- User registration and authentication
- Browse and search doctors by speciality
- Book and manage appointments
- Secure payment processing with Stripe
- AI-powered FAQ and chat assistance
- View appointment history
- Profile management

### For Doctors
- Dedicated doctor dashboard
- Manage appointment schedule
- View patient appointments
- Update profile and availability
- Professional profile showcase

### For Administrators
- Admin dashboard for platform oversight
- Add and manage doctors
- Monitor all appointments
- User management
- Platform analytics

## 🔧 Tech Stack

### Frontend (Client & Admin)
- React.js with Vite
- React Router for navigation
- Tailwind CSS for styling
- Axios for API requests
- Stripe integration for payments
- React Toastify for notifications

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- Cloudinary for image storage
- Natural.js for AI chat processing
- Stripe payment processing
- Multer for file uploads
- bcrypt for password hashing

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Cloudinary account
- Stripe account

### Environment Variables
Create `.env` files in both backend and frontend directories:

```env
# Backend .env
PORT=4000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/tiwariankit1234/Mediscripto.git
cd Mediscripto
```

2. Install Backend Dependencies
```bash
cd backend
npm install
npm run server
```

3. Install Client Dependencies
```bash
cd ../clientside
npm install
npm run dev
```

4. Install Admin Panel Dependencies
```bash
cd ../admin
npm install
npm run dev
```

## 📁 Project Structure

```
Mediscripto/
├── backend/                 # Backend server
│   ├── config/             # Database & service configs
│   ├── controllers/        # Route controllers
│   ├── middlewares/        # Custom middlewares
│   ├── models/             # Database models
│   └── routes/             # API routes
├── clientside/             # Patient frontend
│   ├── src/
│   │   ├── assets/        # Static assets
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context
│   │   ├── pages/         # Page components
│   │   └── services/      # API services
└── admin/                  # Admin & Doctor panel
    ├── src/
    │   ├── components/    # Admin components
    │   ├── context/       # Admin context
    │   └── pages/         # Admin pages
```

## 🔐 Security Features
- JWT authentication
- Password hashing with bcrypt
- Secure file uploads
- Payment data protection
- Input validation
- Role-based access control

## 🌐 API Endpoints

### User Routes
- POST `/api/user/register` - User registration
- POST `/api/user/login` - User login
- GET `/api/user/get-profile` - Get user profile
- POST `/api/user/book-appointment` - Book appointment
- GET `/api/user/appointments` - List user appointments

### Doctor Routes
- GET `/api/doctor/appointments` - Get doctor appointments
- PUT `/api/doctor/profile` - Update doctor profile

### Admin Routes
- POST `/api/admin/add-doctor` - Add new doctor
- GET `/api/admin/doctors` - List all doctors
- GET `/api/admin/appointments` - View all appointments

## 📱 Mobile Responsiveness
The application is fully responsive and optimized for:
- Desktop browsers
- Tablets
- Mobile devices

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
