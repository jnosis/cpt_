import { OpenAI } from 'openai';
import config from '~/config.ts';

const apiKey = config.openAi.apiKey;

const client = new OpenAI(apiKey);

const openAi = {
  async classifySentiment(text: string) {
    return await client.createCompletion({
      model: 'davinci',
      prompt:
        `What is the sentiment of the following text?\n"${text}"\nSentiment:`,
      maxTokens: 1,
      temperature: 0,
      stop: '\n',
    });
  },
  async classifyModeration(text: string) {
    return await client.createModeration(text);
  },
};

export default openAi;
