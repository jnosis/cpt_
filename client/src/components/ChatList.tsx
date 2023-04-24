import { useEffect, useRef } from 'react';
import type { RoomInfo } from '~/types';
import ArticleCard from '~/components/ui/ArticleCard';
import ChatBubble from '~/components/ChatBubble';

type ChatListProps = {
  userId: string;
  room: RoomInfo;
};

export default function ChatList({ userId, room: { chats } }: ChatListProps) {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({
        top: ref.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chats]);

  return (
    <ArticleCard className='flex justify-center w-[90vw] sm:w-[36rem] h-[70vh]'>
      <ul
        ref={ref}
        className='flex flex-col gap-2 p-6 overflow-y-auto scrollbar-none'
      >
        {chats.map((chat) => (
          <ChatBubble
            key={chat.created_at}
            chat={chat}
            isSender={userId === chat.userId}
          />
        ))}
      </ul>
    </ArticleCard>
  );
}
