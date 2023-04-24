import type { ChatInfo, Sentiment } from '~/types';
import User from '~/components/User';

type ChatBubbleProps = {
  chat: ChatInfo;
  isSender: boolean;
};

export default function ChatBubble({ chat, isSender }: ChatBubbleProps) {
  const color = calColor(isSender, chat.sentiment);

  return (
    <li
      className={`flex justify-end ${isSender ? '' : 'flex-row-reverse '}gap-1`}
    >
      <div className={`rounded-xl px-4 py-2 max-w-[70%] sm:max-w-[50%] ${color}`}>
        {chat.message}
      </div>
      <User user={{ userId: chat.userId, username: chat.username }} />
    </li>
  );
}

function calColor(isSender: boolean, sentiment: Sentiment) {
  return isSender || sentiment === 'neutral'
    ? 'bg-slate-300 text-slate-700'
    : sentiment === 'positive'
    ? 'bg-green-300 text-green-700'
    : 'bg-rose-300 text-rose-700';
}
