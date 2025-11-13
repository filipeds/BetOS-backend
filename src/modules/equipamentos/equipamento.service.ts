import { Prisma, equipamento_tipo } from '@prisma/client';
import * as repository from './equipamento.repository.js';
import { HttpError } from '../../middlewares/errorHandler.js';
import * as osService from '../os/os.service.js';

export type CreateEquipamentoInput = {
  nome: string;
  tipo: equipamento_tipo;
  num_serie: string;
  numero_os: number;
};

export type UpdateEquipamentoInput = {
  nome?: string;
  tipo?: equipamento_tipo;
  num_serie?: string;
  numero_os?: number;
};

export async function listEquipamentos(params: {
  page: number;
  limit: number;
  search?: string;
  tipo?: equipamento_tipo;
  numero_os?: number;
}) {
  return repository.listEquipamentos(params);
}

export async function getEquipamentoById(id: number) {
  const equipamento = await repository.findEquipamentoById(id);

  if (!equipamento) {
    throw new HttpError(404, 'Equipamento não encontrado');
  }

  return equipamento;
}

export async function createEquipamento(data: CreateEquipamentoInput) {
  await osService.getOSById(data.numero_os);

  try {
    return repository.createEquipamento({
      nome: data.nome,
      tipo: data.tipo,
      num_serie: data.num_serie,
      ordem_servico: {
        connect: { numero_os: data.numero_os },
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new HttpError(404, 'Ordem de serviço não encontrada');
      }
    }
    throw error;
  }
}

export async function updateEquipamento(
  id: number,
  data: UpdateEquipamentoInput,
) {
  await getEquipamentoById(id);

  try {
    const updateData: Prisma.equipamentoUpdateInput = {};

    if (data.nome !== undefined) {
      updateData.nome = data.nome;
    }

    if (data.tipo !== undefined) {
      updateData.tipo = data.tipo;
    }

    if (data.num_serie !== undefined) {
      updateData.num_serie = data.num_serie;
    }

    if (data.numero_os !== undefined) {
      await osService.getOSById(data.numero_os);
      updateData.ordem_servico = {
        connect: { numero_os: data.numero_os },
      };
    }

    return repository.updateEquipamento(id, updateData);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new HttpError(
          404,
          'Ordem de serviço ou equipamento não encontrado',
        );
      }
    }
    throw error;
  }
}

export async function deleteEquipamento(id: number) {
  await getEquipamentoById(id);
  await repository.deleteEquipamento(id);
}

