# Check Payment Status - Expo Push Notifications

Esta função verifica mensalidades pendentes ou atrasadas e envia notificações push usando o Expo Push Service.

## Como Funciona o Sistema de Push Tokens

### 1. **No App Mobile (React Native/Expo)**

O app mobile precisa registrar para push notifications e obter um token único:

```javascript
import * as Notifications from 'expo-notifications';

// Solicitar permissões
const { status } = await Notifications.requestPermissionsAsync();

// Obter o token único do dispositivo
const token = await Notifications.getExpoPushTokenAsync({
  projectId: 'your-expo-project-id',
});

// Enviar o token para o backend
await sendTokenToBackend(token.data);
```

### 2. **API para Registrar Push Token**

Crie uma API para salvar o push token do usuário:

```javascript
// POST /api/users/push-token
export async function POST(request: Request) {
  const { pushToken } = await request.json();
  const user = await getCurrentUser(); // Obter usuário atual

  // Atualizar o perfil do usuário com o push token
  await databases.updateDocument(
    'treinup',
    '682161970028be4664f2', // Profiles collection
    user.profileId,
    {
      pushToken: pushToken,
      pref_notifications: true, // Habilitar notificações
    }
  );
}
```

### 3. **Estrutura do Banco de Dados**

Adicione os seguintes campos na collection `Profiles`:

```javascript
{
  // ... outros campos existentes
  pushToken: "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]", // Token do Expo
  pref_notifications: true, // Se o usuário quer receber notificações
}
```

## Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Variáveis de Ambiente

```env
# Appwrite Configuration
APPWRITE_ENDPOINT=your_appwrite_endpoint
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_api_key

# Database Configuration
PAYMENT_DATABASE_ID=treinup
MENSALIDADES_COLLECTION_ID=mensalidades
PROFILES_COLLECTION_ID=682161970028be4664f2
```

### 3. Configuração do Expo

No seu `app.json` ou `app.config.js`:

```json
{
  "expo": {
    "name": "TreinUp",
    "slug": "treinup",
    "version": "1.0.0",
    "platforms": ["ios", "android"],
    "notification": {
      "icon": "./assets/notification-icon.png",
      "color": "#000000",
      "iosDisplayInForeground": true,
      "androidMode": "default",
      "androidCollapsedTitle": "Nova notificação"
    },
    "android": {
      "package": "com.treinup.app",
      "googleServicesFile": "./google-services.json"
    },
    "ios": {
      "bundleIdentifier": "com.treinup.app",
      "supportsTablet": true
    }
  }
}
```

## Fluxo Completo

### 1. **Registro do Token**

```javascript
// No app mobile, quando o usuário faz login
const token = await Notifications.getExpoPushTokenAsync({
  projectId: 'your-expo-project-id',
});

// Enviar para o backend
await fetch('/api/users/push-token', {
  method: 'POST',
  headers: { Authorization: `Bearer ${userToken}` },
  body: JSON.stringify({ pushToken: token.data }),
});
```

### 2. **Verificação de Mensalidades**

A função `Check Payment Status` agora:

- Busca mensalidades pendentes/atrasadas
- Para cada mensalidade, busca o push token do usuário
- Verifica se o usuário habilitou notificações
- Envia a notificação push personalizada

### 3. **Recebimento da Notificação**

```javascript
// No app mobile
Notifications.addNotificationReceivedListener((notification) => {
  console.log('Notificação recebida:', notification);

  // Navegar para a tela de pagamentos se necessário
  if (notification.request.content.data.mensalidadeId) {
    navigation.navigate('Payments', {
      mensalidadeId: notification.request.content.data.mensalidadeId,
    });
  }
});
```

## Funcionalidades

- **Token Individual**: Cada usuário tem seu próprio push token
- **Preferências**: Respeita as preferências de notificação do usuário
- **Entrega Confiável**: Usa as melhores práticas do Expo para entrega confiável
- **Tratamento de Erros**: Verifica tokens inválidos e falhas de entrega
- **Verificação de Recebimento**: Opcional para verificar status de entrega

## Agendamento de Notificações

A função envia notificações:

- 7 dias antes do vencimento
- 3 dias antes do vencimento
- 1 dia antes do vencimento
- No dia do vencimento
- Quando estiver atrasada

## Resposta da API

```json
{
  "ok": true,
  "notificacoes": [
    {
      "alunoId": "user123",
      "mensalidadeId": "mens456",
      "diasParaVencimento": 3,
      "status": "PENDENTE"
    }
  ],
  "total": 1,
  "pushNotificationsSent": 1
}
```

## Troubleshooting

- **Token Inválido**: Verifique se o token está no formato correto do Expo
- **Permissões**: Certifique-se de que o app tem permissão para notificações
- **Falhas de Entrega**: Verifique os logs para erros específicos
- **Usuário sem Token**: Usuários sem push token registrado não receberão notificações

## Próximos Passos

1. **Implementar API de Push Token**: Criar endpoint para registrar tokens
2. **Configurar App Mobile**: Implementar registro de notificações
3. **Testar Notificações**: Usar tokens de teste para validar
4. **Monitoramento**: Implementar logs para acompanhar entregas
