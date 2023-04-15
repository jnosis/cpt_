import type { IHttpClient } from '../types';

export default class HttpClient implements IHttpClient {
  #baseUrl: string;
  constructor(baseUrl: string) {
    this.#baseUrl = baseUrl;
  }

  async fetch<Data>(url: string, options: RequestInit) {
    const res = await fetch(`${this.#baseUrl}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    });

    let data;
    try {
      if (res.status !== 204) data = await res.json();
    } catch (error) {
      console.log(error);
    }

    if (res.status > 299 || res.status < 200) {
      const message = data && data.message
        ? data.message
        : 'Something went wrong';
      throw new Error(message);
    }

    return data as Data;
  }
}
