import { Router } from 'express';
import CustomerController from '../../controllers/customer.controller';

// These are valid routes but they may contain a bug, please try to define and fix them

const router = Router();
router.post(
  '/customers',
  CustomerController.updateCreditCard
);
router.post('/customers/login',  CustomerController.login);
router.get('/customer', CustomerController.getCustomerProfile);
router.put(
  '/customer',
  CustomerController.apply
);
router.put(
  '/customer/address',
  CustomerController.updateCustomerAddress
);
router.put(
  '/customer/creditCard',
  CustomerController.updateCreditCard
);

export default router;
