import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

import { fDateTime } from 'src/utils/format-time';

type Props = {
  info: any;
};

export function AcademiaProfileHome({ info }: Props) {
  const renderInfo = (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <Stack spacing={2.5}>
          <Stack spacing={1}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
              Email
            </Typography>
            <Typography variant="body2">{info.Name}</Typography>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
              Telefone
            </Typography>
            <Typography variant="body2">{info.Phone}</Typography>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
              Endereço
            </Typography>
            <Typography variant="body2">
              {info.AddressStreet}, {info.AddressNumber}
            </Typography>
            <Typography variant="body2">
              {info.AddressCity} - {info.AddressState}
            </Typography>
            <Typography variant="body2">CEP: {info.AddressZip}</Typography>
          </Stack>
        </Stack>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Stack spacing={2.5}>
          <Stack spacing={1}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
              Data de Criação
            </Typography>
            <Typography variant="body2">{fDateTime(info.CreatedAt)}</Typography>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
              Última Atualização
            </Typography>
            <Typography variant="body2">{fDateTime(info.UpdatedAt)}</Typography>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Informações da Academia" />
          <CardContent>{renderInfo}</CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
