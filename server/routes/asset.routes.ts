import { Router } from 'express';

const router = Router();

// Define asset routes here
router.get('/', (req, res) => {
  res.send('Asset route works!');
});

export default router;
