'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { CardHeader } from '@mui/material';
import Divider from '@mui/material/Divider';

import { fDateTime } from 'src/utils/format-time';

import { DisplayInfo } from 'src/components/display-info';

import type { IDetentoSocial } from '../types';

// ----------------------------------------------------------------------

type Props = {
  info: IDetentoSocial;
};

export function DetentoSocial({ info }: Props) {
  const renderInformacoesSociais = () => (
    <Card>
      <CardHeader title="Informações Sociais" />

      <Grid container spacing={2} sx={{ p: 3 }}>
        <Grid item xs={12} md={4}>
          <DisplayInfo
            value={info.Escolaridade}
            icon="simple-line-icons:graduation"
            tooltip="Escolaridade"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <DisplayInfo
            value={info.FilhosQuantidade?.toString()}
            icon="fa6-solid:children"
            tooltip="Filhos"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <DisplayInfo value={info.EstadoCivil} icon="mingcute:heart-fill" tooltip="Estado Civil" />
        </Grid>

        <Grid item xs={12} md={4}>
          <DisplayInfo
            value={info.NomeFamiliar}
            icon="icon-park-outline:family"
            tooltip="Familiar"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <DisplayInfo
            value={info.MatriculaFamiliar}
            icon="line-md:document"
            tooltip="Matrícula Familiar"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <DisplayInfo value={info.NomeConjuge} icon="ic:sharp-people" tooltip="Cônjuge" />
        </Grid>

        <Grid item xs={12} md={4}>
          <DisplayInfo value={info.NomeMae} icon="material-symbols:woman" tooltip="Mãe" />
        </Grid>

        <Grid item xs={12} md={4}>
          <DisplayInfo value={info.NomePai} icon="material-symbols:man" tooltip="Pai" />
        </Grid>
      </Grid>

      <Divider />

      <CardHeader title="Localização" />

      <Grid container spacing={2} sx={{ p: 3 }}>
        <Grid item xs={12} md={4}>
          <DisplayInfo
            value={info.CidadeOrigem}
            icon="mingcute:location-fill"
            tooltip="Cidade de Origem"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <DisplayInfo
            value={info.EstadoOrigem}
            icon="mingcute:location-fill"
            tooltip="Estado de Origem"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <DisplayInfo
            value={info.PaisOrigem}
            icon="mingcute:location-fill"
            tooltip="País de Origem"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <DisplayInfo value={info.Logradouro} icon="mingcute:location-line" tooltip="Logradouro" />
        </Grid>
        <Grid item xs={12} md={4}>
          <DisplayInfo value={info.Bairro} icon="mingcute:location-line" tooltip="Bairro" />
        </Grid>
        <Grid item xs={12} md={4}>
          <DisplayInfo value={info.Cep} icon="mingcute:location-line" tooltip="CEP" />
        </Grid>
      </Grid>
    </Card>
  );

  const renderInformacoesPessoais = () => (
    <Card>
      <CardHeader title="Informações Pessoais" />

      <Stack spacing={2} sx={{ p: 3, typography: 'body2' }}>
        <DisplayInfo value={info.Nome} icon="mdi:user" tooltip="Nome" />
        <DisplayInfo value={info.CPF} icon="mdi:identifier" tooltip="CPF" />
        <DisplayInfo value={info.RG} icon="mdi:card-account-details" tooltip="RG" />
        <DisplayInfo value={info.Religiao} icon="mdi:church" tooltip="Religião" />
        <DisplayInfo value={info.Profissao} icon="mdi:briefcase" tooltip="Profissão" />
        <DisplayInfo value={info.Vulgo} icon="mdi:account-alert" tooltip="Vulgo" />
      </Stack>
    </Card>
  );

  const renderVisitas = () => (
    <Card sx={{ py: 3, textAlign: 'center', typography: 'h5', width: 1 }}>
      <Stack
        spacing={[2, 0]}
        width={1}
        divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
        sx={{ flexDirection: ['column', 'row'] }}
      >
        <Stack sx={{ width: 1 }}>
          {info.DataUltimaVisitaSocial
            ? fDateTime(info.DataUltimaVisitaSocial)
            : 'Não há visita social'}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Última Visita Social
          </Box>
        </Stack>

        <Stack sx={{ width: 1 }}>
          {info.DataProximaVisitaSocial
            ? fDateTime(info.DataProximaVisitaSocial)
            : 'Não há visita social'}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Próxima Visita Social
          </Box>
        </Stack>

        <Stack sx={{ width: 1 }}>
          {info.DataUltimaVisitaIntima
            ? fDateTime(info.DataUltimaVisitaIntima)
            : 'Não há visita intima'}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Última Visita Intima
          </Box>
        </Stack>

        <Stack sx={{ width: 1 }}>
          {info.DataProximaVisitaIntima
            ? fDateTime(info.DataProximaVisitaIntima)
            : 'Não há visita intima'}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Próxima Visita Intima
          </Box>
        </Stack>
      </Stack>
    </Card>
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        {renderVisitas()}
      </Grid>

      <Grid item xs={12} md={3}>
        {renderInformacoesPessoais()}
      </Grid>

      <Grid item xs={12} md={9}>
        {renderInformacoesSociais()}
      </Grid>
    </Grid>
  );
}
