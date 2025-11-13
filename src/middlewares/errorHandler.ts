//Tipos do express para req/res/middlewares
import { NextFunction, Request, Response } from 'express';
//Erro lançado pela validação zod
import { ZodError } from 'zod';

export class HttpError extends Error{
    statusCode: number;
    constructor(statusCode: number, message: string){
        super(message);
        this.statusCode = statusCode;
    }
}

export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
){
    //Erros validação ZOD - resposta 400 com detalhes do campo
    if(err instanceof ZodError){
        return res.status(400).json({
           error: 'Erro de validação',
           details: err.flatten() 
        });
    }
    // Erros controlados com status definido (Negocio, conflitos, not found)
    if(err instanceof HttpError){
        return res.status(err.statusCode).json({
            error: err.message
        });
    }
    console.error('Erro não tratado:',err);
    return res.status(500).json({
        error: 'Erro interno do servidor'
    })
}