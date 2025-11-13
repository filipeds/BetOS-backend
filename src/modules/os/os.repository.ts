import { prisma } from '../../lib/prisma.js';
import { Prisma } from '@prisma/client';

// Tipo para incluir relações no retorno do Prisma
export type OSWithRelations = Prisma.ordem_servicoGetPayload<{
  include: {
    cliente: true;
    tecnico: true;
    assinatura: true;
    os_foto: true;
    equipamento: true;
  }
}>;

// Função para listar OS com paginação e filtros
export async function listOS(params: {
  // page: number;
  // limit: number;
  search?: string;
  finalizada?: 'Y' | 'N';
  id_cliente?: number;
  id_tecnico?: number;
}) {
  const { /*page, limit,*/ search, finalizada, id_cliente, id_tecnico } = params;
//   const skip = (page - 1) * limit;

  const where: Prisma.ordem_servicoWhereInput = {};
  
  if (search) {
    where.OR = [
      { defeitos: { contains: search } },
      { observacoes: { contains: search } },
      { cliente: { nome: { contains: search } } },
      { cliente: { cnpj: { contains: search } } }
    ];
  }

  if (finalizada !== undefined) {
    where.finalizada = finalizada;
  }

  if (id_cliente !== undefined) {
    where.id_cliente = id_cliente;
  }

  if (id_tecnico !== undefined) {
    where.id_tecnico = id_tecnico;
  }

  const [ordensServico, total] = await Promise.all([
    prisma.ordem_servico.findMany({
      where,
    //   skip,
    //   take: limit,
      orderBy: { numero_os: 'asc' },
      include: {
        cliente: {
          select: {
            id_cliente: true,
            nome: true,
            cnpj: true,
            telefone: true
          }
        },
        tecnico: {
          select: {
            id_tecnico: true,
            nome: true,
            cnpj: true,
            login: true
          }
        },
        equipamento: {
          select: {
            id_equipamento: true,
            nome: true,
            tipo: true,
            num_serie: true,
            defeito: {
              select: {
                id_defeito: true,
                peca: true,
                defeito: true,
                data_registro: true
              }
            }
          }
        }
      }
    }),
    prisma.ordem_servico.count({ where })
  ]);

  return {
    data: ordensServico,
    // meta: {
    //   page,
    //   limit,
    //   total,
    //   totalPages: Math.ceil(total / limit)
    // }
  };
}

// Função para buscar OS por ID
export async function findOSById(id: number) {
  return prisma.ordem_servico.findUnique({
    where: { numero_os: id },
    include: {
      cliente: {
        select: {
          id_cliente: true,
          nome: true,
          cnpj: true,
          cep: true,
          numero: true,
          telefone: true
        }
      },
      tecnico: {
        select: {
          id_tecnico: true,
          nome: true,
          cnpj: true,
          login: true
        }
      },
      assinatura: true,
      os_foto: true,
      equipamento: {
        select: {
          id_equipamento: true,
          nome: true,
          tipo: true,
          num_serie: true,
          defeito: {
            select: {
              id_defeito: true,
              peca: true,
              defeito: true,
              data_registro: true
            }
          }
        }
      }
    }
  });
}

// Função para criar OS
export async function createOS(data: Prisma.ordem_servicoCreateInput) {
  return prisma.ordem_servico.create({
    data,
    include: {
      cliente: {
        select: {
          id_cliente: true,
          nome: true,
          cnpj: true,
          telefone: true
        }
      },
      tecnico: {
        select: {
          id_tecnico: true,
          nome: true,
          cnpj: true,
          login: true
        }
      },
      equipamento: {
        select: {
          id_equipamento: true,
          nome: true,
          tipo: true,
          num_serie: true,
          defeito: {
            select: {
              id_defeito: true,
              peca: true,
              defeito: true,
              data_registro: true
            }
          }
        }
      }
    }
  });
}

// Função para atualizar OS
export async function updateOS(id: number, data: Prisma.ordem_servicoUpdateInput) {
  return prisma.ordem_servico.update({
    where: { numero_os: id },
    data,
    include: {
      cliente: {
        select: {
          id_cliente: true,
          nome: true,
          cnpj: true,
          telefone: true
        }
      },
      tecnico: {
        select: {
          id_tecnico: true,
          nome: true,
          cnpj: true,
          login: true
        }
      },
      equipamento: {
        select: {
          id_equipamento: true,
          nome: true,
          tipo: true,
          num_serie: true,
          defeito: {
            select: {
              id_defeito: true,
              peca: true,
              defeito: true,
              data_registro: true
            }
          }
        }
      }
    }
  });
}

// Função para deletar OS
export async function deleteOS(id: number) {
  return prisma.ordem_servico.delete({
    where: { numero_os: id }
  });
}

