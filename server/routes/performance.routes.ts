import { Router } from 'express';

const router = Router();

// Define performance routes here
router.get('/', (req, res) => {
  res.send('Performance route works!');
});

export default router;
