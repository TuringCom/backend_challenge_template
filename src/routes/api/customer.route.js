import { Router } from 'express';
import CustomerController from '../../controllers/customer.controller';
import Schemas from '../../validations/customers.validation';
// import Authorization from '../../middleware/Authorization.middleware';
import Validator from '../../middleware/validator.middleware';

// These are valid routes but they may contain a bug, please try to define and fix them

const { createCustomerSchema } = Schemas;
const { create } = CustomerController;

const router = Router();
router.post('/customers', createCustomerSchema, Validator.validationCheck, create);
router.post('/customers/login', CustomerController.login);
router.get('/customer', CustomerController.getCustomerProfile);
router.put('/customer', CustomerController.apply);
router.put('/customer/address', CustomerController.updateCustomerAddress);
router.put('/customer/creditCard', CustomerController.updateCreditCard);

export default router;
