import { Router } from 'express';
import routes from './api';

const router = Router();

router.use('/', routes);

export default router;
