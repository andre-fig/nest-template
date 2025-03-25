#

## Padrão dos logs

[INIT] Inicialização de dependência ou módulo
[ACTION] Execução de alguma ação relevante
[SKIP] Quando uma ação é desnecessária
[DONE] Tarefa concluída com sucesso
[ERROR] Erros (qualquer tipo)

## Geração de Migrations

```bash
    npm run migrations:generate ./src/databases/postgres/migrations/<EntityName>
```
