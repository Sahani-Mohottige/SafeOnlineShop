# Safe Online Shop

A modern, full-stack e-commerce platform built for security, scalability, and a seamless shopping experience.

---

## 1. 🏗️ High-Level Architecture

### Frontend

- **Tech:** React (Vite), Redux Toolkit, TailwindCSS
- **State Management:** Redux slices (cart, orders, products, users, auth)
- **Routing:** React Router
- **UI Libraries:** Lucide-react, react-icons, Sonner (toasts)

### Backend

- **Tech:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT
- **API Endpoints:** `/api/users`, `/api/products`, `/api/cart`, `/api/orders`, `/api/checkout`, `/api/upload`, `/api/subscriber`
- **Middleware:** JWT protection
- **Integrations:** Cloudinary (image upload)

### Database

- **Type:** MongoDB Atlas (cloud)
- **Collections:** Users, Products, Orders, Cart

### External Tools

- JWT (auth)
- TailwindCSS (styling)
- Cloudinary (images)
- Sonner (frontend notifications)

---

## 2. 🚀 Features

- User authentication with JWT & Auth0 (social login, secure registration, multi-factor authentication)
- Secure password hashing and storage
- HTTPS enforced for all local development and production traffic
- Protection against common web vulnerabilities (XSS, CSRF, brute force)
- Product listing, search, and filtering
- Shopping cart & checkout
- Admin dashboard (manage products, orders, users)
- Order tracking

---

## 3. 📦 Tech Stack

- **Frontend:** React, Redux Toolkit, TailwindCSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT

---

## 4. ⚙️ Prerequisites

- Node.js (>=16)
- npm
- MongoDB (local or MongoDB Atlas)

---

## 5. 🗄️ Database Setup

To create your MongoDB database and user, run the following script in your MongoDB shell:

```js
use safeonlineshop;
db.createUser({
  user: "yourUser",
  pwd: "yourPassword",
  roles: [ { role: "readWrite", db: "safeonlineshop" } ]
});
```

- Update your `.env` file with the correct `MONGO_URL`:
  ```
  MONGO_URL=mongodb://yourUser:yourPassword@localhost:27017/safeonlineshop
  ```

---

## 6. 🔧 Installation & Setup

Follow these steps to set up Safe Online Shop locally:

1. **Clone the repository**
   ```sh
   git clone https://github.com/Sahani-Mohottige/SafeOnlineShop.git
   cd SafeOnlineShop
   ```

2. **Install dependencies**
   - **Backend**
     ```sh
     cd Backend
     npm install
     ```
   - **Frontend**
     ```sh
     cd ../Frontend
     npm install
     ```

3. **Configure Environment Variables & Secrets**
   - I have created `.env` files in both `Backend` and `Frontend` folders.
   - Example values to set:
     - **Backend (`/Backend/.env`):**
       ```
       PORT=3001
       MONGO_URL=your_mongodb_connection_string
       JWT_SECRET=your_jwt_secret
       NODE_ENV=development
       CLOUDINARY_CLOUD_NAME=your_cloudinary_name
       CLOUDINARY_API_KEY=your_cloudinary_api_key
       CLOUDINARY_API_SECRET=your_cloudinary_api_secret
       AUTH0_DOMAIN=your_auth0_domain
       AUTH0_AUDIENCE=your_auth0_api_identifier
       ```
     - **Frontend (`/Frontend/.env`):**
       ```
       PORT=5173
       VITE_BACKEND_URL=http://localhost:3001
       VITE_AUTH0_DOMAIN=your_auth0_domain
       VITE_AUTH0_CLIENT_ID=your_auth0_client_id
       VITE_AUTH0_API_IDENTIFIER=your_auth0_api_identifier
       ```
   - Replace all placeholder values with your own credentials and secrets. For Auth0, get these from your Auth0 dashboard.
   - The real values used by me are included in the json file (submitted via ekel).

4. **Set Up SSL Certificates for Local HTTPS**
   - Self-signed SSL certificates are required for secure local development.
   - Certificates are stored in the `crt/` directory:
     - `localhost.crt` (certificate)
     - `localhost.key` (private key)
     - `localhost.conf` (OpenSSL config)
   - To generate new certificates, first ensure you have [OpenSSL](https://www.openssl.org/) installed and added to your system's PATH environment variable.
     - On Windows, you can download OpenSSL from [slproweb.com](https://slproweb.com/products/Win64OpenSSL.html) and follow their installation instructions.
     - After installation, add the OpenSSL `bin` directory to your PATH so you can run `openssl` from any terminal.
   - Then, generate certificates by running:
     ```sh
     openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
       -keyout crt/localhost.key -out crt/localhost.crt \
       -config crt/localhost.conf
     ```
   - If you see browser warnings, you can trust the certificate in your OS for development. 

   - The Vite dev server will run on `https://localhost:5173` and proxy API requests to your backend at `https://localhost:3001` securely.

5. **Start the App**
   - **Start Backend**
     ```sh
     cd Backend
     npm run dev
     ```
   - **Start Frontend** (in a new terminal)
     ```sh
     cd Frontend
     npm run dev
     ```
   - Access your app:
     - Frontend: [https://localhost:5173](https://localhost:5173)
     - Backend: [https://localhost:3001](https://localhost:3001)

---

## 7. 🔐 Auth0 Integration

Safe Online Shop uses Auth0 for secure authentication:

- The frontend uses `@auth0/auth0-react` for login, registration, and user session management.
- The backend validates JWT tokens issued by Auth0 for protected API routes.
- You must configure your own Auth0 domain, client ID, and API identifier in your `.env` files. Never commit these secrets to version control.

Refer to the [Auth0 documentation](https://auth0.com/docs) for more details on setting up your Auth0 tenant and obtaining the required values.

---

## ▶️ Running the App

**Start Backend**
```sh
cd Backend
npm run dev
```

**Start Frontend** (in a new terminal)
```sh
cd Frontend
npm run dev
```

- Frontend: [https://localhost:5173](https://localhost:5173)
- Backend: [https://localhost:3001](https://localhost:3001)

## 🧪 Testing

```sh
npm test
```

## 📂 Project Structure

```
SafeOnlineShop/
│── Backend/        # Express API
│── Frontend/       # React app
│── README.md
```

## 👩‍💻 Author

Developed by Sahani Mohottige
