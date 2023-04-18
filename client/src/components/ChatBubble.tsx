import { ChatInfo } from '../types';

type ChatBubbleProps = {
  chat: ChatInfo;
  isSender: boolean;
};

export default function ChatBubble({ chat }: ChatBubbleProps) {
  return <li>{chat.message}</li>;
}
