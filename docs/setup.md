# Setup Guide

1. **Install dependencies**
   - Install Node.js from [nodejs.org](https://nodejs.org/).
   - Install MySQL and ensure the service is running.
2. **Create the database**
   ```bash
   mysql -u root -p -e "CREATE DATABASE app_db;"
   ```
   Then set the `MYSQL_URI` environment variable, for example:
   ```bash
   export MYSQL_URI='mysql://user:pass@localhost:3306/app_db'
   ```
3. **Start the server**
   ```bash
   cd server
   npm install
   npm start
   ```
4. **Run the mini program**
   Use the WeChat developer tool to open the `miniprogram` directory.
