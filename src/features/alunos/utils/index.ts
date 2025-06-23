import type { IAluno } from '../types';

// Opções de status para o select
export const ALUNO_STATUS_OPTIONS = [
  { value: 'Ativo', label: 'Ativo' },
  { value: 'Inativo', label: 'Inativo' },
  { value: 'Pendente', label: 'Pendente' },
];

// Formata o status do aluno para exibição
export function formatStatus(status: any): string {
  switch (status) {
    case 'Ativo':
      return 'Ativo';
    case 'Inativo':
      return 'Inativo';
    case 'Pendente':
      return 'Pendente';
    default:
      return status;
  }
}

// Formata o CPF para exibição (###.###.###-##)
export function formatCPF(cpf: string): string {
  if (!cpf) return '';

  // Remove caracteres não numéricos
  const cleaned = cpf.replace(/\D/g, '');

  // Aplica a máscara
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Formata o telefone para exibição ((##) #####-####)
export function formatPhone(phone: string): string {
  if (!phone) return '';

  // Remove caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '');

  // Aplica a máscara
  return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}

// Formata a data de nascimento para exibição (dd/mm/yyyy)
export function formatBirthDate(date: Date): string {
  if (!date) return '';

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}

// Calcula a idade com base na data de nascimento
export function calculateAge(birthDate: Date): number {
  if (!birthDate) return 0;

  const today = new Date();
  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

// Formata o endereço completo para exibição
export function formatAddress(endereco: IAluno['Endereco']): string {
  if (!endereco) return '';

  const { Logradouro, Numero, Complemento, Bairro, Cidade, Estado, CEP } = endereco;

  let address = `${Logradouro}, ${Numero}`;

  if (Complemento) {
    address += `, ${Complemento}`;
  }

  address += ` - ${Bairro}, ${Cidade} - ${Estado}, ${CEP}`;

  return address;
}

// Formata o plano para exibição
export function formatPlano(plano: IAluno['Plano']): string {
  if (!plano) return '';

  return `${plano.Nome} - R$ ${plano.Valor.toFixed(2)}`;
}

// Formata a data de início e fim do plano para exibição
export function formatPlanoDates(plano: IAluno['Plano']): string {
  if (!plano || !plano.DataInicio || !plano.DataFim) return '';

  const inicio = new Date(plano.DataInicio);
  const fim = new Date(plano.DataFim);

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return `${formatDate(inicio)} - ${formatDate(fim)}`;
}

// Verifica se o plano está ativo
export function isPlanoAtivo(plano: IAluno['Plano']): boolean {
  if (!plano || !plano.DataInicio || !plano.DataFim) return false;

  const hoje = new Date();
  const dataInicio = new Date(plano.DataInicio);
  const dataFim = new Date(plano.DataFim);

  return hoje >= dataInicio && hoje <= dataFim;
}

// Verifica se o plano está expirado
export function isPlanoExpirado(plano: IAluno['Plano']): boolean {
  if (!plano || !plano.DataFim) return false;

  const hoje = new Date();
  const dataFim = new Date(plano.DataFim);

  return hoje > dataFim;
}

// Verifica se o plano está próximo de expirar (menos de 7 dias)
export function isPlanoProximoExpiracao(plano: IAluno['Plano']): boolean {
  if (!plano || !plano.DataFim) return false;

  const hoje = new Date();
  const dataFim = new Date(plano.DataFim);
  const diffTime = dataFim.getTime() - hoje.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays <= 7 && diffDays > 0;
}
