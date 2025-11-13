import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import * as repository from './tecnico.repository.js';
import { HttpError } from '../../middlewares/errorHandler.js';
import { prisma } from '../../lib/prisma.js';

// Tipo para criação de técnico
export type CreateTecnicoInput = {
  nome: string;
  cnpj: string;
  login: string;
  senha: string;
  id_gestor: number;
  ativo?: boolean;
};

// Tipo para atualização de técnico
export type UpdateTecnicoInput = {
  nome?: string;
  cnpj?: string;
  login?: string;
  senha?: string;
  id_gestor?: number;
  ativo?: boolean;
};

// Função para listar técnicos
export async function listTecnicos(params: {
  page: number;
  limit: number;
  search?: string;
  ativo?: boolean;
  id_gestor?: number;
}) {
  return repository.listTecnicos(params);
}

// Função para buscar técnico por ID
export async function getTecnicoById(id: number) {
  const tecnico = await repository.findTecnicoById(id);
  
  if (!tecnico) {
    throw new HttpError(404, 'Técnico não encontrado');
  }

  return tecnico;
}

// Função para criar técnico
export async function createTecnico(data: CreateTecnicoInput) {
  try {
    // Verifica se o gestor existe
    const gestor = await prisma.gestor.findUnique({
      where: { id_gestor: data.id_gestor }
    });

    if (!gestor) {
      throw new HttpError(404, 'Gestor não encontrado');
    }

    // Hash da senha antes de salvar
    const hashedPassword = await bcrypt.hash(data.senha, 10);

    const tecnico = await repository.createTecnico({
      nome: data.nome,
      cnpj: data.cnpj,
      login: data.login,
      senha: hashedPassword,
      gestor: {
        connect: { id_gestor: data.id_gestor }
      },
      ativo: data.ativo ?? true
    });

    return tecnico;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
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
      if (error.code === 'P2003') {
        throw new HttpError(404, 'Gestor não encontrado');
      }
    }
    throw error;
  }
}

// Função para atualizar técnico
export async function updateTecnico(id: number, data: UpdateTecnicoInput) {
  // Verifica se o técnico existe
  await getTecnicoById(id);

  try {
    // Se id_gestor foi fornecido, verifica se existe
    if (data.id_gestor) {
      const gestor = await prisma.gestor.findUnique({
        where: { id_gestor: data.id_gestor }
      });

      if (!gestor) {
        throw new HttpError(404, 'Gestor não encontrado');
      }
    }

    const { id_gestor, ...restData } = data;
    const updateData: Prisma.tecnicoUpdateInput = { ...restData };

    // Se id_gestor foi fornecido, usa a relação
    if (id_gestor !== undefined) {
      updateData.gestor = {
        connect: { id_gestor }
      };
    }

    // Se senha foi fornecida, faz hash antes de atualizar
    if (data.senha) {
      updateData.senha = await bcrypt.hash(data.senha, 10);
    }

    const tecnico = await repository.updateTecnico(id, updateData);
    return tecnico;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
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
        throw new HttpError(404, 'Técnico não encontrado');
      }
      if (error.code === 'P2003') {
        throw new HttpError(404, 'Gestor não encontrado');
      }
    }
    throw error;
  }
}

// Função para deletar técnico
export async function deleteTecnico(id: number) {
  // Verifica se o técnico existe
  await getTecnicoById(id);

  await repository.deleteTecnico(id);
}

