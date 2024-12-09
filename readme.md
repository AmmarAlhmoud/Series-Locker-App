## Series Locker

**Overview**

This is a React application built with Vite and Node.js/Express.js as the backend, using MongoDB and Mongoose for database operations. It allows users to track their Watched and Planning to Watch series.

**Features:**

- **User Authentication:** Users can sign up, log in, and reset their password via email.
- **Series Management:**
  - Add series with details like name, URL, country, and watching type (watched or planning).
  - Edit existing series information.
  - Delete series.
- **Series Lists:**
  - View lists of watched and planned to watch series.
  - Search series by name, country, or date.

**Technology Stack:**

- **Frontend:** React, Vite, JavaScript, CSS
- **Backend:** Node.js, Express.js, MongoDB, Mongoose

**Getting Started:**

1. **Install Dependencies:**

   - Navigate to the project directory.
   - Install dependencies:

     ```bash
     npm install
     ```

2. **Start Development Server:**

   ```bash
   npm run dev
   ```

   - This will typically launch the app at `http://localhost:5173` in your browser (the exact port may vary).

**Database:**

- **MongoDB:** Set up a MongoDB database and configure the connection details in your backend code.

**Live Website:**

- Visit the live website at: [https://series-locker.netlify.app/].
