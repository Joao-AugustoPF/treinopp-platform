import Card from '@mui/material/Card';
import { Grid2 } from '@mui/material';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { DisplayInfo } from 'src/components/display-info';

import { Status } from '../types/aluno';

import type { IAluno } from '../types/aluno';

// ----------------------------------------------------------------------

const formatPhone = (phone: string) => {
  if (!phone) return '';

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // If it starts with 55 (Brazil country code), remove it
  const number = cleaned.startsWith('55') ? cleaned.slice(2) : cleaned;

  // Format the remaining number
  const match = number.match(/^(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  return phone;
};

const formatCPF = (cpf: string) => {
  if (!cpf) return '';
  const cleaned = cpf.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
  if (match) {
    return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
  }
  return cpf;
};

const formatCEP = (cep: string) => {
  if (!cep) return '';
  const cleaned = cep.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{5})(\d{3})$/);
  if (match) {
    return `${match[1]}-${match[2]}`;
  }
  return cep;
};

const formatStatus = (status: Status) => {
  const statusMap = {
    [Status.ACTIVE]: { label: 'Ativo', color: 'success.main' },
    [Status.INACTIVE]: { label: 'Inativo', color: 'error.main' },
    [Status.PENDING]: { label: 'Pendente', color: 'warning.main' },
    [Status.BLOCKED]: { label: 'Bloqueado', color: 'error.main' },
  };

  return statusMap[status] || { label: status, color: 'text.primary' };
};

type Props = {
  info: IAluno;
};

export function AlunoProfileHome({ info }: Props) {
  const renderPersonalInfo = () => (
    <Card>
      <CardHeader title="Informações Pessoais" />
      <Stack spacing={2} sx={{ p: 3 }}>
        <DisplayInfo value={info.Nome} icon="solar:user-id-bold" tooltip="Nome" />
        <DisplayInfo
          value={formatPhone(info.Telefone)}
          icon="solar:phone-bold"
          tooltip="Telefone"
        />
        <DisplayInfo value={info.Email} icon="solar:letter-bold" tooltip="Email" />
        <DisplayInfo
          value={fDate(info.DataNascimento)}
          icon="solar:calendar-bold"
          tooltip="Data de Nascimento"
        />
        <DisplayInfo value={formatCPF(info.CPF)} icon="solar:document-bold" tooltip="CPF" />
        <DisplayInfo
          value={`${info.MaxBookings || 0} agendamentos`}
          icon="solar:calendar-bold"
          tooltip="Quantidade de Agendamentos"
        />
      </Stack>
    </Card>
  );

  const renderAddress = () => (
    <Card>
      <CardHeader title="Endereço" />
      <Stack spacing={2} sx={{ p: 3 }}>
        <DisplayInfo
          value={info.Endereco.Logradouro}
          icon="solar:home-angle-bold"
          tooltip="Logradouro"
        />
        <DisplayInfo
          value={info.Endereco.Numero}
          icon="solar:hashtag-square-bold"
          tooltip="Número"
        />
        {info.Endereco.Complemento && (
          <DisplayInfo
            value={info.Endereco.Complemento}
            icon="solar:home-bold"
            tooltip="Complemento"
          />
        )}
        <DisplayInfo value={info.Endereco.Bairro} icon="solar:map-point-bold" tooltip="Bairro" />
        <DisplayInfo
          value={`${info.Endereco.Cidade}/${info.Endereco.Estado}`}
          icon="solar:city-bold"
          tooltip="Cidade/Estado"
        />
        <DisplayInfo value={formatCEP(info.Endereco.CEP)} icon="solar:map-bold" tooltip="CEP" />
      </Stack>
    </Card>
  );

  const renderPlan = () => {
    const statusInfo = formatStatus(info.Status);

    return (
      <Card>
        <CardHeader title="Plano" />
        <Stack spacing={2} sx={{ p: 3 }}>
          <DisplayInfo
            value={info.Plano.Nome}
            icon="solar:diploma-verified-bold"
            tooltip="Nome do Plano"
          />
          <DisplayInfo
            value={fCurrency(info.Plano.Valor)}
            icon="solar:dollar-minimalistic-bold"
            tooltip="Valor"
          />
          <DisplayInfo
            value={fDate(info.Plano.DataInicio)}
            icon="solar:calendar-mark-bold"
            tooltip="Data de Início"
          />
          <DisplayInfo
            value={fDate(info.Plano.DataFim)}
            icon="solar:calendar-mark-bold"
            tooltip="Data de Término"
          />
          {info.Treinador && (
            <DisplayInfo
              value={info.Treinador.Nome}
              icon="solar:user-hand-up-bold"
              tooltip="Treinador"
            />
          )}
          <Stack direction="row" spacing={1} alignItems="center">
            <Iconify icon="solar:flag-bold" width={24} />
            <Typography variant="body2" color={statusInfo.color}>
              {statusInfo.label}
            </Typography>
          </Stack>
        </Stack>
      </Card>
    );
  };

  return (
    <Grid2 container spacing={3}>
      <Grid2 size={{ xs: 12, md: 4 }}>
        <Stack spacing={3}>
          {renderPersonalInfo()}
          {renderPlan()}
        </Stack>
      </Grid2>

      <Grid2 size={{ xs: 12, md: 8 }}>{renderAddress()}</Grid2>
    </Grid2>
  );
}
