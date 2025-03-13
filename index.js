import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { Prisma } from '@prisma/client';
dotenv.config();

import { login } from './src/api/login.js';
import { register } from './src/api/register.js';
import { authToken } from './src/utils/authToken.js';

const app = express();

app.use(cors());
app.use(bodyParser.json())

app.get("/health", (req, res) => {
  res.status(200).json({
    message: "OK"
  })
})

app.post("/api/login", authToken, login);
app.post("/api/register", register);

// Prisma 错误处理中间件
app.use((err, req, res, next) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // 处理已知的 Prisma 请求错误
    switch (err.code) {
      case 'P2002':
        return res.status(409).json({
          error: '唯一性约束冲突',
          field: err.meta?.target
        });
      case 'P2025':
        return res.status(404).json({
          error: '记录未找到'
        });
      default:
        return res.status(400).json({
          error: '数据库操作错误',
          code: err.code
        });
    }
  }
  
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      error: '数据验证错误'
    });
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    return res.status(500).json({
      error: '数据库连接错误'
    });
  }

  // 其他未处理的错误
  next(err);
});

const port = process.env.PORT || 9090;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})
