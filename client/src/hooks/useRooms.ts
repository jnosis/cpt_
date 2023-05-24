import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import type { RoomCreateInfo } from '~/types';
import RoomApi from '~/api/room';
import { useAuthContext } from '~/contexts/AuthContext';
import HttpClient from '~/networks/http';

const baseUrl = import.meta.env.VITE_SERVER_URL;

const roomApi = new RoomApi(new HttpClient(baseUrl));

export default function useRooms() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

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
        invalidateQueries(data.id);
      },
    },
  );

  const updateRoom = useMutation(
    (updated: { id: string; room: RoomCreateInfo }) =>
      roomApi.update(updated.id, updated.room),
    {
      onSuccess: (data) => {
        invalidateQueries(data.id);
      },
    },
  );

  const deleteRoom = useMutation(
    (id: string) => roomApi.remove(id),
    {
      onSuccess: (data) => {
        removeQueries(data);
      },
    },
  );

  const sendMessage = useMutation(
    (sendInfo: { roomId: string; message: string }) =>
      roomApi.sendChat(sendInfo.roomId, sendInfo.message),
    {
      onSuccess: (data) => {
        invalidateQueries(data.roomId);
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

      const eventListener = (event: MessageEvent) => {
        console.log(event.type);
        const id = event.data;
        if (event.type === 'delete') {
          removeQueries(id);
          if (location.pathname.includes(id)) navigate('/', { replace: true });
        } else {
          invalidateQueries(id);
        }
      };

      ['create', 'update', 'delete', 'send'].forEach((type) =>
        eventSource.addEventListener(type, eventListener)
      );

      return () => {
        ['create', 'update', 'delete', 'send'].forEach((type) =>
          eventSource.removeEventListener(type, eventListener)
        );
        eventSource.close();
      };
    }
  }, [user, queryClient, location]);

  const invalidateQueries = (id: string) => {
    queryClient.invalidateQueries(['rooms']);
    queryClient.invalidateQueries(['rooms', id]);
  };

  const removeQueries = (id: string) => {
    queryClient.invalidateQueries(['rooms']);
    queryClient.removeQueries(['rooms', id]);
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
