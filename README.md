├── src/
│   │   ├── config/
│   │   │   └── db.ts                  # Database connection setup
│   │   ├── controllers/
│   │   │   └── UserController.ts      # APIs for user operations
│   │   ├── middlewares/
│   │   │   ├── auth.ts                # Authentication middleware
│   │   │   ├── otpStore.ts            # OTP send & verify functions
│   │   │   └── sendOtp.ts             # Nodemailer OTP service   
│   │   │               
│   │   ├── models/
│   │   │   └── User.ts                # User data schema & types
│   │   ├── routes/
│   │   │   └── user.ts                # User routes connected to controller
│   │   ├── utils/
│   │   │   ├── crypto.ts              # Encrypt, decrypt, hash functions
│   │   │   └── generateToken.ts       # JWT token generation
│   │   └── index.ts                   # Entry point, dotenv, server setup, routes
│   └── .env                            # Environment variables
│       ├── MONGO_URL
│       ├── JWT_SECRET_KEY
│       ├── DATA_ENCRYPTION_KEY
│       ├
│       ├── APP_BASE_URL
│       ├── PORT
│       └── GMAIL_USER / GMAIL_PASS
|── package.json
|── README.md

#run 
npm install
npm run dev

#Tools:
Node.js
Express.js
MongoDB
TypeScript

#Packages:
express
mongoose
nodemailer
dotenv
cors
jsonwebtoken
crypto (built-in Node module)

#Key Note
"I chose JWT instead of sessions because it’s stateless, secure, and scalable, so it avoids server-sharing issues and works better for growing, cloud-based apps."

#Environment Variables
Create a .env file in the backend root directory and add the following variables:
MONGO_URL = mongodb+srv://prasadchavala1999:yR8xrBe2iMXXtsWy@cluster0.ucubc.mongodb.net/secureportal?retryWrites=true&w=majority&appName=secureportal
JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzNDU2Nzg5LCJuYW1lIjoiSm9zZXBoIn0.OpOSSw7e485LOP5PrzScxHb7SR6sAOMRckfFwi4rp7o
DATA_ENCRYPTION_KEY=4c2a4f9d7b3e1f0c8a5b6d7e9f2c3b1a4d6f7e8c2b3a9d5f7c8e9a4b6d7f8c9
DOMAIN_URL=https://secure-backend-bx4z.onrender.com/
APP_BASE_URL= http://localhost:5004
PORT=5004
GMAIL_USER=prasadchavala1999@gmail.com
GMAIL_PASS=ezexlrkbbisyobdr



