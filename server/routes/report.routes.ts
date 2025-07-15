import { Router } from 'express';

const router = Router();

// Define report routes here
router.get('/', (req, res) => {
  res.send('Report route works!');
});

export default router;
