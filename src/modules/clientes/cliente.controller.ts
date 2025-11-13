import { Request, Response, NextFunction } from 'express';
// Tipos do Express para tipar req/res e o next() dos middlewares.

import * as service from './cliente.service.js';
// Camada de regras de negócio (validações, erros do Prisma, etc.).

import {
  createClienteSchema,
  updateClienteSchema,
  clienteIdParamSchema,
  listClientesQuerySchema
} from './cliente.validators.js';
// Schemas Zod: validam/normalizam body, params e query string.

/** GET /clientes — lista paginada com busca/filtro */
export async function listClientes(req: Request, res: Response, next: NextFunction) {
  try {
    // Valida e normaliza a query (?search=&page=&limit=&ativo=)
    const query = listClientesQuerySchema.parse(req.query);

    // Pede os dados ao service (que já sanitiza e monta meta)
    const result = await service.listClientes(query);

    // Responde { data: [...], meta: {...} }
    return res.json(result);
  } catch (err) {
    // Delega pro middleware global de erros
    return next(err);
  }
}

/** GET /clientes/:id — obtém um cliente por id */
export async function getClienteById(req: Request, res: Response, next: NextFunction) {
  try {
    // Valida/normaliza :id (string -> number, inteiro/positivo)
    const { id } = clienteIdParamSchema.parse(req.params);

    // 404 se não existir
    const cliente = await service.getClienteById(id);

    return res.json(cliente);
  } catch (err) {
    return next(err);
  }
}

/** POST /clientes — cria novo cliente */
export async function createCliente(req: Request, res: Response, next: NextFunction) {
  try {
    // Valida body (nome, cnpj, cep, numero, telefone, ativo)
    const body = createClienteSchema.parse(req.body);

    // Service trata P2002 (CNPJ duplicado) e sanitiza
    const created = await service.createCliente(body);

    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
}

/** PUT /clientes/:id — atualiza parcialmente um cliente */
export async function updateCliente(req: Request, res: Response, next: NextFunction) {
  try {
    // Valida/normaliza :id
    const { id } = clienteIdParamSchema.parse(req.params);

    // Valida body (todos os campos opcionais, exige ao menos 1)
    const body = updateClienteSchema.parse(req.body);

    // Trata 404/P2025 e 409/P2002
    const updated = await service.updateCliente(id, body);

    return res.json(updated);
  } catch (err) {
    return next(err);
  }
}

/** DELETE /clientes/:id — remove cliente (hard delete) */
export async function deleteCliente(req: Request, res: Response, next: NextFunction) {
  try {
    // Valida/normaliza :id
    const { id } = clienteIdParamSchema.parse(req.params);

    // 404 se não existir; sem corpo na resposta
    await service.deleteCliente(id);

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}
