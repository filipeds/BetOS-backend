import express from 'express';           // Framework HTTP minimalista
import cors from 'cors';                  // Middleware para liberar requisições cross-origin
import morgan from 'morgan';              // Logger de requisições (dev-friendly)
import { router } from '../src/routes/index.js';        // Suas rotas montadas em src/routes/index.ts
import { errorHandler } from '../src/middlewares/errorHandler.js'; // Tratador global de erros

export const app = express();
// Exporta a instância do Express para ser usada pelo server.ts e por testes

app.use(cors());
// Em dev, libera tudo por padrão. Se quiser restringir, passe opções: cors({ origin: 'http://...' })

app.use(express.json());
// Faz o parse automático de corpos JSON (req.body já vira objeto JS)

app.use(morgan('dev'));
// Loga cada request no console (método, URL, status, tempo). Útil para depuração.

app.use(router);
// Entra nas rotas principais (ex.: GET /health, e depois montaremos /users)

app.use(errorHandler);
// IMPORTANTÍSSIMO: o middleware de erros deve vir por último,
// para capturar exceções das rotas e responder de forma padronizada.