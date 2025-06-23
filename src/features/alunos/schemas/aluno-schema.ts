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
  Logradouro: z.string().min(1, 'Logradouro é obrigatório'),
  Numero: z.string().min(1, 'Número é obrigatório'),
  Complemento: z.string().optional(),
  Bairro: z.string().min(1, 'Bairro é obrigatório'),
  Cidade: z.string().min(1, 'Cidade é obrigatória'),
  Estado: z.string().min(1, 'Estado é obrigatório'),
  CEP: z.string().min(1, 'CEP é obrigatório'),
});

const planoSchema = z
  .object({
    Id: z.string(),
    Nome: z.string(),
    Valor: z.number(),
    DataInicio: z.string(),
    DataFim: z.string(),
  })
  .refine((data) => {
    console.log('Validating plano data:', data);
    return true;
  });

export const AlunoSchema = z
  .object({
    Nome: z.string().min(1, 'Nome é obrigatório'),
    Email: z.string().email('Email inválido'),
    Telefone: z.string().min(1, 'Telefone é obrigatório'),
    DataNascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
    CPF: z.string().optional(),
    Endereco: enderecoSchema,
    Plano: planoSchema,
    TreinadorId: z.string().optional(),
    Status: z.nativeEnum(Status),
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
