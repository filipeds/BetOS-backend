import { z } from 'zod';

// Schema para validar o parâmetro ID nas rotas
export const gestorIdParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

// Schema para criar um novo gestor
export const createGestorSchema = z.object({
  nome: z.string().min(1).max(100),
  cnpj: z.string().length(18),
  login: z.string().min(1).max(50),
  senha: z.string().min(6).max(255),
  ativo: z.boolean().optional()
});

// Schema para atualizar um gestor (todos os campos opcionais)
export const updateGestorSchema = z.object({
  nome: z.string().min(1).max(100).optional(),
  cnpj: z.string().length(18).optional(),
  login: z.string().min(1).max(50).optional(),
  senha: z.string().min(6).max(255).optional(),
  ativo: z.boolean().optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'Ao menos um campo deve ser fornecido para atualização'
});

// Schema para query de listagem (paginação e filtros)
export const listGestoresQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  ativo: z.coerce.boolean().optional()
});

