export interface IHttpClient {
  fetch<Data>(url: string, options: RequestInit): Promise<Data>;
}
