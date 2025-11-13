import { prisma } from '../../lib/prisma.js';
import { Prisma } from '@prisma/client';

// Tipo para incluir relações no retorno do Prisma
export type TecnicoWithRelations = Prisma.tecnicoGetPayload<{
  include: {
    gestor: true;
    ordem_servico: true;
  }
}>;

// Função para listar técnicos com paginação e filtros
export async function listTecnicos(params: {
  page: number;
  limit: number;
  search?: string;
  ativo?: boolean;
  id_gestor?: number;
}) {
  const { page, limit, search, ativo, id_gestor } = params;
  const skip = (page - 1) * limit;

  const where: Prisma.tecnicoWhereInput = {};
  
  if (search) {
    where.OR = [
      { nome: { contains: search } },
      { cnpj: { contains: search } },
      { login: { contains: search } }
    ];
  }

  if (ativo !== undefined) {
    where.ativo = ativo;
  }

  if (id_gestor !== undefined) {
    where.id_gestor = id_gestor;
  }

  const [tecnicos, total] = await Promise.all([
    prisma.tecnico.findMany({
      where,
      skip,
      take: limit,
      orderBy: { data_cadastro: 'desc' },
      select: {
        id_tecnico: true,
        nome: true,
        cnpj: true,
        login: true,
        id_gestor: true,
        data_cadastro: true,
        ativo: true,
        gestor: {
          select: {
            id_gestor: true,
            nome: true,
            cnpj: true
          }
        }
      }
    }),
    prisma.tecnico.count({ where })
  ]);

  return {
    data: tecnicos,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

// Função para buscar técnico por ID
export async function findTecnicoById(id: number) {
  return prisma.tecnico.findUnique({
    where: { id_tecnico: id },
    select: {
      id_tecnico: true,
      nome: true,
      cnpj: true,
      login: true,
      id_gestor: true,
      data_cadastro: true,
      ativo: true,
      gestor: {
        select: {
          id_gestor: true,
          nome: true,
          cnpj: true
        }
      },
      ordem_servico: {
        select: {
          numero_os: true,
          data_abertura: true,
          finalizada: true
        }
      }
    }
  });
}

// Função para criar técnico
export async function createTecnico(data: Prisma.tecnicoCreateInput) {
  return prisma.tecnico.create({
    data,
    select: {
      id_tecnico: true,
      nome: true,
      cnpj: true,
      login: true,
      id_gestor: true,
      data_cadastro: true,
      ativo: true
    }
  });
}

// Função para atualizar técnico
export async function updateTecnico(id: number, data: Prisma.tecnicoUpdateInput) {
  return prisma.tecnico.update({
    where: { id_tecnico: id },
    data,
    select: {
      id_tecnico: true,
      nome: true,
      cnpj: true,
      login: true,
      id_gestor: true,
      data_cadastro: true,
      ativo: true
    }
  });
}

// Função para deletar técnico
export async function deleteTecnico(id: number) {
  return prisma.tecnico.delete({
    where: { id_tecnico: id }
  });
}

