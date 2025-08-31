# SafeOnlineShop Backend

## Running the Backend Locally (with HTTPS)

1. **Clone the repository:**
   ```sh
   git clone https://github.com/<your-username>/SafeOnlineShop.git
   cd SafeOnlineShop/Backend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Create a `.env` file:**
   - Copy `.env.example` to `.env` and fill in the required values (e.g., `PORT`, database URI, secrets).

4. **Generate SSL certificates (for local HTTPS):**
   - Make sure you have OpenSSL installed.
   - Run this command in PowerShell:
     ```powershell
     & "C:\Program Files\OpenSSL-Win64\bin\openssl.exe" req -nodes -new -x509 -keyout privkey.pem -out fullchain.pem -days 365
     ```
   - Place `privkey.pem` and `fullchain.pem` in the `Backend` folder.

5. **Start the server:**
   - For HTTPS (production mode):
     ```powershell
     $env:NODE_ENV="production"; npm start
     ```
   - For HTTP (development mode):
     ```powershell
     npm start
     ```

6. **Access the API:**
   - HTTPS: `https://localhost:<PORT>`
   - HTTP: `http://localhost:<PORT>`

---

## Deploying the Frontend on Tomcat

1. **Build the frontend:**
   ```sh
   cd ../Frontend
   npm install
   npm run build
   ```
   - The production build will be in the `dist/` folder.

2. **Deploy to Tomcat:**
   - Copy the contents of `dist/` to the `webapps/ROOT` directory of your Tomcat server.
   - Restart Tomcat.
   - Access your app at `https://<your-server-domain>/` (ensure Tomcat is configured for HTTPS).

3. **Configure Tomcat for HTTPS:**
   - Follow the [Tomcat SSL setup guide](https://tomcat.apache.org/tomcat-9.0-doc/ssl-howto.html) to enable HTTPS and install your certificate.

---

## MongoDB Database Creation Script

Create a database and user for your app (run in MongoDB shell):

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

## Notes
- Do NOT commit your SSL certificate files (`privkey.pem`, `fullchain.pem`). They are already excluded in `.gitignore`.
- For production, use certificates from a trusted Certificate Authority.
- Update your frontend API URLs to use HTTPS if running in production mode.
