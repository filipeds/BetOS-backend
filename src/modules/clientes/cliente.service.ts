import { Prisma } from '@prisma/client';
import * as repository from './cliente.repository.js';
import { HttpError } from '../../middlewares/errorHandler.js';

// Tipo para criação de cliente
export type CreateClienteInput = {
  nome: string;
  cnpj: string;
  cep: string;
  numero: string;
  telefone: string;
  ativo?: boolean;
};

// Tipo para atualização de cliente
export type UpdateClienteInput = {
  nome?: string;
  cnpj?: string;
  cep?: string;
  numero?: string;
  telefone?: string;
  ativo?: boolean;
};

// Função para listar clientes
export async function listClientes(params: {
  page: number;
  limit: number;
  search?: string;
  ativo?: boolean;
}) {
  return repository.listClientes(params);
}

// Função para buscar cliente por ID
export async function getClienteById(id: number) {
  const cliente = await repository.findClienteById(id);
  
  if (!cliente) {
    throw new HttpError(404, 'Cliente não encontrado');
  }

  return cliente;
}

// Função para criar cliente
export async function createCliente(data: CreateClienteInput) {
  try {
    const cliente = await repository.createCliente({
      nome: data.nome,
      cnpj: data.cnpj,
      cep: data.cep,
      numero: data.numero,
      telefone: data.telefone,
      ativo: data.ativo ?? true
    });

    return cliente;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new HttpError(409, 'CNPJ já cadastrado');
      }
    }
    throw error;
  }
}

// Função para atualizar cliente
export async function updateCliente(id: number, data: UpdateClienteInput) {
  // Verifica se o cliente existe
  await getClienteById(id);

  try {
    const cliente = await repository.updateCliente(id, data);
    return cliente;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new HttpError(409, 'CNPJ já cadastrado');
      }
      if (error.code === 'P2025') {
        throw new HttpError(404, 'Cliente não encontrado');
      }
    }
    throw error;
  }
}

// Função para deletar cliente
export async function deleteCliente(id: number) {
  // Verifica se o cliente existe
  await getClienteById(id);

  await repository.deleteCliente(id);
}

