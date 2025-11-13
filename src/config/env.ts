import { config as loadEnv } from 'dotenv'; //Importa a função que carrega o env para process
import {z} from 'zod';//zod -> Validação em tempo de execução

loadEnv(); //executa a leitura do arquivo .env

const envSchema = z.object({
    DATABASE_URL: z.string().min(1),
    PORT: z.string().optional()
});

const parsed = envSchema.safeParse(process.env);
//valida o objeto process.env
if(!parsed.success){
    console.error('Erro nas variaveis de ambiente: ',parsed.error.format());
    process.exit(1);
}

export const ENV = {
    PORT: Number(process.env.PORT ?? 3333),
    DATABASE_URL: parsed.data.DATABASE_URL
};


