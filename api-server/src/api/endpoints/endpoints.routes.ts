import { Router } from 'express';
import { protect } from '../auth/auth.middleware';
import { getEndpoints, addEndpoint, updateEndpoint, deleteEndpoint } from './endpoints.controller';

const router = Router();

// Aplicamos o middleware 'protect' a todas as rotas abaixo
// Qualquer requisição para essas rotas deve ter um token JWT válido
router.use(protect);

// Rota para buscar todos os endpoints do usuário logado
router.get('/', getEndpoints);

// Rota para adicionar um novo endpoint
router.post('/', addEndpoint);

// Rota para atualizar um endpoint existente
// :id é um parâmetro dinâmico que representa o ID do endpoint
router.put('/:id', updateEndpoint);

// Rota para deletar um endpoint
router.delete('/:id', deleteEndpoint);

export default router;