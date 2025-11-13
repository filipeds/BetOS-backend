import { Router } from 'express';
import * as controller from './cliente.controller.js';

const router = Router();

// GET /clientes - Lista clientes com paginação e filtros
router.get('/', controller.listClientes);

// GET /clientes/:id - Busca cliente por ID
router.get('/:id', controller.getClienteById);

// POST /clientes - Cria novo cliente
router.post('/', controller.createCliente);

// PUT /clientes/:id - Atualiza cliente
router.put('/:id', controller.updateCliente);

// DELETE /clientes/:id - Remove cliente
router.delete('/:id', controller.deleteCliente);

export default router;

