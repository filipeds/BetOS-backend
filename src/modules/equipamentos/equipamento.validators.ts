import { z } from 'zod';
import { equipamento_tipo } from '@prisma/client';

export const equipamentoIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createEquipamentoSchema = z.object({
  nome: z.string().min(1),
  tipo: z.nativeEnum(equipamento_tipo),
  num_serie: z.string().min(1),
  numero_os: z.number().int().positive(),
});

export const updateEquipamentoSchema = z
  .object({
    nome: z.string().min(1).optional(),
    tipo: z.nativeEnum(equipamento_tipo).optional(),
    num_serie: z.string().min(1).optional(),
    numero_os: z.number().int().positive().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Ao menos um campo deve ser fornecido para atualização',
  });

export const listEquipamentosQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  tipo: z.nativeEnum(equipamento_tipo).optional(),
  numero_os: z.coerce.number().int().positive().optional(),
});

