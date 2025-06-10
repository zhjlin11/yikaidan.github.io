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
3. **Configure environment variables**
   Set database and微信支付相关配置，例如：
   ```bash
   export MYSQL_URI='mysql://user:pass@localhost:3306/app_db'
   export WECHAT_APPID='your_appid'
   export WECHAT_MCHID='your_mch_id'
   export WECHAT_KEY='your_sign_key'
   export WECHAT_NOTIFY_URL='https://your.domain/wechat/pay/callback'
   ```

4. **Start the server**
   ```bash
   cd server
   npm install
   npm start
   ```

5. **Run the mini program**
   Use the WeChat developer tool to open the `miniprogram` directory.
