import type { NextFunction, OpineRequest, OpineResponse } from 'opine';
import type { Sentiment } from '~/types.ts';
import openai from '~/openai.ts';

export const classifySentiment = async (
  req: OpineRequest,
  _res: OpineResponse,
  next: NextFunction,
) => {
  const message = req.body.message;

  const { choices } = await openai.classifySentiment(message);
  const { text } = choices[0];

  req.body.chat = {
    message,
    sentiment: getSentiment(text),
  };

  next();
};

function getSentiment(text: string): Sentiment {
  const t = text.trim().toLowerCase();
  if (isSentiment(t)) {
    return t;
  }
  return 'neutral';
}

function isSentiment(text: string): text is Sentiment {
  return text === 'positive' || text === 'negative' || text === 'neutral';
}
