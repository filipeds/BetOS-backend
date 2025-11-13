import { Prisma } from '@prisma/client';
import * as repository from './defeito.repository.js';
import { HttpError } from '../../middlewares/errorHandler.js';

// Tipo para criação de defeito
export type CreateDefeitoInput = {
  peca: string;
  defeito: string;
  id_equipamento: number;
  data_registro?: Date;
};

// Tipo para atualização de defeito
export type UpdateDefeitoInput = {
  peca?: string;
  defeito?: string;
  id_equipamento?: number;
  data_registro?: Date;
};

// Função para listar defeitos
export async function listDefeitos(params: {
  page: number;
  limit: number;
  search?: string;
  id_equipamento?: number;
}) {
  return repository.listDefeitos(params);
}

// Função para buscar defeito por ID
export async function getDefeitoById(id: number) {
  const defeito = await repository.findDefeitoById(id);
  
  if (!defeito) {
    throw new HttpError(404, 'Defeito não encontrado');
  }

  return defeito;
}

// Função para criar defeito
export async function createDefeito(data: CreateDefeitoInput) {
  try {
    const defeito = await repository.createDefeito({
      peca: data.peca,
      defeito: data.defeito,
      data_registro: data.data_registro,
      equipamento: {
        connect: { id_equipamento: data.id_equipamento }
      }
    });

    return defeito;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new HttpError(404, 'Equipamento não encontrado');
      }
    }
    throw error;
  }
}

// Função para atualizar defeito
export async function updateDefeito(id: number, data: UpdateDefeitoInput) {
  // Verifica se o defeito existe
  await getDefeitoById(id);

  try {
    const updateData: Prisma.defeitoUpdateInput = {};

    if (data.peca !== undefined) {
      updateData.peca = data.peca;
    }

    if (data.defeito !== undefined) {
      updateData.defeito = data.defeito;
    }

    if (data.id_equipamento !== undefined) {
      updateData.equipamento = { connect: { id_equipamento: data.id_equipamento } };
    }

    if (data.data_registro !== undefined) {
      updateData.data_registro = data.data_registro;
    }

    const defeito = await repository.updateDefeito(id, updateData);
    return defeito;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new HttpError(404, 'Equipamento ou defeito não encontrado');
      }
    }
    throw error;
  }
}

// Função para deletar defeito
export async function deleteDefeito(id: number) {
  // Verifica se o defeito existe
  await getDefeitoById(id);

  await repository.deleteDefeito(id);
}

