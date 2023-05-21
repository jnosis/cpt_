import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { RoomCreateInfo } from '~/types';
import RoomApi from '~/api/room';
import { useAuthContext } from '~/contexts/AuthContext';
import HttpClient from '~/networks/http';

const baseUrl = import.meta.env.VITE_SERVER_URL;

const roomApi = new RoomApi(new HttpClient(baseUrl));

export default function useRooms() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  const roomsQuery = useQuery(
    ['rooms'],
    async () => await roomApi.getList(),
    { staleTime: Infinity },
  );

  const roomQuery = (id: string) =>
    useQuery(
      ['rooms', id],
      async () => await roomApi.getRoom(id),
      { staleTime: Infinity },
    );

  const createRoom = useMutation(
    (room: RoomCreateInfo) => roomApi.create(room),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['rooms']);
        queryClient.invalidateQueries(['rooms', data.id]);
      },
    },
  );

  const updateRoom = useMutation(
    (updated: { id: string; room: RoomCreateInfo }) =>
      roomApi.update(updated.id, updated.room),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['rooms']);
        queryClient.invalidateQueries(['rooms', data.id]);
      },
    },
  );

  const deleteRoom = useMutation(
    (id: string) => roomApi.remove(id),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['rooms']);
        queryClient.invalidateQueries(['rooms', data]);
      },
    },
  );

  const sendMessage = useMutation(
    (sendInfo: { roomId: string; message: string }) =>
      roomApi.sendChat(sendInfo.roomId, sendInfo.message),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['rooms']);
        queryClient.invalidateQueries(['rooms', data.roomId]);
      },
    },
  );

  useEffect(() => {
    if (user) {
      const eventSource = new EventSource(
        `${baseUrl}/api/room/connect`,
        { withCredentials: true },
      );

      eventSource.onopen = () => {
        console.log('connected');
      };

      ['create', 'update', 'delete', 'send'].forEach((type) =>
        eventSource.addEventListener(type, invalidateQueriesByEvent)
      );

      return () => {
        ['create', 'update', 'delete', 'send'].forEach((type) =>
          eventSource.removeEventListener(type, invalidateQueriesByEvent)
        );
        eventSource.close();
      };
    }
  }, [user, queryClient]);

  const invalidateQueriesByEvent = (event: MessageEvent) => {
    console.log(event.type);
    queryClient.invalidateQueries(['rooms']);
    queryClient.invalidateQueries(['rooms', event.data.id]);
  };

  return {
    roomsQuery,
    roomQuery,
    createRoom,
    updateRoom,
    deleteRoom,
    sendMessage,
  };
}
