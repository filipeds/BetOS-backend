import { Router } from 'express';
import * as controller from './equipamento.controller.js';

const router = Router();

router.get('/', controller.listEquipamentos);
router.get('/:id', controller.getEquipamentoById);
router.post('/', controller.createEquipamento);
router.put('/:id', controller.updateEquipamento);
router.delete('/:id', controller.deleteEquipamento);

export default router;

