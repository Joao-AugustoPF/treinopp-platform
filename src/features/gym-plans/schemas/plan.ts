import { z } from 'zod';

export const PlanSchema = z.object({
  Nome: z.string().min(1, 'Nome é obrigatório'),
  // description: z.string().min(1, 'Descrição é obrigatória'),
  Valor: z
    .number({
      required_error: 'Preço é obrigatório',
      invalid_type_error: 'Preço deve ser um número',
    })
    .min(0, 'Preço deve ser maior ou igual a 0'),
  Duracao: z
    .number({
      required_error: 'Duração é obrigatória',
      invalid_type_error: 'Duração deve ser um número',
    })
    .int('Duração deve ser um número inteiro')
    .min(30, 'Duração deve ser maior ou igual a 30 dias'),
  // features: z.array(z.string()).min(1, 'Adicione pelo menos uma funcionalidade'),
  // isActive: z.boolean(),
  TenantId: z.string().min(1, 'Tenant ID é obrigatório'),
});

export type PlanSchemaType = z.infer<typeof PlanSchema>;
