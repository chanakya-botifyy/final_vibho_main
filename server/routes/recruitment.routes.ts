import { Router } from 'express';

const router = Router();

// Define recruitment routes here
router.get('/', (req, res) => {
  res.send('Recruitment route works!');
});

export default router;
