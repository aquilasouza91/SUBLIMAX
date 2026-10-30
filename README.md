# Sublimax Proxy Cloud

Servidor intermediário que redireciona requisições do Sublimax Desktop para a API do Lovable.

## Por que isso é necessário?

O Sublimax Desktop original usa `atacadaodasartes.com`, mas queremos redirecionar para `sublimax01.lovable.app`. Este proxy faz essa ponte.

## Deploy Grátis

### Opção 1: Railway.app (RECOMENDADO)

1. Acesse: https://railway.app/
2. Faça login com GitHub
3. Clique em "New Project" → "Deploy from GitHub repo"
4. Selecione este repositório
5. Pronto! URL será: `https://seu-projeto.up.railway.app`

### Opção 2: Render.com

1. Acesse: https://render.com/
2. Faça login com GitHub
3. Clique em "New" → "Web Service"
4. Conecte este repositório
5. Pronto! URL será: `https://sublimax-proxy.onrender.com`

### Opção 3: Heroku

1. Acesse: https://heroku.com/
2. Crie novo app
3. Conecte com GitHub ou faça deploy manual
4. Pronto! URL será: `https://seu-app.herokuapp.com`

## Após o Deploy

Você vai receber uma URL tipo: `https://sublimax-proxy-xyz.up.railway.app`

Anote essa URL e use para modificar o Sublimax Desktop!

## Testar

```bash
curl https://sua-url.com/health
```

Deve retornar:
```json
{"status":"ok","timestamp":"..."}
```

## Logs

Acesse o painel do Railway/Render/Heroku para ver os logs em tempo real.

## Custos

**TOTALMENTE GRÁTIS!**
- Railway: 500 horas/mês grátis
- Render: Ilimitado (com sleep após 15min inativo)
- Heroku: 1000 horas/mês grátis
