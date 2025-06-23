import { useMemo } from 'react';
import { Page, Text, View, Font, Document, PDFDownloadLink, StyleSheet } from '@react-pdf/renderer';

import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

import { fDate } from 'src/utils/format-time';
import { fNumber } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

import type { IAvaliacao } from '../types';

// ----------------------------------------------------------------------

try {
  Font.register({
    family: 'Roboto',
    fonts: [
      {
        src: '/fonts/Roboto-Regular.ttf',
        fontWeight: 400,
      },
      {
        src: '/fonts/Roboto-Bold.ttf',
        fontWeight: 700,
      },
    ],
  });
} catch (error) {
  console.warn('Erro ao registrar fontes Roboto:', error);
}

const useStyles = () =>
  useMemo(
    () =>
      StyleSheet.create({
        page: {
          fontSize: 10,
          lineHeight: 1.4,
          fontFamily: 'Roboto',
          backgroundColor: '#FFFFFF',
          padding: '30px 20px 50px 20px',
        },
        header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 30,
          paddingBottom: 20,
          borderBottomWidth: 2,
          borderBottomColor: '#1976d2',
        },
        title: {
          fontSize: 24,
          fontFamily: 'Roboto',
          fontWeight: 700,
          color: '#1976d2',
        },
        subtitle: {
          fontSize: 14,
          fontFamily: 'Roboto',
          fontWeight: 700,
          marginBottom: 8,
          color: '#333',
        },
        section: {
          marginBottom: 20,
        },
        row: {
          flexDirection: 'row',
          marginBottom: 8,
        },
        label: {
          width: '30%',
          fontSize: 10,
          fontFamily: 'Roboto',
          fontWeight: 700,
          color: '#666',
        },
        value: {
          width: '70%',
          fontSize: 10,
          fontFamily: 'Roboto',
          fontWeight: 400,
          color: '#333',
        },
        metricsGrid: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginTop: 10,
        },
        metricItem: {
          width: '33.33%',
          marginBottom: 12,
          paddingRight: 8,
        },
        metricLabel: {
          fontSize: 9,
          fontFamily: 'Roboto',
          fontWeight: 700,
          color: '#666',
          marginBottom: 2,
        },
        metricValue: {
          fontSize: 12,
          fontFamily: 'Roboto',
          fontWeight: 700,
          color: '#1976d2',
        },
        list: {
          marginLeft: 20,
        },
        listItem: {
          fontSize: 10,
          fontFamily: 'Roboto',
          fontWeight: 400,
          marginBottom: 4,
          color: '#333',
        },
        footer: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          textAlign: 'center',
          fontSize: 8,
          color: '#999',
          borderTopWidth: 1,
          borderTopColor: '#eee',
          paddingTop: 10,
        },
      }),
    []
  );

type AvaliacaoPDFProps = {
  avaliacao: IAvaliacao;
  metrics: Record<string, number>;
};

export function AvaliacaoPDFDownload({ avaliacao, metrics }: AvaliacaoPDFProps) {
  const hasMetrics =
    Object.keys(metrics).length > 0 && Object.values(metrics).some((value) => value > 0);

  const renderButton = (loading: boolean) => (
    <Tooltip title="Gerar PDF da Evolução">
      <IconButton color="primary">
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          <Iconify icon="eva:file-text-fill" />
        )}
      </IconButton>
    </Tooltip>
  );

  if (!hasMetrics) {
    return (
      <Tooltip title="Adicione métricas para gerar o PDF">
        <span>
          <IconButton disabled>
            <Iconify icon="eva:file-text-fill" />
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  return (
    <PDFDownloadLink
      document={<AvaliacaoPdfDocument avaliacao={avaliacao} metrics={metrics} />}
      fileName={`avaliacao-${(avaliacao.PerfilMembroId as any)?.name || 'aluno'}-${fDate(avaliacao.CreatedAt)}.pdf`}
      style={{ textDecoration: 'none' }}
    >
      {/* @ts-expect-error: https://github.com/diegomura/react-pdf/issues/2886 */}
      {({ loading }) => renderButton(loading)}
    </PDFDownloadLink>
  );
}

// Componente alternativo com botão mais visível
export function AvaliacaoPDFButton({ avaliacao, metrics }: AvaliacaoPDFProps) {
  const hasMetrics =
    Object.keys(metrics).length > 0 && Object.values(metrics).some((value) => value > 0);

  const renderButton = (loading: boolean) => (
    <Button
      variant="contained"
      color="primary"
      startIcon={
        loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <Iconify icon="eva:file-text-fill" />
        )
      }
      disabled={loading || !hasMetrics}
    >
      {loading ? 'Gerando PDF...' : 'Gerar PDF da Evolução'}
    </Button>
  );

  if (!hasMetrics) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Button
          variant="outlined"
          color="warning"
          startIcon={<Iconify icon="eva:alert-triangle-fill" />}
          disabled
        >
          Adicione métricas para gerar PDF
        </Button>
        <Alert severity="info" sx={{ fontSize: '0.875rem' }}>
          Para gerar o PDF da evolução, é necessário adicionar pelo menos uma métrica de avaliação
          física.
        </Alert>
      </Box>
    );
  }

  return (
    <PDFDownloadLink
      document={<AvaliacaoPdfDocument avaliacao={avaliacao} metrics={metrics} />}
      fileName={`avaliacao-${(avaliacao.PerfilMembroId as any)?.name || 'aluno'}-${fDate(avaliacao.CreatedAt)}.pdf`}
      style={{ textDecoration: 'none' }}
    >
      {/* @ts-expect-error: https://github.com/diegomura/react-pdf/issues/2886 */}
      {({ loading }) => renderButton(loading)}
    </PDFDownloadLink>
  );
}

// ----------------------------------------------------------------------

type AvaliacaoPdfDocumentProps = {
  avaliacao: IAvaliacao;
  metrics: Record<string, number>;
};

function AvaliacaoPdfDocument({ avaliacao, metrics }: AvaliacaoPdfDocumentProps) {
  const styles = useStyles();

  const metricLabels: Record<string, string> = {
    weight: 'Peso (kg)',
    height: 'Altura (cm)',
    bmi: 'IMC',
    body_fat_pct: 'Gordura Corporal (%)',
    lean_mass_pct: 'Massa Magra (%)',
    muscle_mass: 'Massa Muscular (kg)',
    bone_mass: 'Massa Óssea (kg)',
    body_water_pct: 'Água Corporal (%)',
    bmr: 'Taxa Metabólica Basal',
    metabolic_age: 'Idade Metabólica',
    visceral_fat: 'Gordura Visceral',
    waist_circ: 'Circunferência Cintura (cm)',
    hip_circ: 'Circunferência Quadril (cm)',
    wh_ratio: 'Relação Cintura/Quadril',
    chest_circ: 'Circunferência Torácica (cm)',
    arm_circ: 'Circunferência Braço (cm)',
    thigh_circ: 'Circunferência Coxa (cm)',
    calf_circ: 'Circunferência Panturrilha (cm)',
    rest_hr: 'Frequência Cardíaca Repouso',
    bp_systolic: 'Pressão Sistólica',
    bp_diastolic: 'Pressão Diastólica',
    vo2max: 'VO2 Máximo',
    body_temp: 'Temperatura Corporal (°C)',
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>Relatório de Avaliação Física</Text>
        <Text style={{ fontSize: 12, color: '#666', marginTop: 15 }}>
          Data: {fDate(avaliacao.CreatedAt)}
        </Text>
      </View>
      <View style={{ textAlign: 'right' }}>
        <Text style={{ fontSize: 12, fontFamily: 'Roboto', fontWeight: 700 }}>TreinUp</Text>
        <Text style={{ fontSize: 10, color: '#666', fontFamily: 'Roboto' }}>Academia</Text>
      </View>
    </View>
  );

  const renderAlunoInfo = () => (
    <View style={styles.section}>
      <Text style={styles.subtitle}>Informações do Aluno</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Nome:</Text>
        <Text style={styles.value}>{(avaliacao.PerfilMembroId as any)?.name || 'N/A'}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{(avaliacao.PerfilMembroId as any)?.email || 'N/A'}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Telefone:</Text>
        <Text style={styles.value}>{(avaliacao.PerfilMembroId as any)?.phoneNumber || 'N/A'}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Treinador:</Text>
        <Text style={styles.value}>
          {(avaliacao.SlotAvaliacaoId as any)?.trainerProfileId?.name || 'N/A'}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Data da Avaliação:</Text>
        <Text style={styles.value}>
          {avaliacao.DataCheckIn ? fDate(avaliacao.DataCheckIn) : fDate(avaliacao.CreatedAt)}
        </Text>
      </View>
    </View>
  );

  const renderMetrics = () => (
    <View style={styles.section}>
      <Text style={styles.subtitle}>Medidas e Avaliações</Text>

      <View style={styles.metricsGrid}>
        {Object.entries(metrics)
          .filter(([_, value]) => value && value > 0)
          .map(([key, value]) => (
            <View key={key} style={styles.metricItem}>
              <Text style={styles.metricLabel}>{metricLabels[key] || key}</Text>
              <Text style={styles.metricValue}>
                {key === 'bmi' || key === 'wh_ratio'
                  ? fNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : key === 'body_fat_pct' || key === 'lean_mass_pct' || key === 'body_water_pct'
                    ? `${fNumber(value, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`
                    : key === 'weight' || key === 'muscle_mass' || key === 'bone_mass'
                      ? `${fNumber(value, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg`
                      : key === 'height' ||
                          key === 'waist_circ' ||
                          key === 'hip_circ' ||
                          key === 'chest_circ' ||
                          key === 'arm_circ' ||
                          key === 'thigh_circ' ||
                          key === 'calf_circ'
                        ? `${fNumber(value, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} cm`
                        : key === 'body_temp'
                          ? `${fNumber(value, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}°C`
                          : fNumber(value, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
              </Text>
            </View>
          ))}
      </View>
    </View>
  );

  const renderObjetivos = () => (
    <View style={styles.section}>
      <Text style={styles.subtitle}>Objetivos</Text>
      {avaliacao.Objetivos && avaliacao.Objetivos.length > 0 ? (
        <View style={styles.list}>
          {avaliacao.Objetivos.map((objetivo, index) => (
            <Text key={index} style={styles.listItem}>
              • {objetivo}
            </Text>
          ))}
        </View>
      ) : (
        <Text style={{ fontSize: 10, color: '#999', fontStyle: 'italic' }}>
          Nenhum objetivo definido
        </Text>
      )}
    </View>
  );

  const renderRestricoes = () => (
    <View style={styles.section}>
      <Text style={styles.subtitle}>Restrições</Text>
      {avaliacao.Restricoes && avaliacao.Restricoes.length > 0 ? (
        <View style={styles.list}>
          {avaliacao.Restricoes.map((restricao, index) => (
            <Text key={index} style={styles.listItem}>
              • {restricao}
            </Text>
          ))}
        </View>
      ) : (
        <Text style={{ fontSize: 10, color: '#999', fontStyle: 'italic' }}>
          Nenhuma restrição registrada
        </Text>
      )}
    </View>
  );

  const renderHistoricoMedico = () => (
    <View style={styles.section}>
      <Text style={styles.subtitle}>Histórico Médico</Text>
      <Text style={{ fontSize: 10, color: '#333', lineHeight: 1.5 }}>
        {avaliacao.HistoricoMedico || 'Nenhum histórico médico registrado'}
      </Text>
    </View>
  );

  const renderObservacoes = () => (
    <View style={styles.section}>
      <Text style={styles.subtitle}>Observações</Text>
      <Text style={{ fontSize: 10, color: '#333', lineHeight: 1.5 }}>
        {avaliacao.Observacoes || 'Nenhuma observação registrada'}
      </Text>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer} fixed>
      <Text style={{ fontFamily: 'Roboto', fontWeight: 400 }}>
        Relatório gerado automaticamente pelo sistema TreinUp em {fDate(new Date())}
      </Text>
      <Text style={{ marginTop: 5, fontFamily: 'Roboto', fontWeight: 400 }}>
        Este documento contém informações confidenciais sobre a avaliação física do aluno
      </Text>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        {renderAlunoInfo()}
        {renderMetrics()}
        {renderFooter()}
      </Page>

      <Page size="A4" style={styles.page}>
        {renderObjetivos()}
        {renderRestricoes()}
        {renderHistoricoMedico()}
        {renderObservacoes()}
        {renderFooter()}
      </Page>
    </Document>
  );
}
