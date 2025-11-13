import { Request, Response, NextFunction } from 'express';
// Tipos do Express para tipar req/res e o next() dos middlewares.

import * as service from './os.service.js';
// Camada de regras de negócio (validações, erros do Prisma, etc.).

import {
  createOSSchema,
  updateOSSchema,
  osIdParamSchema,
  listOSQuerySchema
} from './os.validators.js';
// Schemas Zod: validam/normalizam body, params e query string.

/** GET /os — lista paginada com busca/filtro */
export async function listOS(req: Request, res: Response, next: NextFunction) {
  try {
    // Valida e normaliza a query (?search=&page=&limit=&finalizada=&id_cliente=&id_tecnico=)
    const query = listOSQuerySchema.parse(req.query);

    // Pede os dados ao service (que já sanitiza e monta meta)
    const result = await service.listOS(query);

    // Responde { data: [...], meta: {...} }
    return res.json(result);
  } catch (err) {
    // Delega pro middleware global de erros
    return next(err);
  }
}

/** GET /os/:id — obtém uma OS por id */
export async function getOSById(req: Request, res: Response, next: NextFunction) {
  try {
    // Valida/normaliza :id (string -> number, inteiro/positivo)
    const { id } = osIdParamSchema.parse(req.params);

    // 404 se não existir; service retorna OS completa
    const os = await service.getOSById(id);

    return res.json(os);
  } catch (err) {
    return next(err);
  }
}

/** POST /os — cria nova OS */
export async function createOS(req: Request, res: Response, next: NextFunction) {
  try {
    // Valida body (id_cliente, id_tecnico, custos, defeitos, observacoes, finalizada)
    const body = createOSSchema.parse(req.body);

    // Service trata P2025 (cliente/técnico não encontrado) e sanitiza
    const created = await service.createOS(body);

    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
}

/** PUT /os/:id — atualiza parcialmente uma OS */
export async function updateOS(req: Request, res: Response, next: NextFunction) {
  try {
    // Valida/normaliza :id
    const { id } = osIdParamSchema.parse(req.params);

    // Valida body (todos os campos opcionais, exige ao menos 1)
    const body = updateOSSchema.parse(req.body);

    // Trata 404/P2025 e 409/P2002; sanitiza
    const updated = await service.updateOS(id, body);

    return res.json(updated);
  } catch (err) {
    return next(err);
  }
}

/** DELETE /os/:id — remove OS (hard delete) */
export async function deleteOS(req: Request, res: Response, next: NextFunction) {
  try {
    // Valida/normaliza :id
    const { id } = osIdParamSchema.parse(req.params);

    // 404 se não existir; sem corpo na resposta
    await service.deleteOS(id);

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}
