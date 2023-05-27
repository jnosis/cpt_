import { OpenAI } from 'openai';
import config from '~/config.ts';

const apiKey = config.openAi.apiKey;

const client = new OpenAI(apiKey);

const openAi = {
  async classifySentiment(text: string) {
    return await client.createCompletion({
      model: 'text-davinci-003',
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
  async translate(language: string, text: string) {
    return await client.createCompletion({
      model: 'text-davinci-003',
      prompt: `Translate the followings into ${language}\n${text}`,
      maxTokens: 2048,
      temperature: 0.3,
    });
  },
};

export default openAi;
