import { Router } from 'express';
import * as controller from './tecnico.controller.js';

const router = Router();

// GET /tecnicos - Lista técnicos com paginação e filtros
router.get('/', controller.listTecnicos);

// GET /tecnicos/:id - Busca técnico por ID
router.get('/:id', controller.getTecnicoById);

// POST /tecnicos - Cria novo técnico
router.post('/', controller.createTecnico);

// PUT /tecnicos/:id - Atualiza técnico
router.put('/:id', controller.updateTecnico);

// DELETE /tecnicos/:id - Remove técnico
router.delete('/:id', controller.deleteTecnico);

export default router;

