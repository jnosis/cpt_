import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { RoomCreateInfo } from '~/types';
import RoomApi from '~/api/room';
import HttpClient from '~/networks/http';

const roomApi = new RoomApi(new HttpClient(import.meta.env.VITE_SERVER_URL));

export default function useRooms() {
  const queryClient = useQueryClient();

  const roomsQuery = useQuery(
    ['rooms'],
    async () => await roomApi.getList(),
    { staleTime: 1000 * 60 },
  );

  const roomQuery = (id: string) =>
    useQuery(
      ['rooms', id],
      async () => await roomApi.getRoom(id),
      { staleTime: 1000 * 60 },
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

  return {
    roomsQuery,
    roomQuery,
    createRoom,
    updateRoom,
    deleteRoom,
    sendMessage,
  };
}
