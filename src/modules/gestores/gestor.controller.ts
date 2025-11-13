import { Request, Response, NextFunction } from 'express';
// Tipos do Express para tipar req/res e o next() dos middlewares.

import * as service from './gestor.service.js';
// Camada de regras de negócio (hash de senha, validações, erros do Prisma, etc.).

import {
  createGestorSchema,
  updateGestorSchema,
  gestorIdParamSchema,
  listGestoresQuerySchema
} from './gestor.validators.js';
// Schemas Zod: validam/normalizam body, params e query string.

/** GET /gestores — lista paginada com busca/filtro */
export async function listGestores(req: Request, res: Response, next: NextFunction) {
  try {
    // Valida e normaliza a query (?search=&page=&limit=&ativo=)
    const query = listGestoresQuerySchema.parse(req.query);

    // Pede os dados ao service (que já sanitiza e monta meta)
    const result = await service.listGestores(query);

    // Responde { data: [...], meta: {...} }
    return res.json(result);
  } catch (err) {
    // Delega pro middleware global de erros
    return next(err);
  }
}

/** GET /gestores/:id — obtém um gestor por id */
export async function getGestorById(req: Request, res: Response, next: NextFunction) {
  try {
    // Valida/normaliza :id (string -> number, inteiro/positivo)
    const { id } = gestorIdParamSchema.parse(req.params);

    // 404 se não existir; service remove 'senha'
    const gestor = await service.getGestorById(id);

    return res.json(gestor);
  } catch (err) {
    return next(err);
  }
}

/** POST /gestores — cria novo gestor */
export async function createGestor(req: Request, res: Response, next: NextFunction) {
  try {
    // Valida body (nome, cnpj, login, senha, ativo)
    const body = createGestorSchema.parse(req.body);

    // Service faz hash da senha, trata P2002 (CNPJ/login duplicado) e sanitiza
    const created = await service.createGestor(body);

    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
}

/** PUT /gestores/:id — atualiza parcialmente um gestor */
export async function updateGestor(req: Request, res: Response, next: NextFunction) {
  try {
    // Valida/normaliza :id
    const { id } = gestorIdParamSchema.parse(req.params);

    // Valida body (todos os campos opcionais, exige ao menos 1)
    const body = updateGestorSchema.parse(req.body);

    // Rehash se senha vier; trata 404/P2025 e 409/P2002; sanitiza
    const updated = await service.updateGestor(id, body);

    return res.json(updated);
  } catch (err) {
    return next(err);
  }
}

/** DELETE /gestores/:id — remove gestor (hard delete) */
export async function deleteGestor(req: Request, res: Response, next: NextFunction) {
  try {
    // Valida/normaliza :id
    const { id } = gestorIdParamSchema.parse(req.params);

    // 404 se não existir; sem corpo na resposta
    await service.deleteGestor(id);

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

