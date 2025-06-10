# 项目配置说明

本文档介绍如何在本地环境完成依赖安装、数据库配置以及启动后端服务，同时说明如何在微信开发者工具中导入 `miniprogram/`。

## 安装依赖

### 前端

项目的前端位于 `miniprogram/` 目录。进入该目录后安装依赖：

```bash
cd miniprogram
npm install
```

### 后端

后端基于 Node.js。进入 `server/` 目录后安装依赖：

```bash
cd server
npm install
```

## 配置数据库与环境变量

1. 在 `server/` 目录下创建 `.env` 文件，配置数据库连接与其他环境变量，例如：

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=yourpassword
DB_NAME=yourdbname
```

2. 根据需要修改 `server/config.js` 或其他配置文件使其读取上述环境变量。

确保数据库已经创建并可以从本地访问。

## 启动后端服务

在 `server/` 目录下执行：

```bash
npm start
```

默认会在 `localhost:3000` 启动服务，如需修改端口，可在 `.env` 或配置文件中调整。

## 导入 `miniprogram/`

1. 打开微信开发者工具。
2. 点击“导入项目”，选择仓库中的 `miniprogram/` 目录。
3. 设置 AppID（如无可选择测试号），完成后即可在工具中调试。

