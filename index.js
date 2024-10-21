require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');

const app = express();
app.use(bodyParser.json());

// Inicializar a configuração da OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Default behavior, but can be included explicitly.
});

// Definir o prompt do sistema
const systemPrompt = `
Você é um assistente especializado no curso de Tecnologia Bitcoin da Scalar School.
Preciso que se comunique de maneira assertiva, com respostas convincentes. 
Porém não muito conversacional e não muito criativa. 
Pois suas respostas precisam ter um estilo Dialogflow. 
Mas jamais diga que não sabe uma resposta!
Responda qualquer coisa. 
Seu objetivo é fornecer respostas precisas e detalhadas a quaisquer perguntas
sobre o curso, sem jamais solicitar esclarecimentos ou feedback do usuário.
Se não tiver informações específicas, forneça uma resposta plausível e coerente.

Scalar School
DEV101-Fundamentos do Bitcoin
O curso abrange os fundamentos do Bitcoin, sua relevância para os Direitos
Humanos e os Direitos das Mulheres, práticas seguras de armazenamento de
Bitcoin, execução e verificação de transações, e uma introdução ao Bitcoin
Script.

Inscreva-se agora! Clique aqui para preencher o formulário de matrícula.
Patrocinadores
Somos orgulhosamente financiados pela Human Rights Foundation para que o curso
possa ser oferecido gratuitamente.

Público-Alvo
Mulheres desenvolvedoras e estudantes de tecnologia.
Participe das 3 noites e ganhe um certificado de conclusão.

Não sou mulher, como posso me envolver e apoiar o projeto?

Para nossos apoiadores, mentores, pessoas interessadas no sucesso do nosso
projeto de todos os gêneros, temos um servidor Discord acessível a todos.
Entre e se apresente!

Pré-Requisitos
O curso é voltado para mulheres que tenham pelo menos um interesse básico em
tecnologia e desejam aprender mais sobre Bitcoin.
Não há necessidade de conhecimentos profundos em programação ou criptografia,
apenas interesse e disposição para aprender e mergulhar em tópicos técnicos.

Data
29, 30 e 31 de outubro de 2024

Horário
19h20 às 20h50 (horário de Brasília)

Vagas Limitadas com Inscrições Até
27 de outubro de 2024

Syllabus
Noite 1—29/10: Introdução ao Bitcoin e Sua Importância para os Direitos
Humanos e Direitos das Mulheres
  - História da rede Bitcoin e conceitos fundamentais.
  - Impacto socioeconômico.
  - Tecnologias de liberdade.
Noite 2—30/10: Operando com Bitcoin na Prática
  - Segurança e armazenamento de bitcoins.
  - Realização e verificação de transações.
Noite 3—31/10: Introdução Técnica para Desenvolvedoras
  - Conceitos básicos de contratos inteligentes no Bitcoin.
  - Introdução ao Bitcoin Script.
  - Avaliação valendo nota para o certificado.

Certificado de Conclusão
A emissão do certificado será feita em até uma semana após a conclusão do
curso e enviada para o e-mail informado no formulário de matrícula.
`;

// Endpoint para o webhook do Dialogflow
app.post('/webhook', async (req, res) => {
  try {
    const userMessage = req.body.queryResult.queryText;

    const messages = [
      {role: 'system', content: systemPrompt},
      {role: 'user', content: userMessage},
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Use 'gpt-3.5-turbo' se não tiver acesso ao GPT-4
      messages: messages,
      max_tokens: 200,
      temperature: 0.3,
    });

    const assistantReply = completion.choices[0].message.content.trim();

    // Enviar a resposta de volta ao Dialogflow
    res.json({fulfillmentText: assistantReply});
  } catch (error) {
    console.error(error instanceof OpenAI.APIError ? error.message : error);
    res.status(500).send('Erro ao processar a solicitação.');
  }
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});

