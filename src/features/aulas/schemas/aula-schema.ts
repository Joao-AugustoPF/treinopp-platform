import { z } from 'zod';

import { TipoAula } from '../types';

export const AulaSchema = z
  .object({
    Nome: z.string().min(1, 'Nome é obrigatório'),
    TipoAula: z.nativeEnum(TipoAula, {
      required_error: 'Tipo de aula é obrigatório',
    }),
    TreinadorId: z.string().min(1, 'Treinador é obrigatório'),
    DataInicio: z.string().min(1, 'Data de início é obrigatória'),
    DataFim: z.string().min(1, 'Data de término é obrigatória'),
    Local: z.string().min(1, 'Local é obrigatório'),
    Capacidade: z.number().min(1, 'Capacidade deve ser maior que 0'),
    TenantId: z.string().min(1, 'Tenant ID é obrigatório'),
    Status: z.enum(['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show']),
  })
  .refine(
    (data) => {
      const dataInicio = new Date(data.DataInicio);
      const dataFim = new Date(data.DataFim);
      return dataFim > dataInicio;
    },
    {
      message: 'Data de término deve ser posterior à data de início',
      path: ['DataFim'],
    }
  );

export type AulaSchemaType = z.infer<typeof AulaSchema>;
