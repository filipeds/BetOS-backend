import { prisma } from '../../lib/prisma.js';
import { Prisma } from '@prisma/client';

// Tipo para incluir relações no retorno do Prisma
export type DefeitoWithRelations = Prisma.defeitoGetPayload<{
  include: {
    equipamento: true;
  }
}>;

// Função para listar defeitos com paginação e filtros
export async function listDefeitos(params: {
  page: number;
  limit: number;
  search?: string;
  id_equipamento?: number;
}) {
  const { page, limit, search, id_equipamento } = params;
  const skip = (page - 1) * limit;

  const where: Prisma.defeitoWhereInput = {};
  
  if (search) {
    where.OR = [
      { peca: { contains: search } },
      { defeito: { contains: search } }
    ];
  }

  if (id_equipamento !== undefined) {
    where.id_equipamento = id_equipamento;
  }

  const [defeitos, total] = await Promise.all([
    prisma.defeito.findMany({
      where,
      skip,
      take: limit,
      orderBy: { data_registro: 'desc' },
      include: {
        equipamento: {
          select: {
            id_equipamento: true,
            nome: true,
            tipo: true,
            num_serie: true
          }
        }
      }
    }),
    prisma.defeito.count({ where })
  ]);

  return {
    data: defeitos,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

// Função para buscar defeito por ID
export async function findDefeitoById(id: number) {
  return prisma.defeito.findUnique({
    where: { id_defeito: id },
    include: {
      equipamento: {
        select: {
          id_equipamento: true,
          nome: true,
          tipo: true,
          num_serie: true
        }
      }
    }
  });
}

// Função para criar defeito
export async function createDefeito(data: Prisma.defeitoCreateInput) {
  return prisma.defeito.create({
    data,
    include: {
      equipamento: {
        select: {
          id_equipamento: true,
          nome: true,
          tipo: true,
          num_serie: true
        }
      }
    }
  });
}

// Função para atualizar defeito
export async function updateDefeito(id: number, data: Prisma.defeitoUpdateInput) {
  return prisma.defeito.update({
    where: { id_defeito: id },
    data,
    include: {
      equipamento: {
        select: {
          id_equipamento: true,
          nome: true,
          tipo: true,
          num_serie: true
        }
      }
    }
  });
}

// Função para deletar defeito
export async function deleteDefeito(id: number) {
  return prisma.defeito.delete({
    where: { id_defeito: id }
  });
}

