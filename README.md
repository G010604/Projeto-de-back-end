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
SECRET_KEY_1=tokenDoUsuario
SECRET_KEY_2=tokenDoDev
MONGO_KEY_ACCESS=CHAVE_DE_ACESSO_DO_BANCO_DE_DADOS
DEV_PADRAO=devPadrao@gmail.com
SENHA_DEV_PADRAO=senhaDoDevPadrao
