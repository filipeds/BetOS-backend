import { Prisma } from '@prisma/client';
import * as repository from './os.repository.js';
import { HttpError } from '../../middlewares/errorHandler.js';
import * as clienteService from '../clientes/cliente.service.js';
import * as tecnicoService from '../tecnicos/tecnico.service.js';

// Tipo para criação de OS
export type CreateOSInput = {
  id_cliente: number;
  id_tecnico?: number;
  custos?: number;
  defeitos?: string;
  observacoes?: string;
  finalizada?: 'Y' | 'N';
};

// Tipo para atualização de OS
export type UpdateOSInput = {
  id_cliente?: number;
  id_tecnico?: number | null;
  custos?: number;
  data_fechamento?: Date | null;
  defeitos?: string | null;
  observacoes?: string | null;
  finalizada?: 'Y' | 'N';
};

// Função para listar OS
export async function listOS(params: {
  page: number;
  limit: number;
  search?: string;
  finalizada?: 'Y' | 'N';
  id_cliente?: number;
  id_tecnico?: number;
}) {
  return repository.listOS(params);
}

// Função para buscar OS por ID
export async function getOSById(id: number) {
  const os = await repository.findOSById(id);
  
  if (!os) {
    throw new HttpError(404, 'Ordem de serviço não encontrada');
  }

  return os;
}

// Função para criar OS
export async function createOS(data: CreateOSInput) {
  try {
    // Verifica se o cliente existe
    await clienteService.getClienteById(data.id_cliente);

    // Verifica se o técnico existe (se fornecido)
    if (data.id_tecnico) {
      await tecnicoService.getTecnicoById(data.id_tecnico);
    }
    
    const os = await repository.createOS({
      cliente: {
        connect: { id_cliente: data.id_cliente }
      },
      tecnico: data.id_tecnico ? {
        connect: { id_tecnico: data.id_tecnico }
      } : undefined,
      custos: data.custos,
      defeitos: data.defeitos,
      observacoes: data.observacoes,
      finalizada: data.finalizada ?? 'N'
    });

    return os;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new HttpError(404, 'Cliente ou técnico não encontrado');
      }
    }
    throw error;
  }
}

// Função para atualizar OS
export async function updateOS(id: number, data: UpdateOSInput) {
  // Verifica se a OS existe
  await getOSById(id);

  try {
    const updateData: Prisma.ordem_servicoUpdateInput = {};

    if (data.id_cliente !== undefined) {
      // Verifica se o cliente existe
      await clienteService.getClienteById(data.id_cliente);
      updateData.cliente = { connect: { id_cliente: data.id_cliente } };
    }

    if (data.id_tecnico !== undefined) {
      if (data.id_tecnico === null) {
        updateData.tecnico = { disconnect: true };
      } else {
        // Verifica se o técnico existe
        await tecnicoService.getTecnicoById(data.id_tecnico);
        updateData.tecnico = { connect: { id_tecnico: data.id_tecnico } };
      }
    }

    if (data.custos !== undefined) {
      updateData.custos = data.custos;
    }

    if (data.data_fechamento !== undefined) {
      updateData.data_fechamento = data.data_fechamento;
    }

    if (data.defeitos !== undefined) {
      updateData.defeitos = data.defeitos;
    }

    if (data.observacoes !== undefined) {
      updateData.observacoes = data.observacoes;
    }

    if (data.finalizada !== undefined) {
      updateData.finalizada = data.finalizada;
    }

    const os = await repository.updateOS(id, updateData);
    return os;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new HttpError(404, 'Cliente, técnico ou OS não encontrado');
      }
    }
    throw error;
  }
}

// Função para deletar OS
export async function deleteOS(id: number) {
  // Verifica se a OS existe
  await getOSById(id);

  await repository.deleteOS(id);
}

