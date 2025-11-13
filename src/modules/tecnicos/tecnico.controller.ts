import { Request, Response, NextFunction } from 'express';
// Tipos do Express para tipar req/res e o next() dos middlewares.

import * as service from './tecnico.service.js';
// Camada de regras de negócio (hash de senha, validações, erros do Prisma, etc.).

import {
  createTecnicoSchema,
  updateTecnicoSchema,
  tecnicoIdParamSchema,
  listTecnicosQuerySchema
} from './tecnico.validators.js';
// Schemas Zod: validam/normalizam body, params e query string.

/** GET /tecnicos — lista paginada com busca/filtro */
export async function listTecnicos(req: Request, res: Response, next: NextFunction) {
  try {
    // Valida e normaliza a query (?search=&page=&limit=&ativo=&id_gestor=)
    const query = listTecnicosQuerySchema.parse(req.query);

    // Pede os dados ao service (que já sanitiza e monta meta)
    const result = await service.listTecnicos(query);

    // Responde { data: [...], meta: {...} }
    return res.json(result);
  } catch (err) {
    // Delega pro middleware global de erros
    return next(err);
  }
}

/** GET /tecnicos/:id — obtém um técnico por id */
export async function getTecnicoById(req: Request, res: Response, next: NextFunction) {
  try {
    // Valida/normaliza :id (string -> number, inteiro/positivo)
    const { id } = tecnicoIdParamSchema.parse(req.params);

    // 404 se não existir; service remove 'senha'
    const tecnico = await service.getTecnicoById(id);

    return res.json(tecnico);
  } catch (err) {
    return next(err);
  }
}

/** POST /tecnicos — cria novo técnico */
export async function createTecnico(req: Request, res: Response, next: NextFunction) {
  try {
    // Valida body (nome, cnpj, login, senha, id_gestor, ativo)
    const body = createTecnicoSchema.parse(req.body);

    // Service faz hash da senha, verifica gestor, trata P2002 (CNPJ/login duplicado) e sanitiza
    const created = await service.createTecnico(body);

    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
}

/** PUT /tecnicos/:id — atualiza parcialmente um técnico */
export async function updateTecnico(req: Request, res: Response, next: NextFunction) {
  try {
    // Valida/normaliza :id
    const { id } = tecnicoIdParamSchema.parse(req.params);

    // Valida body (todos os campos opcionais, exige ao menos 1)
    const body = updateTecnicoSchema.parse(req.body);

    // Rehash se senha vier; verifica gestor se fornecido; trata 404/P2025 e 409/P2002; sanitiza
    const updated = await service.updateTecnico(id, body);

    return res.json(updated);
  } catch (err) {
    return next(err);
  }
}

/** DELETE /tecnicos/:id — remove técnico (hard delete) */
export async function deleteTecnico(req: Request, res: Response, next: NextFunction) {
  try {
    // Valida/normaliza :id
    const { id } = tecnicoIdParamSchema.parse(req.params);

    // 404 se não existir; sem corpo na resposta
    await service.deleteTecnico(id);

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

