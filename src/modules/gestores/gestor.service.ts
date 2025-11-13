import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import * as repository from './gestor.repository.js';
import { HttpError } from '../../middlewares/errorHandler.js';

// Tipo para criação de gestor
export type CreateGestorInput = {
  nome: string;
  cnpj: string;
  login: string;
  senha: string;
  ativo?: boolean;
};

// Tipo para atualização de gestor
export type UpdateGestorInput = {
  nome?: string;
  cnpj?: string;
  login?: string;
  senha?: string;
  ativo?: boolean;
};

// Função para listar gestores
export async function listGestores(params: {
  page: number;
  limit: number;
  search?: string;
  ativo?: boolean;
}) {
  return repository.listGestores(params);
}

// Função para buscar gestor por ID
export async function getGestorById(id: number) {
  const gestor = await repository.findGestorById(id);
  
  if (!gestor) {
    throw new HttpError(404, 'Gestor não encontrado');
  }

  return gestor;
}

// Função para criar gestor
export async function createGestor(data: CreateGestorInput) {
  try {
    // Hash da senha antes de salvar
    const hashedPassword = await bcrypt.hash(data.senha, 10);

    const gestor = await repository.createGestor({
      nome: data.nome,
      cnpj: data.cnpj,
      login: data.login,
      senha: hashedPassword,
      ativo: data.ativo ?? true
    });

    return gestor;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        // Verifica qual campo único foi violado
        const target = error.meta?.target as string[];
        if (target?.includes('cnpj')) {
          throw new HttpError(409, 'CNPJ já cadastrado');
        }
        if (target?.includes('login')) {
          throw new HttpError(409, 'Login já cadastrado');
        }
      }
    }
    throw error;
  }
}

// Função para atualizar gestor
export async function updateGestor(id: number, data: UpdateGestorInput) {
  // Verifica se o gestor existe
  await getGestorById(id);

  try {
    const updateData: Prisma.gestorUpdateInput = { ...data };

    // Se senha foi fornecida, faz hash antes de atualizar
    if (data.senha) {
      updateData.senha = await bcrypt.hash(data.senha, 10);
    }

    const gestor = await repository.updateGestor(id, updateData);
    return gestor;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        const target = error.meta?.target as string[];
        if (target?.includes('cnpj')) {
          throw new HttpError(409, 'CNPJ já cadastrado');
        }
        if (target?.includes('login')) {
          throw new HttpError(409, 'Login já cadastrado');
        }
      }
      if (error.code === 'P2025') {
        throw new HttpError(404, 'Gestor não encontrado');
      }
    }
    throw error;
  }
}

// Função para deletar gestor
export async function deleteGestor(id: number) {
  // Verifica se o gestor existe
  await getGestorById(id);

  await repository.deleteGestor(id);
}

