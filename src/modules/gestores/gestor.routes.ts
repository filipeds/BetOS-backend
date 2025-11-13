import { Router } from 'express';
import * as controller from './gestor.controller.js';

const router = Router();

// GET /gestores - Lista gestores com paginação e filtros
router.get('/', controller.listGestores);

// GET /gestores/:id - Busca gestor por ID
router.get('/:id', controller.getGestorById);

// POST /gestores - Cria novo gestor
router.post('/', controller.createGestor);

// PUT /gestores/:id - Atualiza gestor
router.put('/:id', controller.updateGestor);

// DELETE /gestores/:id - Remove gestor
router.delete('/:id', controller.deleteGestor);

export default router;

