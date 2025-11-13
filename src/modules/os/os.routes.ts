import { Router } from 'express';
import * as controller from './os.controller.js';

const router = Router();

router.get('/', controller.listOS);
router.get('/:id', controller.getOSById);
router.post('/', controller.createOS);
router.put('/:id', controller.updateOS);
router.delete('/:id', controller.deleteOS);

export default router;