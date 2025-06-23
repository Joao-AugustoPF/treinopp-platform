import { v4 as uuidv4 } from 'uuid';

import { _treinadores } from 'src/_mock/_treinadores';

// Mock de avaliações para cada treinador
export const _avaliacoes: Record<string, any[]> = {};

// Inicializa algumas avaliações para os treinadores existentes
_treinadores.forEach((treinador) => {
  if (!_avaliacoes[treinador.Id]) {
    _avaliacoes[treinador.Id] = [];

    // Garantir que cada treinador tenha pelo menos 2 avaliações
    const avaliacoesCount = 2 + Math.floor(Math.random() * 3); // Entre 2 e 4

    for (let i = 0; i < avaliacoesCount; i++) {
      const dataHoje = new Date();
      // Data aleatória entre hoje e 30 dias à frente
      const dataAvaliacao = new Date(dataHoje);
      dataAvaliacao.setDate(dataHoje.getDate() + Math.floor(Math.random() * 30));

      // Hora aleatória entre 8h e 17h
      const hora = 8 + Math.floor(Math.random() * 9);
      const minuto = Math.floor(Math.random() * 60);

      _avaliacoes[treinador.Id].push({
        Id: uuidv4(),
        Nome: `Avaliação ${i + 1} - ${treinador.Nome}`,
        CreatedAt: new Date().toISOString(),
        CreatedBy: 'system',
        UpdatedAt: new Date().toISOString(),
        UpdatedBy: 'system',
        IsDeleted: false,
        TreinadorId: treinador.Id,
        AlunoId: uuidv4(), // Mock de ID do aluno
        DataAvaliacao: dataAvaliacao.toISOString().split('T')[0],
        HoraAvaliacao: `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`,
        Nota: Math.floor(Math.random() * 11), // Nota entre 0 e 10
        Comentario:
          Math.random() > 0.5 ? `Comentário para a avaliação ${i + 1} de ${treinador.Nome}` : '',
      });
    }

    // Adicionar avaliações para hoje e amanhã para garantir visualização imediata
    const hoje = new Date();
    const amanha = new Date();
    amanha.setDate(hoje.getDate() + 1);

    // Avaliação para hoje
    _avaliacoes[treinador.Id].push({
      Id: uuidv4(),
      Nome: `Avaliação Física Inicial - ${treinador.Nome}`,
      CreatedAt: new Date().toISOString(),
      CreatedBy: 'system',
      UpdatedAt: new Date().toISOString(),
      UpdatedBy: 'system',
      IsDeleted: false,
      TreinadorId: treinador.Id,
      AlunoId: uuidv4(),
      DataAvaliacao: hoje.toISOString().split('T')[0],
      HoraAvaliacao: '10:00',
      Nota: 8,
      Comentario: 'Bom desempenho geral',
    });

    // Avaliação para amanhã
    _avaliacoes[treinador.Id].push({
      Id: uuidv4(),
      Nome: `Avaliação de Progresso - ${treinador.Nome}`,
      CreatedAt: new Date().toISOString(),
      CreatedBy: 'system',
      UpdatedAt: new Date().toISOString(),
      UpdatedBy: 'system',
      IsDeleted: false,
      TreinadorId: treinador.Id,
      AlunoId: uuidv4(),
      DataAvaliacao: amanha.toISOString().split('T')[0],
      HoraAvaliacao: '14:30',
      Nota: 7,
      Comentario: 'Melhoria significativa na força',
    });
  }
});
