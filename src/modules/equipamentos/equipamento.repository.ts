import { prisma } from '../../lib/prisma.js';
import { Prisma } from '@prisma/client';

export type EquipamentoWithRelations = Prisma.equipamentoGetPayload<{
  include: {
    ordem_servico: {
      select: {
        numero_os: true;
        custos: true;
        data_abertura: true;
        data_fechamento: true;
        finalizada: true;
        id_cliente: true;
        id_tecnico: true;
      };
    };
    defeito: {
      select: {
        id_defeito: true;
        peca: true;
        defeito: true;
        data_registro: true;
      };
    };
  };
}>;

export async function listEquipamentos(params: {
  page: number;
  limit: number;
  search?: string;
  tipo?: Prisma.equipamentoWhereInput['tipo'];
  numero_os?: number;
}) {
  const { page, limit, search, tipo, numero_os } = params;
  const skip = (page - 1) * limit;

  const where: Prisma.equipamentoWhereInput = {};

  if (search) {
    where.OR = [
      { nome: { contains: search } },
      { num_serie: { contains: search } },
    ];
  }

  if (tipo !== undefined) {
    where.tipo = tipo;
  }

  if (numero_os !== undefined) {
    where.numero_os = numero_os;
  }

  const [equipamentos, total] = await Promise.all([
    prisma.equipamento.findMany({
      where,
      skip,
      take: limit,
      orderBy: { id_equipamento: 'asc' },
      include: {
        ordem_servico: {
          select: {
            numero_os: true,
            custos: true,
            data_abertura: true,
            data_fechamento: true,
            finalizada: true,
            id_cliente: true,
            id_tecnico: true,
          },
        },
        defeito: {
          select: {
            id_defeito: true,
            peca: true,
            defeito: true,
            data_registro: true,
          },
        },
      },
    }),
    prisma.equipamento.count({ where }),
  ]);

  return {
    data: equipamentos,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function findEquipamentoById(id: number) {
  return prisma.equipamento.findUnique({
    where: { id_equipamento: id },
    include: {
      ordem_servico: {
        select: {
          numero_os: true,
          custos: true,
          data_abertura: true,
          data_fechamento: true,
          finalizada: true,
          id_cliente: true,
          id_tecnico: true,
        },
      },
      defeito: {
        select: {
          id_defeito: true,
          peca: true,
          defeito: true,
          data_registro: true,
        },
      },
    },
  });
}

export async function createEquipamento(data: Prisma.equipamentoCreateInput) {
  return prisma.equipamento.create({
    data,
    include: {
      ordem_servico: {
        select: {
          numero_os: true,
          custos: true,
          data_abertura: true,
          data_fechamento: true,
          finalizada: true,
          id_cliente: true,
          id_tecnico: true,
        },
      },
      defeito: {
        select: {
          id_defeito: true,
          peca: true,
          defeito: true,
          data_registro: true,
        },
      },
    },
  });
}

export async function updateEquipamento(
  id: number,
  data: Prisma.equipamentoUpdateInput,
) {
  return prisma.equipamento.update({
    where: { id_equipamento: id },
    data,
    include: {
      ordem_servico: {
        select: {
          numero_os: true,
          custos: true,
          data_abertura: true,
          data_fechamento: true,
          finalizada: true,
          id_cliente: true,
          id_tecnico: true,
        },
      },
      defeito: {
        select: {
          id_defeito: true,
          peca: true,
          defeito: true,
          data_registro: true,
        },
      },
    },
  });
}

export async function deleteEquipamento(id: number) {
  return prisma.equipamento.delete({
    where: { id_equipamento: id },
  });
}

