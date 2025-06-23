import { v4 as uuidv4 } from 'uuid';

import { _detentos } from 'src/_mock/_detentos';
import { TipoAtendimento } from 'src/features/detentos/detento/types/compromisso';
// Mock de compromissos/agendas para cada detento
export const _compromissos: Record<string, any[]> = {};

// Lista de tipos de atendimento
const tiposAtendimento = Object.values(TipoAtendimento);

// Lista de locais possíveis
const locaisCompromissos = [
  'Sala de Audiência',
  'Ambulatório',
  'Sala de Aula',
  'Consultório Médico',
];

// Inicializa alguns compromissos para os detentos existentes
_detentos.forEach((detento) => {
  if (!_compromissos[detento.Id]) {
    _compromissos[detento.Id] = [];

    // Garantir que cada detento tenha pelo menos 3 compromissos
    const compromissosCount = 3 + Math.floor(Math.random() * 3); // Entre 3 e 5

    for (let i = 0; i < compromissosCount; i++) {
      const dataHoje = new Date();
      // Data aleatória entre hoje e 30 dias à frente
      const dataCompromisso = new Date(dataHoje);
      dataCompromisso.setDate(dataHoje.getDate() + Math.floor(Math.random() * 30));

      // Hora aleatória entre 8h e 17h
      const hora = 8 + Math.floor(Math.random() * 9);
      const minuto = Math.floor(Math.random() * 60);

      _compromissos[detento.Id].push({
        Id: uuidv4(),
        Nome: `Compromisso ${i + 1} - ${detento.Nome}`,
        CreatedAt: new Date().toISOString(),
        CreatedBy: 'system',
        UpdatedAt: new Date().toISOString(),
        UpdatedBy: 'system',
        IsDeleted: false,
        DetentoId: detento.Id,
        DataAgendamentoCompromisso: dataCompromisso.toISOString().split('T')[0],
        HoraAgendamentoCompromisso: `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`,
        LocalCompromisso: locaisCompromissos[Math.floor(Math.random() * locaisCompromissos.length)],
        IsRealizado: false,
        HasEscolta: Math.random() > 0.5,
        IsMovimentacaoExterna: Math.random() > 0.7,
        Observacao:
          Math.random() > 0.5 ? `Observação para o compromisso ${i + 1} de ${detento.Nome}` : '',
        TipoAtendimento: tiposAtendimento[Math.floor(Math.random() * tiposAtendimento.length)],
      });
    }

    // Adicionar compromissos para hoje e amanhã para garantir visualização imediata
    const hoje = new Date();
    const amanha = new Date();
    amanha.setDate(hoje.getDate() + 1);

    // Compromisso para hoje
    _compromissos[detento.Id].push({
      Id: uuidv4(),
      Nome: `Consulta médica - ${detento.Nome}`,
      CreatedAt: new Date().toISOString(),
      CreatedBy: 'system',
      UpdatedAt: new Date().toISOString(),
      UpdatedBy: 'system',
      IsDeleted: false,
      DetentoId: detento.Id,
      DataAgendamentoCompromisso: hoje.toISOString().split('T')[0],
      HoraAgendamentoCompromisso: `10:00`,
      LocalCompromisso: 'Ambulatório',
      IsRealizado: false,
      HasEscolta: true,
      IsMovimentacaoExterna: false,
      Observacao: 'Consulta de rotina',
      TipoAtendimento: 'saude',
    });

    // Compromisso para amanhã
    _compromissos[detento.Id].push({
      Id: uuidv4(),
      Nome: `Audiência - ${detento.Nome}`,
      CreatedAt: new Date().toISOString(),
      CreatedBy: 'system',
      UpdatedAt: new Date().toISOString(),
      UpdatedBy: 'system',
      IsDeleted: false,
      DetentoId: detento.Id,
      DataAgendamentoCompromisso: amanha.toISOString().split('T')[0],
      HoraAgendamentoCompromisso: `14:30`,
      LocalCompromisso: 'Sala de Audiência',
      IsRealizado: false,
      HasEscolta: true,
      IsMovimentacaoExterna: true,
      Observacao: 'Audiência de custódia',
      TipoAtendimento: 'juridico',
    });
  }
});
