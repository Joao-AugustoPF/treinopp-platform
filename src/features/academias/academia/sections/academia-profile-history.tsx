import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Timeline from '@mui/lab/Timeline';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';

import { fDateTime } from 'src/utils/format-time';

type Props = {
  createdAt: string;
  // createdBy: string;
  updatedAt: string;
  // updatedBy: string;
  historico: Array<{
    id: string;
    createdAt: string;
    // createdBy: string;
    comportamento: string;
    historico: string;
  }>;
};

export function AcademiaProfileHistory({
  createdAt,
  // createdBy,
  updatedAt,
  // updatedBy,
  historico,
}: Props) {
  const renderTimeline = (
    <Timeline>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color="primary" />
          <TimelineConnector />
        </TimelineSeparator>

        <TimelineContent>
          <Typography variant="subtitle2">Criação</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {fDateTime(createdAt)}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {/* Criado por: {createdBy} */}
          </Typography>
        </TimelineContent>
      </TimelineItem>

      {historico.map((item) => (
        <TimelineItem key={item.id}>
          <TimelineSeparator>
            <TimelineDot color="info" />
            <TimelineConnector />
          </TimelineSeparator>

          <TimelineContent>
            <Typography variant="subtitle2">{item.comportamento}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {fDateTime(item.createdAt)}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {item.historico}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {/* Registrado por: {item.createdBy} */}
            </Typography>
          </TimelineContent>
        </TimelineItem>
      ))}

      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color="success" />
        </TimelineSeparator>

        <TimelineContent>
          <Typography variant="subtitle2">Última Atualização</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {fDateTime(updatedAt)}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {/* Atualizado por: {updatedBy} */}
          </Typography>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );

  return (
    <Card>
      <CardHeader title="Histórico" />
      <CardContent>
        <Stack spacing={3}>{renderTimeline}</Stack>
      </CardContent>
    </Card>
  );
}
