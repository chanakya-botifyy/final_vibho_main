import { Router } from 'express';

const router = Router();

// Define document routes here
router.get('/', (req, res) => {
  res.send('Document route works!');
});

export default router;
