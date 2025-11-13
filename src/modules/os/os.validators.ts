import { z } from 'zod';

// Schema para validar o parâmetro ID nas rotas
export const osIdParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

// Schema para criar uma nova OS
export const createOSSchema = z.object({
  id_cliente: z.number().int().positive(),
  id_tecnico: z.number().int().positive().optional(),
  custos: z.number().nonnegative().optional(),
  defeitos: z.string().optional(),
  observacoes: z.string().optional(),
  finalizada: z.enum(['Y', 'N']).optional()
});

// Schema para atualizar uma OS (todos os campos opcionais)
export const updateOSSchema = z.object({
  id_cliente: z.number().int().positive().optional(),
  id_tecnico: z.number().int().positive().optional().nullable(),
  custos: z.number().nonnegative().optional(),
  data_fechamento: z.coerce.date().optional().nullable(),
  defeitos: z.string().optional().nullable(),
  observacoes: z.string().optional().nullable(),
  finalizada: z.enum(['Y', 'N']).optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'Ao menos um campo deve ser fornecido para atualização'
});

// Schema para query de listagem (paginação e filtros)
export const listOSQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  finalizada: z.enum(['Y', 'N']).optional(),
  id_cliente: z.coerce.number().int().positive().optional(),
  id_tecnico: z.coerce.number().int().positive().optional()
});

