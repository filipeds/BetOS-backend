import { z } from 'zod';

// Schema para validar o parâmetro ID nas rotas
export const clienteIdParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

// Schema para criar um novo cliente
export const createClienteSchema = z.object({
  nome: z.string().min(1).max(100),
  cnpj: z.string().length(18),
  cep: z.string().length(9),
  numero: z.string().max(10),
  telefone: z.string().max(20),
  ativo: z.boolean().optional()
});

// Schema para atualizar um cliente (todos os campos opcionais)
export const updateClienteSchema = z.object({
  nome: z.string().min(1).max(100).optional(),
  cnpj: z.string().length(18).optional(),
  cep: z.string().length(9).optional(),
  numero: z.string().max(10).optional(),
  telefone: z.string().max(20).optional(),
  ativo: z.boolean().optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'Ao menos um campo deve ser fornecido para atualização'
});

// Schema para query de listagem (paginação e filtros)
export const listClientesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  ativo: z.coerce.boolean().optional()
});

