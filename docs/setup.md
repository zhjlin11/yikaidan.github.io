# 环境搭建

本文档介绍如何安装依赖、配置数据库和环境变量，以及启动后端服务。同时也说明如何在微信开发者工具中导入 `miniprogram/` 目录。

## 安装依赖

### 前端

```bash
cd miniprogram
npm install
```

### 后端

```bash
pip install -r requirements.txt
```

## 配置数据库和环境变量

1. 将仓库根目录下的 `.env.example` 复制为 `.env`。
2. 根据实际情况修改 `.env` 中的数据库连接信息，如 `DB_HOST`、`DB_PORT`、`DB_USER`、`DB_PASSWORD`、`DB_NAME` 等。
3. 后端运行前需要加载这些环境变量。

## 启动后端服务

```bash
source .env
python app.py
```

或根据项目实际使用的命令（如 `npm start`、`flask run` 等）启动。

## 在微信开发者工具中导入 `miniprogram/`

1. 打开微信开发者工具。
2. 选择「导入项目」，项目目录指向本仓库中的 `miniprogram/` 文件夹。
3. 如无 AppID，可选择「无 AppID」。
4. 点击「确定」后即可开始调试。
