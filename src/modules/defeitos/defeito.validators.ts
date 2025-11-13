import { z } from 'zod';

// Schema para validar o parâmetro ID nas rotas
export const defeitoIdParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

// Schema para criar um novo defeito
export const createDefeitoSchema = z.object({
  peca: z.string().min(1),
  defeito: z.string().min(1),
  id_equipamento: z.number().int().positive(),
  data_registro: z.coerce.date().optional()
});

// Schema para atualizar um defeito (todos os campos opcionais)
export const updateDefeitoSchema = z.object({
  peca: z.string().min(1).optional(),
  defeito: z.string().min(1).optional(),
  id_equipamento: z.number().int().positive().optional(),
  data_registro: z.coerce.date().optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'Ao menos um campo deve ser fornecido para atualização'
});

// Schema para query de listagem (paginação e filtros)
export const listDefeitosQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  id_equipamento: z.coerce.number().int().positive().optional()
});

