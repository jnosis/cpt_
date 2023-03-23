type Message = {
  method: string;
  baseUrl: string;
  status: number;
  param?: string;
  message?: string;
};

export const convertToMessage = (msg: Message | Error): string | Error => {
  if (isMessage(msg)) {
    const { method, baseUrl, param, status, message } = msg;
    const path = `${baseUrl}${param ? `/${param}` : ''}`;
    return `${method} ${path} ${status} ${message ? message : ''}`;
  }
  return msg;
};

function isMessage(msg: unknown): msg is Message {
  return (
    !!(msg as Message).method &&
    !!(msg as Message).baseUrl &&
    !!(msg as Message).status
  );
}
