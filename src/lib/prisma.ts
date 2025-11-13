// Importar classe gerada pelo prisma (npx prisma generate)
import { PrismaClient } from "@prisma/client";
//Cria uma instancia do prisma com uma opção de log 
const prismaClient = new PrismaClient({log: ['error','warn']});
//Criamos um globalThis pois cada reload do arquivo poderia criar uma nova conexão.
// com o globalThis garantimos uma unica.
const globalForPrisma = globalThis as unknown as {prisma?: PrismaClient};
//se ja houver uma instancia em globalThis reusamos, se não criamos uma nova
export const prisma = globalForPrisma.prisma ?? prismaClient;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;