import { Request, Response, NextFunction } from 'express';
// Tipos do Express para tipar req/res e o next() dos middlewares.

import * as service from './defeito.service.js';
// Camada de regras de negócio (validações, erros do Prisma, etc.).

import {
  createDefeitoSchema,
  updateDefeitoSchema,
  defeitoIdParamSchema,
  listDefeitosQuerySchema
} from './defeito.validators.js';
// Schemas Zod: validam/normalizam body, params e query string.

/** GET /defeitos — lista paginada com busca/filtro */
export async function listDefeitos(req: Request, res: Response, next: NextFunction) {
  try {
    // Valida e normaliza a query (?search=&page=&limit=&id_equipamento=)
    const query = listDefeitosQuerySchema.parse(req.query);

    // Pede os dados ao service (que já sanitiza e monta meta)
    const result = await service.listDefeitos(query);

    // Responde { data: [...], meta: {...} }
    return res.json(result);
  } catch (err) {
    // Delega pro middleware global de erros
    return next(err);
  }
}

/** GET /defeitos/:id — obtém um defeito por id */
export async function getDefeitoById(req: Request, res: Response, next: NextFunction) {
  try {
    // Valida/normaliza :id (string -> number, inteiro/positivo)
    const { id } = defeitoIdParamSchema.parse(req.params);

    // 404 se não existir
    const defeito = await service.getDefeitoById(id);

    return res.json(defeito);
  } catch (err) {
    return next(err);
  }
}

/** POST /defeitos — cria novo defeito */
export async function createDefeito(req: Request, res: Response, next: NextFunction) {
  try {
    // Valida body (peca, defeito, id_equipamento, data_registro)
    const body = createDefeitoSchema.parse(req.body);

    // Service trata P2025 (equipamento não encontrado) e sanitiza
    const created = await service.createDefeito(body);

    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
}

/** PUT /defeitos/:id — atualiza parcialmente um defeito */
export async function updateDefeito(req: Request, res: Response, next: NextFunction) {
  try {
    // Valida/normaliza :id
    const { id } = defeitoIdParamSchema.parse(req.params);

    // Valida body (todos os campos opcionais, exige ao menos 1)
    const body = updateDefeitoSchema.parse(req.body);

    // Trata 404/P2025
    const updated = await service.updateDefeito(id, body);

    return res.json(updated);
  } catch (err) {
    return next(err);
  }
}

/** DELETE /defeitos/:id — remove defeito (hard delete) */
export async function deleteDefeito(req: Request, res: Response, next: NextFunction) {
  try {
    // Valida/normaliza :id
    const { id } = defeitoIdParamSchema.parse(req.params);

    // 404 se não existir; sem corpo na resposta
    await service.deleteDefeito(id);

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

