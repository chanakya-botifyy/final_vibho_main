import { Router } from 'express';

const router = Router();

// Define claim routes here
router.get('/', (req, res) => {
  res.send('Claim route works!');
});

export default router;
