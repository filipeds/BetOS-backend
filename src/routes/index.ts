import { Router } from 'express'; 
// Importa o construtor de roteadores do Express, permitindo agrupar rotas em um mini-app.
import clienteRoutes from '../modules/clientes/cliente.routes.js';
import gestorRoutes from '../modules/gestores/gestor.routes.js';
import tecnicoRoutes from '../modules/tecnicos/tecnico.routes.js';
import osRoutes from '../modules/os/os.routes.js';
import defeitoRoutes from '../modules/defeitos/defeito.routes.js';
import equipamentoRoutes from '../modules/equipamentos/equipamento.routes.js';

export const router = Router();
// Cria uma instância de Router. Você vai "montá-la" depois no app principal (ex.: app.use(router)).

// Rota de health check (verificação rápida se o servidor está de pé)
router.get('/health', (_req, res) => {
  // _req: usamos o prefixo _ para indicar que o parâmetro não é utilizado aqui.
  res.json({
    status: 'ok',                
    uptime: process.uptime(),     
    timestamp: new Date().toISOString() 
  });
});

// Rotas dos módulos
router.use('/clientes', clienteRoutes);
router.use('/gestores', gestorRoutes);
router.use('/tecnicos', tecnicoRoutes);
router.use('/os', osRoutes);
router.use('/defeitos', defeitoRoutes);
router.use('/equipamentos', equipamentoRoutes);