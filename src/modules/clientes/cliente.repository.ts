import { prisma } from '../../lib/prisma.js';
import { Prisma } from '@prisma/client';

// Tipo para incluir relações no retorno do Prisma
export type ClienteWithRelations = Prisma.clienteGetPayload<{
  include: {
    ordem_servico: true;
  }
}>;

// Função para listar clientes com paginação e filtros
export async function listClientes(params: {
  page: number;
  limit: number;
  search?: string;
  ativo?: boolean;
}) {
  const { page, limit, search, ativo } = params;
  const skip = (page - 1) * limit;

  const where: Prisma.clienteWhereInput = {};
  
  if (search) {
    where.OR = [
      { nome: { contains: search } },
      { cnpj: { contains: search } }
    ];
  }

  if (ativo !== undefined) {
    where.ativo = ativo;
  }

  const [clientes, total] = await Promise.all([
    prisma.cliente.findMany({
      where,
      skip,
      take: limit,
      orderBy: { data_cadastro: 'desc' }
    }),
    prisma.cliente.count({ where })
  ]);

  return {
    data: clientes,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

// Função para buscar cliente por ID
export async function findClienteById(id: number) {
  return prisma.cliente.findUnique({
    where: { id_cliente: id },
    include: {
      ordem_servico: true
    }
  });
}

// Função para criar cliente
export async function createCliente(data: Prisma.clienteCreateInput) {
  return prisma.cliente.create({
    data
  });
}

// Função para atualizar cliente
export async function updateCliente(id: number, data: Prisma.clienteUpdateInput) {
  return prisma.cliente.update({
    where: { id_cliente: id },
    data
  });
}

// Função para deletar cliente
export async function deleteCliente(id: number) {
  return prisma.cliente.delete({
    where: { id_cliente: id }
  });
}

