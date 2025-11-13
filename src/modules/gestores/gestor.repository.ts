import { prisma } from '../../lib/prisma.js';
import { Prisma } from '@prisma/client';

// Tipo para incluir relações no retorno do Prisma
export type GestorWithRelations = Prisma.gestorGetPayload<{
  include: {
    tecnico: true;
  }
}>;

// Função para listar gestores com paginação e filtros
export async function listGestores(params: {
  page: number;
  limit: number;
  search?: string;
  ativo?: boolean;
}) {
  const { page, limit, search, ativo } = params;
  const skip = (page - 1) * limit;

  const where: Prisma.gestorWhereInput = {};
  
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

  const [gestores, total] = await Promise.all([
    prisma.gestor.findMany({
      where,
      skip,
      take: limit,
      orderBy: { data_cadastro: 'desc' },
      select: {
        id_gestor: true,
        nome: true,
        cnpj: true,
        login: true,
        data_cadastro: true,
        ativo: true,
        tecnico: {
          select: {
            id_tecnico: true,
            nome: true,
            cnpj: true,
            login: true
          }
        }
      }
    }),
    prisma.gestor.count({ where })
  ]);

  return {
    data: gestores,
    // meta: {
    //   search,
    //   page,
    //   limit,
    //   total,
    //   totalPages: Math.ceil(total / limit)
    // }
  };
}

// Função para buscar gestor por ID
export async function findGestorById(id: number) {
  return prisma.gestor.findUnique({
    where: { id_gestor: id },
    select: {
      id_gestor: true,
      nome: true,
      cnpj: true,
      login: true,
      data_cadastro: true,
      ativo: true,
      tecnico: {
        select: {
          id_tecnico: true,
          nome: true,
          cnpj: true,
          login: true
        }
      }
    }
  });
}

// Função para criar gestor
export async function createGestor(data: Prisma.gestorCreateInput) {
  return prisma.gestor.create({
    data,
    select: {
      id_gestor: true,
      nome: true,
      cnpj: true,
      login: true,
      data_cadastro: true,
      ativo: true
    }
  });
}

// Função para atualizar gestor
export async function updateGestor(id: number, data: Prisma.gestorUpdateInput) {
  return prisma.gestor.update({
    where: { id_gestor: id },
    data,
    select: {
      id_gestor: true,
      nome: true,
      cnpj: true,
      login: true,
      data_cadastro: true,
      ativo: true
    }
  });
}

// Função para deletar gestor
export async function deleteGestor(id: number) {
  return prisma.gestor.delete({
    where: { id_gestor: id }
  });
}

