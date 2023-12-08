# Projeto-de-back-end

Entrada de dados
empresa
{
	"nome": "string"	
}

plataforma
{
	"nome": "string",
	"empresa": "ID_EMPRESA"
}

jogos
{
  "name": "string",
  "classification": "number",
  "genre": "string",
  "price": "number",
  "description": "string",
  "plataforma": ["ID_PLATAFORMA_1", "ID_PLATAFORMA_2"]
}

arquivo .env
SECRET_KEY_1=twq22222
SECRET_KEY_2=12234321
MONGO_KEY_ACCESS=CHAVE_DE_ACESSO
DEV_PADRAO=devPadrao@gmail.com
SENHA_DEV_PADRAO=senhaDoDevPadrao
