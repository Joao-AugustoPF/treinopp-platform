import { z } from 'zod';

import { Status } from '../types/aluno';

// Helper function to log validation errors
const logValidationError = (error: z.ZodError) => {
  console.error('Validation Error:', {
    errors: error.errors.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
      code: err.code,
    })),
  });
};

const enderecoSchema = z.object({
  Logradouro: z.string().optional(),
  Numero: z.string().optional(),
  Complemento: z.string().optional(),
  Bairro: z.string().optional(),
  Cidade: z.string().optional(),
  Estado: z.string().optional(),
  CEP: z.string().optional(),
});

const planoSchema = z
  .object({
    Id: z.string().optional(),
    Nome: z.string().optional(),
    Valor: z.number().optional(),
    DataInicio: z.string().optional(),
    DataFim: z.string().optional(),
  })
  .refine((data) => {
    console.log('Validating plano data:', data);
    return true;
  });

export const AlunoSchema = z
  .object({
    Nome: z.string().optional(),
    Email: z.string().optional(),
    Telefone: z.string().optional(),
    DataNascimento: z.string().optional(),
    CPF: z.string().optional(),
    Endereco: enderecoSchema.optional(),
    Plano: planoSchema.optional(),
    TreinadorId: z.string().optional(),
    Status: z.nativeEnum(Status).optional(),
    Foto: z.union([z.instanceof(File), z.string().nullable()]).optional(),
    MaxBookings: z
      .number()
      .min(0, 'Quantidade de agendamentos deve ser maior ou igual a 0')
      .optional(),
  })
  .refine((data) => {
    console.log('Validating form data:', {
      Nome: data.Nome,
      Email: data.Email,
      Telefone: data.Telefone,
      DataNascimento: data.DataNascimento,
      CPF: data.CPF,
      Endereco: data.Endereco,
      Plano: data.Plano,
      TreinadorId: data.TreinadorId,
      Status: data.Status,
      Foto: data.Foto,
      MaxBookings: data.MaxBookings,
    });
    return true;
  })
  .refine(
    (data) => {
      // Only validate email if it's provided and not empty
      if (data.Email && data.Email.trim() !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(data.Email);
      }
      return true;
    },
    {
      message: 'Email inválido',
      path: ['Email'],
    }
  )
  .superRefine((data, ctx) => {
    // Log validation errors if any
    if (ctx.path.length > 0) {
      console.error('Validation Error in path:', ctx.path.join('.'), {
        value: data,
      });
    }
  });

// Wrap the schema to add logging
export const AlunoSchemaWithLogging = AlunoSchema.transform((data) => {
  try {
    return AlunoSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      logValidationError(error);
    }
    throw error;
  }
});

export type AlunoSchemaType = z.infer<typeof AlunoSchema>;
