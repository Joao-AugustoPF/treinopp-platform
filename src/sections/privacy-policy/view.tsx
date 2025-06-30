import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

export function PrivacyPolicyView() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" gutterBottom>
        Política de Privacidade – TreinOPP
      </Typography>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Última atualização: 30 de junho de 2025
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          1. Introdução
        </Typography>
        <Typography paragraph>
          Bem-vindo(a) ao TreinOPP (“Aplicativo”, “nós”, “nosso” ou “empresa”). Esta Política de
          Privacidade explica como coletamos, usamos, armazenamos, compartilhamos e protegemos os
          seus dados pessoais quando você utiliza o nosso aplicativo Android. Priorizamos a
          transparência e a proteção de seus direitos, em conformidade com a Lei Geral de Proteção
          de Dados (Lei 13.709/2018 – LGPD), o Regulamento Geral de Proteção de Dados da União
          Europeia (GDPR) e as políticas da Google Play Store.
        </Typography>
        <Typography paragraph>
          Ao instalar, acessar ou usar o TreinOPP, você declara estar ciente e de acordo com as
          práticas descritas abaixo.
        </Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          2. Quais dados coletamos
        </Typography>
        <Box
          component="table"
          sx={{ width: '100%', mb: 2, borderCollapse: 'collapse', fontSize: 15 }}
        >
          <Box component="thead" sx={{ bgcolor: 'grey.100' }}>
            <Box component="tr">
              <Box component="th" sx={{ border: 1, borderColor: 'grey.300', p: 1 }}>
                Categoria
              </Box>
              <Box component="th" sx={{ border: 1, borderColor: 'grey.300', p: 1 }}>
                Exemplos
              </Box>
              <Box component="th" sx={{ border: 1, borderColor: 'grey.300', p: 1 }}>
                Finalidade principal
              </Box>
            </Box>
          </Box>
          <Box component="tbody">
            <Box component="tr">
              <Box component="td" sx={{ border: 1, borderColor: 'grey.300', p: 1 }}>
                Dados de cadastro
              </Box>
              <Box component="td" sx={{ border: 1, borderColor: 'grey.300', p: 1 }}>
                Nome, e-mail, CPF, telefone, data de nascimento
              </Box>
              <Box component="td" sx={{ border: 1, borderColor: 'grey.300', p: 1 }}>
                Criação e gestão da sua conta
              </Box>
            </Box>
            <Box component="tr">
              <Box component="td" sx={{ border: 1, borderColor: 'grey.300', p: 1 }}>
                Dados de academia
              </Box>
              <Box component="td" sx={{ border: 1, borderColor: 'grey.300', p: 1 }}>
                Plano ativo, histórico de avaliações físicas, agendamentos
              </Box>
              <Box component="td" sx={{ border: 1, borderColor: 'grey.300', p: 1 }}>
                Entregar as funcionalidades essenciais do app
              </Box>
            </Box>
            <Box component="tr">
              <Box component="td" sx={{ border: 1, borderColor: 'grey.300', p: 1 }}>
                Dados de pagamento
              </Box>
              <Box component="td" sx={{ border: 1, borderColor: 'grey.300', p: 1 }}>
                Valor, status, forma de pagamento (não armazenamos dados completos de cartão)
              </Box>
              <Box component="td" sx={{ border: 1, borderColor: 'grey.300', p: 1 }}>
                Processar e registrar pagamentos
              </Box>
            </Box>
            <Box component="tr">
              <Box component="td" sx={{ border: 1, borderColor: 'grey.300', p: 1 }}>
                Dados de dispositivo
              </Box>
              <Box component="td" sx={{ border: 1, borderColor: 'grey.300', p: 1 }}>
                Modelo, sistema operacional, ID do dispositivo, idioma, fuso horário
              </Box>
              <Box component="td" sx={{ border: 1, borderColor: 'grey.300', p: 1 }}>
                Otimizar desempenho, prevenir fraudes e erros
              </Box>
            </Box>
            <Box component="tr">
              <Box component="td" sx={{ border: 1, borderColor: 'grey.300', p: 1 }}>
                Dados de uso
              </Box>
              <Box component="td" sx={{ border: 1, borderColor: 'grey.300', p: 1 }}>
                Telas visitadas, cliques, duração de sessão
              </Box>
              <Box component="td" sx={{ border: 1, borderColor: 'grey.300', p: 1 }}>
                Melhorar a experiência do usuário e o produto
              </Box>
            </Box>
            <Box component="tr">
              <Box component="td" sx={{ border: 1, borderColor: 'grey.300', p: 1 }}>
                Dados de localização (opcional)
              </Box>
              <Box component="td" sx={{ border: 1, borderColor: 'grey.300', p: 1 }}>
                Localização aproximada via GPS
              </Box>
              <Box component="td" sx={{ border: 1, borderColor: 'grey.300', p: 1 }}>
                Encontrar academias próximas ou ofertas regionais
              </Box>
            </Box>
          </Box>
        </Box>
        <Typography paragraph>
          Você pode recusar permissões não essenciais a qualquer momento nas configurações do
          dispositivo; algumas funcionalidades podem ficar limitadas.
        </Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          3. Como usamos seus dados
        </Typography>
        <Typography component="ul" sx={{ pl: 3 }}>
          <li>
            Prestação dos serviços – exibir planos, avaliações, agendamentos e relatórios de
            evolução.
          </li>
          <li>
            Comunicações – enviar notificações sobre vencimento de mensalidade, lembretes de
            avaliações e novidades da academia.
          </li>
          <li>
            Melhoria contínua – analisar métricas de uso e feedback para aprimorar o aplicativo.
          </li>
          <li>Segurança – detectar, prevenir e corrigir fraudes, abuso ou falhas técnicas.</li>
          <li>
            Marketing (opt-in) – ofertas personalizadas de planos, produtos fitness ou parceiros.
            Você pode cancelar a qualquer momento.
          </li>
        </Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          4. Base legal para o tratamento
        </Typography>
        <Typography component="ul" sx={{ pl: 3 }}>
          <li>Execução de contrato (art. 7º V LGPD) – para fornecer o serviço solicitado.</li>
          <li>
            Legítimo interesse (art. 7º IX LGPD) – segurança e melhoria do app, respeitando seus
            direitos.
          </li>
          <li>
            Consentimento (art. 7º I LGPD) – envio de marketing, coleta de localização ou dados
            sensíveis.
          </li>
          <li>Cumprimento de obrigação legal/regulatória (art. 7º II LGPD).</li>
        </Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          5. Compartilhamento de dados
        </Typography>
        <Box
          component="table"
          sx={{ width: '100%', mb: 2, borderCollapse: 'collapse', fontSize: 15 }}
        >
          <Box component="thead" sx={{ bgcolor: 'grey.100' }}>
            <Box component="tr">
              <Box component="th" sx={{ border: 1, borderColor: 'grey.300', p: 1 }}>
                Destinatário
              </Box>
              <Box component="th" sx={{ border: 1, borderColor: 'grey.300', p: 1 }}>
                Motivo
              </Box>
            </Box>
          </Box>
          <Box component="tbody">
            <Box component="tr">
              <Box component="td" sx={{ border: 1, borderColor: 'grey.300', p: 1 }}>
                Parceiros de pagamento
              </Box>
              <Box component="td" sx={{ border: 1, borderColor: 'grey.300', p: 1 }}>
                Processar transações ou registrar mensalidades
              </Box>
            </Box>
            <Box component="tr">
              <Box component="td" sx={{ border: 1, borderColor: 'grey.300', p: 1 }}>
                Instituições de ensino físico/academias
              </Box>
              <Box component="td" sx={{ border: 1, borderColor: 'grey.300', p: 1 }}>
                Gerir planos, avaliações e acesso à academia
              </Box>
            </Box>
            <Box component="tr">
              <Box component="td" sx={{ border: 1, borderColor: 'grey.300', p: 1 }}>
                Provedores de nuvem e analytics
              </Box>
              <Box component="td" sx={{ border: 1, borderColor: 'grey.300', p: 1 }}>
                Hospedagem, backups, métricas e logs
              </Box>
            </Box>
            <Box component="tr">
              <Box component="td" sx={{ border: 1, borderColor: 'grey.300', p: 1 }}>
                Autoridades governamentais
              </Box>
              <Box component="td" sx={{ border: 1, borderColor: 'grey.300', p: 1 }}>
                Cumprir obrigações legais ou ordens judiciais
              </Box>
            </Box>
            <Box component="tr">
              <Box component="td" sx={{ border: 1, borderColor: 'grey.300', p: 1 }}>
                Terceiros mediante consentimento
              </Box>
              <Box component="td" sx={{ border: 1, borderColor: 'grey.300', p: 1 }}>
                Integrações extras (ex.: wearables, planos de nutrição)
              </Box>
            </Box>
          </Box>
        </Box>
        <Typography paragraph>Não vendemos seus dados pessoais.</Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          6. Armazenamento e segurança
        </Typography>
        <Typography paragraph>Criptografia de dados em trânsito (HTTPS) e em repouso.</Typography>
        <Typography paragraph>
          Controle de acesso com autenticação forte, funções e logs.
        </Typography>
        <Typography paragraph>
          Backups rotativos em provedores certificados ISO/IEC 27001.
        </Typography>
        <Typography paragraph>
          Manteremos seus dados enquanto durar a relação contratual e pelos prazos legais de
          retenção. Após esse período, serão anonimizados ou eliminados com métodos seguros.
        </Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          7. Seus direitos
        </Typography>
        <Typography paragraph>
          Você pode exercer, a qualquer momento, os direitos previstos nos arts. 18 e 20 da LGPD,
          como: confirmar a existência de tratamento, acessar, corrigir, portar, revogar
          consentimento, solicitar anonimização, bloqueio ou eliminação de dados desnecessários.
          Envie sua solicitação para <b>joaoaugustopfpf@gmail.com</b> (ou outro e-mail oficial que
          você definir); responderemos em até 15 dias.
        </Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          8. Cookies e tecnologias semelhantes
        </Typography>
        <Typography paragraph>
          Utilizamos cookies e identificadores (ex.: Firebase Analytics) para análise de desempenho
          e personalização. Você pode desativá-los no dispositivo, mas algumas funções podem ser
          afetadas.
        </Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          9. Serviços e links de terceiros
        </Typography>
        <Typography paragraph>
          O TreinOPP pode conter links ou integrações com serviços externos (ex.: vídeos do YouTube,
          processadores de pagamento). Não controlamos as práticas desses terceiros; recomendamos
          que você leia suas respectivas políticas de privacidade.
        </Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          10. Privacidade de crianças e adolescentes
        </Typography>
        <Typography paragraph>
          O aplicativo não é destinado a menores de 13 anos sem consentimento dos responsáveis. Se
          identificarmos dados de menor coletados sem a devida autorização, eliminaremos
          imediatamente.
        </Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          11. Transferência internacional
        </Typography>
        <Typography paragraph>
          Podemos transferir dados para servidores fora do Brasil (ex.: Google Cloud nos EUA ou UE).
          Adotamos cláusulas contratuais padrão e garantias adequadas, conforme art. 33 LGPD.
        </Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          12. Alterações nesta política
        </Typography>
        <Typography paragraph>
          Poderemos atualizar esta Política periodicamente. Quando isso ocorrer, notificaremos você
          via aplicativo ou e-mail, indicando a nova data de vigência. O uso continuado do TreinOPP
          após as mudanças representará sua concordância.
        </Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          13. Como falar conosco
        </Typography>
        <Typography paragraph>
          <b>Encarregado de Proteção de Dados (DPO)</b>
          <br />
          Nome: João Augusto
          <br />
          E-mail: joaoaugustopfpf@gmail.com
          <br />
          Endereço: Rua das Latanias, 35 – Santa Catarina/SC – CEP 88905-274 – Brasil
        </Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography paragraph>
          Ao clicar em “Aceitar” ou continuar a usar o TreinOPP, você confirma que leu e compreendeu
          integralmente esta Política de Privacidade.
        </Typography>
      </Box>
    </Container>
  );
}
