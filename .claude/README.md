# Claude Code - Configuracao do Projeto

## Como usar o contexto base

Este projeto possui um contexto customizado que define padroes, arquitetura e convencoes do Valter (Expo/React Native).

### Opcao 1: Comando slash (Recomendado)

Digite `/project` no inicio de qualquer conversa para carregar automaticamente todas as instrucoes do projeto.
```
/project

Agora crie uma nova tela para gerenciar receitas
```

### Opcao 2: Referencia manual

Voce tambem pode referenciar o arquivo diretamente:

```
Leia .claude/commands/project.md e use essas instrucoes para criar uma nova tela
```

## Estrutura

```
.claude/
├── README.md          <- Este arquivo
└── commands/
    ├── project.md     <- Instrucoes base do projeto (arquitetura, padroes, convencoes)
    └── create_pr.md   <- Instrucoes para criacao de PRs
```

## O que o contexto inclui

- Padrao de resposta obrigatorio (planejamento antes do codigo)
- Tech stack (Expo, React Native, NativeWind, React Hook Form, Zod, etc.)
- Arquitetura do projeto (app/, ui/, services/, common/, hooks/)
- Padrao Container/Presentational para telas
- Service layer para chamadas de API
- Padroes de formularios (Zod + React Hook Form)
- Estilizacao com NativeWind (Tailwind CSS)
- Gerenciamento de estado com Context API
- Padroes de teste (Jest + Testing Library)
- Checklist para novas features

## Dica

Para melhores resultados, sempre inicie suas conversas com `/project` para garantir que o Claude Code entenda os padroes do projeto.
