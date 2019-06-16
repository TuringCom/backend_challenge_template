import { Router } from 'express';
import TaxController from '../../controllers/tax.controller';

const router = Router();

// These are valid routes but they may contain a bug, please try to define and fix them

router.get('/tax', TaxController.getAllTax);
router.get('/tax/:tax_id', TaxController.call);

export default router;
