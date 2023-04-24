import type { RoomInfo } from '~/types';
import ChatBubble from '~/components/ChatBubble';

type ChatListProps = {
  userId: string;
  room: RoomInfo;
};

export default function ChatList({ userId, room }: ChatListProps) {
  return (
    <section>
      <ul>
        {room.chats.map((chat) => (
          <ChatBubble
            key={chat.created_at}
            chat={chat}
            isSender={userId === chat.userId}
          />
        ))}
      </ul>
    </section>
  );
}
