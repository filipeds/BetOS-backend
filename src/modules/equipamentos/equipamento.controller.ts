import { Request, Response, NextFunction } from 'express';
import * as service from './equipamento.service.js';
import {
  createEquipamentoSchema,
  updateEquipamentoSchema,
  equipamentoIdParamSchema,
  listEquipamentosQuerySchema,
} from './equipamento.validators.js';

export async function listEquipamentos(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = listEquipamentosQuerySchema.parse(req.query);
    const result = await service.listEquipamentos(query);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

export async function getEquipamentoById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = equipamentoIdParamSchema.parse(req.params);
    const equipamento = await service.getEquipamentoById(id);
    return res.json(equipamento);
  } catch (err) {
    return next(err);
  }
}

export async function createEquipamento(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const body = createEquipamentoSchema.parse(req.body);
    const created = await service.createEquipamento(body);
    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
}

export async function updateEquipamento(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = equipamentoIdParamSchema.parse(req.params);
    const body = updateEquipamentoSchema.parse(req.body);
    const updated = await service.updateEquipamento(id, body);
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
}

export async function deleteEquipamento(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = equipamentoIdParamSchema.parse(req.params);
    await service.deleteEquipamento(id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

