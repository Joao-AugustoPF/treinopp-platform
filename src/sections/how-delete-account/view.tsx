import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

export function HowDeleteAccountView() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" gutterBottom>
        Como excluir minha conta
      </Typography>
      <Typography variant="body1" paragraph>
        Para garantir a segurança e o suporte especializado, a exclusão de contas no TreinOPP é
        realizada diretamente pelo responsável da academia.
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Typography variant="h5" gutterBottom>
          Passo a passo para solicitar a exclusão da conta:
        </Typography>
        <Typography component="ol" sx={{ pl: 3 }}>
          <li>Procure o dono ou responsável da academia onde você está cadastrado.</li>
          <li>
            Solicite a ele que entre em contato com o suporte do TreinOPP para realizar a exclusão
            da sua conta.
          </li>
          <li>O responsável fará o contato conosco e sua conta será excluída com segurança.</li>
        </Typography>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="body1" paragraph>
          Se preferir, você também pode enviar um e-mail diretamente para{' '}
          <b>joaoaugustopfpf@gmail.com</b> solicitando a exclusão da sua conta. Nossa equipe irá
          processar sua solicitação o mais breve possível.
        </Typography>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Dúvidas? Entre em contato com nosso suporte para mais informações.
        </Typography>
      </Box>
    </Container>
  );
}
