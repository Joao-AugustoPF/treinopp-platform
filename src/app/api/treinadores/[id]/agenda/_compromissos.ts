import { v4 as uuidv4 } from 'uuid';

import { TipoAula } from 'src/features/aulas/types';
import { _treinadores } from 'src/_mock/_treinadores';
import { TipoEvento } from 'src/features/treinadores/treinador/types/calendar';

// Mock de compromissos/agendas para cada treinador
export const _compromissos: Record<string, any[]> = {};

// Lista de tipos de evento
const tiposEvento = Object.values(TipoEvento);

// Lista de tipos de aula
const tiposAula = Object.values(TipoAula);

// Lista de locais possíveis
const locaisCompromissos = ['Academia', 'Sala de Treino', 'Consultório', 'Sala de Reunião'];

// Inicializa alguns compromissos para os treinadores existentes
_treinadores.forEach((treinador) => {
  if (!_compromissos[treinador.Id]) {
    _compromissos[treinador.Id] = [];

    // Garantir que cada treinador tenha pelo menos 3 compromissos
    const compromissosCount = 3 + Math.floor(Math.random() * 3); // Entre 3 e 5

    for (let i = 0; i < compromissosCount; i++) {
      const dataHoje = new Date();
      // Data aleatória entre hoje e 30 dias à frente
      const dataInicio = new Date(dataHoje);
      dataInicio.setDate(dataHoje.getDate() + Math.floor(Math.random() * 30));

      // Hora aleatória entre 8h e 17h
      const hora = 8 + Math.floor(Math.random() * 9);
      const minuto = Math.floor(Math.random() * 60);

      const dataFim = new Date(dataInicio);
      dataFim.setHours(dataFim.getHours() + 2); // Duração de 2 horas

      const eventoId = `${treinador.Id}-evento-${i + 1}`;

      _compromissos[treinador.Id].push({
        Id: eventoId,
        Titulo: `Evento ${i + 1} - ${treinador.Nome}`,
        TreinadorId: treinador.Id,
        DataInicio: dataInicio.toISOString().split('T')[0],
        HoraInicio: `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`,
        DataFim: dataFim.toISOString().split('T')[0],
        HoraFim: `${String(hora + 2).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`,
        Local: locaisCompromissos[Math.floor(Math.random() * locaisCompromissos.length)],
        TipoEvento: tiposEvento[Math.floor(Math.random() * tiposEvento.length)],
        TipoAula:
          Math.random() > 0.5 ? tiposAula[Math.floor(Math.random() * tiposAula.length)] : undefined,
        CapacidadeMaxima: Math.random() > 0.5 ? Math.floor(Math.random() * 20) + 10 : undefined,
        VagasDisponiveis: Math.random() > 0.5 ? Math.floor(Math.random() * 10) : undefined,
        AlunoId: Math.random() > 0.7 ? uuidv4() : undefined,
        Observacao: Math.random() > 0.5 ? `Observação para o evento ${i + 1}` : '',
        CreatedAt: new Date().toISOString(),
        CreatedBy: 'system',
        UpdatedAt: new Date().toISOString(),
        UpdatedBy: 'system',
        IsDeleted: false,
      });
    }

    // Adicionar eventos para hoje e amanhã para garantir visualização imediata
    const hoje = new Date();
    const amanha = new Date();
    amanha.setDate(hoje.getDate() + 1);

    // Evento para hoje
    _compromissos[treinador.Id].push({
      Id: `${treinador.Id}-evento-hoje`,
      Titulo: `Treino Personalizado - ${treinador.Nome}`,
      TreinadorId: treinador.Id,
      DataInicio: hoje.toISOString().split('T')[0],
      HoraInicio: '10:00',
      DataFim: hoje.toISOString().split('T')[0],
      HoraFim: '12:00',
      Local: 'Academia',
      TipoEvento: TipoEvento.AULA,
      TipoAula: tiposAula[0],
      CapacidadeMaxima: 1,
      VagasDisponiveis: 0,
      Observacao: 'Treino de força',
      CreatedAt: new Date().toISOString(),
      CreatedBy: 'system',
      UpdatedAt: new Date().toISOString(),
      UpdatedBy: 'system',
      IsDeleted: false,
    });

    // Evento para amanhã
    _compromissos[treinador.Id].push({
      Id: `${treinador.Id}-evento-amanha`,
      Titulo: `Avaliação Física - ${treinador.Nome}`,
      TreinadorId: treinador.Id,
      DataInicio: amanha.toISOString().split('T')[0],
      HoraInicio: '14:30',
      DataFim: amanha.toISOString().split('T')[0],
      HoraFim: '15:30',
      Local: 'Consultório',
      TipoEvento: TipoEvento.AVALIACAO,
      Observacao: 'Avaliação de composição corporal',
      CreatedAt: new Date().toISOString(),
      CreatedBy: 'system',
      UpdatedAt: new Date().toISOString(),
      UpdatedBy: 'system',
      IsDeleted: false,
    });
  }
});
