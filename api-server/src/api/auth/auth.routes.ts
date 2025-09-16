import { Router } from 'express';
// Importa ambas as funções do controller
import { registerUser, loginUser } from './auth.controller';

const router = Router();

// Rota de registro (existente)
router.post('/register', registerUser);

// NOVA ROTA de login
router.post('/login', loginUser);

export default router;