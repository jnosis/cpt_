import config from '~/config.ts';

const apiKey = config.openai.apiKey;

const baseUrl = 'https://api.openai.com/v1';

type FeatureType = 'sentiment' | 'moderation';
type Feature = {
  url: string;
  // deno-lint-ignore ban-types
  data(text: string): Object;
};
type Features = Record<FeatureType, Feature>;

const features: Features = {
  sentiment: {
    url: 'completions',
    data: (text: string) => {
      return {
        model: 'text-davinci-003',
        prompt:
          `What is the sentiment of the following text?\n"${text}"\nSentiment:`,
        max_tokens: 1,
        temperature: 0,
        stop: '\n',
      };
    },
  },
  moderation: {
    url: 'moderations',
    data: (text: string) => {
      return { input: text };
    },
  },
};

async function f<Data>(
  type: FeatureType,
  text: string,
): Promise<Data> {
  const res = await fetch(`${baseUrl}/${features[type].url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(features[type].data(text)),
  });

  let data;

  try {
    if (res.status !== 204) data = await res.json();
  } catch (error) {
    throw new Error(error.message, { cause: res.status });
  }

  if (res.status > 299 || res.status < 200) {
    const message = data && data.message
      ? data.message
      : 'Something went wrong';
    throw new Error(message, { cause: res.status });
  }

  return data as Data;
}

type SentimentResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    text: string;
    index: number;
    logprobs: number | null;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

type ModerationsResponse = {
  id: string;
  model: string;
  results: {
    flagged: boolean;
    categories: {
      sexual: boolean;
      hate: boolean;
      violence: boolean;
      'self-harm': boolean;
      'sexual/minors': boolean;
      'hate/threatening': boolean;
      'violence/graphic': boolean;
    };
    category_scores: {
      sexual: number;
      hate: number;
      violence: number;
      'self-harm': number;
      'sexual/minors': number;
      'hate/threatening': number;
      'violence/graphic': number;
    };
  }[];
};

const openai = {
  async classifySentiment(text: string) {
    return await f<SentimentResponse>('sentiment', text);
  },
  async moderate(text: string) {
    return await f<ModerationsResponse>('moderation', text);
  },
};

export default openai;
