import { Router } from 'express';
import * as controller from './defeito.controller.js';

const router = Router();

// GET /defeitos - Lista defeitos com paginação e filtros
router.get('/', controller.listDefeitos);

// GET /defeitos/:id - Busca defeito por ID
router.get('/:id', controller.getDefeitoById);

// POST /defeitos - Cria novo defeito
router.post('/', controller.createDefeito);

// PUT /defeitos/:id - Atualiza defeito
router.put('/:id', controller.updateDefeito);

// DELETE /defeitos/:id - Remove defeito
router.delete('/:id', controller.deleteDefeito);

export default router;

