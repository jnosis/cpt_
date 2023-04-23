import type { RoomInfo } from '~/types';
import ChatBubble from '~/components/ChatBubble';
import SendMessage from '~/components/SendMessage';

type ChatListProps = {
  userId: string;
  room: RoomInfo;
  onSend(message: string): void;
};

export default function ChatList({ userId, room, onSend }: ChatListProps) {
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
      <SendMessage onSend={onSend} />
    </section>
  );
}
