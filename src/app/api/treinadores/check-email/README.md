# Endpoint: Check Trainer Email

## Descrição

Endpoint público para verificar se um email já está cadastrado no sistema e se pertence a um treinador.

## URL

```
GET /api/treinadores/check-email
```

## Parâmetros de Query

| Parâmetro | Tipo   | Obrigatório | Descrição              |
| --------- | ------ | ----------- | ---------------------- |
| `email`   | string | ✅          | Email a ser verificado |

## Exemplo de Requisição

```bash
GET /api/treinadores/check-email?email=treinador@exemplo.com
```

## Resposta de Sucesso (200)

```json
{
  "success": true,
  "data": {
    "exists": true,
    "isTrainer": true,
    "profile": {
      "Id": "profile_id",
      "Nome": "João Silva",
      "Email": "treinador@exemplo.com",
      "Telefone": "+5511999999999",
      "Status": "ACTIVE"
      // ... outros campos do treinador
    }
  }
}
```

## Resposta de Sucesso - Email não encontrado (200)

```json
{
  "success": true,
  "data": {
    "exists": false,
    "isTrainer": false,
    "profile": null
  }
}
```

## Resposta de Erro - Email inválido (400)

```json
{
  "success": false,
  "message": "Invalid email format"
}
```

## Resposta de Erro - Email não fornecido (400)

```json
{
  "success": false,
  "message": "Email parameter is required"
}
```

## Resposta de Erro - Erro interno (500)

```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Campos da Resposta

| Campo       | Tipo        | Descrição                                       |
| ----------- | ----------- | ----------------------------------------------- |
| `exists`    | boolean     | Indica se o email existe no sistema             |
| `isTrainer` | boolean     | Indica se o perfil é de um treinador            |
| `profile`   | object/null | Dados do perfil se existir, null caso contrário |

## Segurança

- ✅ Endpoint público (não requer autenticação)
- ✅ Validação de formato de email
- ✅ Uso de API Key para acesso ao Appwrite
- ✅ Rate limiting pode ser implementado se necessário

## Uso no Frontend

```typescript
import { useCheckTrainerEmail } from 'src/features/treinadores/treinador/hooks/use-treinador';

const { checkTrainerEmail } = useCheckTrainerEmail();

const result = await checkTrainerEmail('treinador@exemplo.com');
console.log(result); // { exists: true, isTrainer: true, profile: {...} }
```

## Casos de Uso

1. **Sign-up de treinadores**: Verificar se o email já está pré-cadastrado
2. **Validação de formulários**: Prevenir duplicação de emails
3. **UX melhorada**: Mostrar feedback em tempo real durante o cadastro
