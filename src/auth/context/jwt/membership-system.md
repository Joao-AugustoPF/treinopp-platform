# Sistema de Membership e TenantId

## Visão Geral

O sistema implementa um controle de acesso baseado em **Teams** do Appwrite, onde cada academia (tenant) é representada por um Team, e os usuários são adicionados como membros com roles específicos.

## Estrutura do Sistema

### 1. **Teams (Academias)**

- Cada academia é um Team no Appwrite
- Team ID = Tenant ID
- Exemplo: `6821988e0022060185a9` = "Lidiane Moretto - Estúdio Personal"

### 2. **Roles (Funções)**

- **OWNER**: Proprietário da academia
- **TRAINER**: Treinador da academia
- **USER**: Aluno/Cliente da academia
- **SUPPORT**: Suporte técnico

### 3. **Profiles (Perfis)**

- Cada usuário tem um perfil na collection `Profiles`
- Campo `tenantId` indica a qual academia pertence
- Campo `role` indica a função na academia

## Fluxo de Sign-up

### **Para Treinadores Pré-cadastrados:**

1. **Verificação de Email**

   ```typescript
   // Check se email já existe no sistema
   const profilesResponse = await databases.listDocuments(
     'treinup',
     '682161970028be4664f2', // Profiles collection
     [Query.equal('email', email)]
   );
   ```

2. **Atualização do Perfil**

   ```typescript
   // Se existe perfil, atualizar com userId
   await databases.updateDocument('treinup', '682161970028be4664f2', existingProfile.$id, {
     userId: newUser.$id,
     name: `${firstName} ${lastName}`,
     status: 'ACTIVE',
   });
   ```

3. **Adição ao Team**
   ```typescript
   // Adicionar treinador ao team da academia
   await functions.createExecution(
     'joinDefaultTeam',
     JSON.stringify({
       userId: newUser.$id,
       teamId: existingProfile.tenantId, // Team da academia
       role: 'TRAINER',
     })
   );
   ```

### **Para Usuários Novos:**

1. **Criação do Perfil**

   ```typescript
   await databases.createDocument('treinup', '682161970028be4664f2', ID.unique(), {
     userId: newUser.$id,
     name: `${firstName} ${lastName}`,
     email,
     role: 'USER',
     tenantId: defaultTenantId, // Team padrão
     status: 'ACTIVE',
   });
   ```

2. **Adição ao Team Padrão**
   ```typescript
   await functions.createExecution(
     'joinDefaultTeam',
     JSON.stringify({
       userId: newUser.$id,
       teamId: defaultTenantId,
       role: 'USER',
     })
   );
   ```

## Função joinDefaultTeam

### **Parâmetros:**

```typescript
{
  userId: string,    // ID do usuário no Appwrite
  teamId: string,    // ID do team (tenantId)
  role?: string      // Role específico (TRAINER, OWNER, USER)
}
```

### **Comportamento:**

- Se `role` não especificado: adiciona como `member`
- Se `role = 'TRAINER'`: adiciona como `member` + `TRAINER`
- Se `role = 'OWNER'`: adiciona como `member` + `OWNER`

### **Exemplo de Resposta:**

```json
{
  "ok": true,
  "teamId": "6821988e0022060185a9",
  "roles": ["member", "TRAINER"],
  "message": "Usuário 123456 adicionado ao team 6821988e0022060185a9 com roles: member, TRAINER"
}
```

## Permissões e Acesso

### **Collection Profiles:**

```typescript
// Permissões configuradas no appwrite.json
"$permissions": [
  "create(\"any\")",
  "read(\"any\")",
  "update(\"any\")",
  "delete(\"any\")"
]
```

### **APIs Protegidas:**

```typescript
// Requer autenticação e membership no team
const authHeader = req.headers.get('authorization');
if (!authHeader?.startsWith('Bearer ')) {
  return NextResponse.json({ message: 'Authorization token missing or invalid' }, { status: 401 });
}
```

## Variáveis de Ambiente

### **Obrigatórias:**

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=treinup
NEXT_PUBLIC_DEFAULT_TENANT_ID=6821988e0022060185a9
```

### **Função joinDefaultTeam:**

```env
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=treinup
DEFAULT_TEAM_ID=6821988e0022060185a9
```

## Casos de Uso

### **1. Treinador Pré-cadastrado**

- Email já existe no sistema
- Perfil com `role: 'TRAINER'`
- `tenantId` específico da academia
- Adicionado ao team com role `TRAINER`

### **2. Usuário Novo**

- Email não existe no sistema
- Perfil criado com `role: 'USER'`
- `tenantId` padrão
- Adicionado ao team padrão

### **3. Owner da Academia**

- Similar ao treinador
- Role `OWNER` no team
- Permissões administrativas

## Troubleshooting

### **Problema: Usuário não aparece no team**

```typescript
// Verificar se a função foi executada
console.log('Resultado da função:', await functions.createExecution(...));
```

### **Problema: Permissões negadas**

```typescript
// Verificar se o usuário tem membership no team correto
const user = await account.get();
const teams = await teams.list();
```

### **Problema: tenantId incorreto**

```typescript
// Verificar se o perfil tem tenantId válido
const profile = await databases.getDocument('treinup', '682161970028be4664f2', profileId);
console.log('TenantId:', profile.tenantId);
```

## Monitoramento

### **Logs Importantes:**

- Criação de usuário no Appwrite
- Atualização/criação de perfil
- Execução da função joinDefaultTeam
- Erros de permissão ou team

### **Métricas:**

- Usuários por team
- Distribuição de roles
- Taxa de sucesso no sign-up
- Tempo de processamento
