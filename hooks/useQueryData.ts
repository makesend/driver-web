import type { UseQueryOptions } from 'react-query';
import type {
  MSApiResponse,
  Parcel,
  ParcelToSort,
  PickupTask,
  DropoffTask,
  ParcelByTrackingId,
} from 'types';
import axios from 'axios';
import { useQuery } from 'react-query';
import { rounds } from 'utils/constants/delivery';

const retry = 2;
const staleTime = 5 * 60 * 1000; // 5 mins
const config = {
  retry,
  staleTime,
  refetchInterval: staleTime,
  cacheTime: staleTime,
  refetchOnWindowFocus: true,
};

export const useGetSortingList = (
  customConfig?: Omit<
    UseQueryOptions<
      ParcelToSort[] | undefined,
      unknown,
      ParcelToSort[] | undefined,
      string[]
    >,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery(
    ['sortinglist'],
    async () => {
      const {
        data: { data: parcels },
      } = await axios.get<MSApiResponse<ParcelToSort[]>>('/api/sortinglist');

      return parcels;
    },
    { ...config, ...customConfig }
  );
};

export const useGetParcelsByOrderId = (
  orderId: string,
  customConfig?: Omit<
    UseQueryOptions<
      Parcel[] | undefined,
      unknown,
      Parcel[] | undefined,
      string[]
    >,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery(
    ['parcelsByOrderId', orderId],
    async () => {
      const {
        data: { data: parcels },
      } = await axios.get<MSApiResponse<Parcel[]>>(
        `/api/parcel/orderid/${orderId}`
      );

      return parcels;
    },
    {
      ...config,
      ...customConfig,
    }
  );
};

export const useGetPickupTasks = (
  driverId?: string,
  customConfig?: Omit<
    UseQueryOptions<
      PickupTask[] | undefined,
      unknown,
      PickupTask[] | undefined,
      (string | undefined)[]
    >,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery(
    ['pickupTasks', driverId],
    async () => {
      const {
        data: { data: rawPickupTasks },
      } = await axios.post<MSApiResponse<PickupTask[]>>('/api/tasks/pickup', {
        driverId,
      });

      if (!rawPickupTasks) {
        return [];
      }

      const pickupTasks =
        rawPickupTasks.filter((task) =>
          rounds.some((round) => round === +task.round)
        ) ?? [];

      if (driverId) {
        return pickupTasks.filter((task) => task.driver_id === driverId);
      }

      console.warn("no driverId is given to 'useGetPickupTasks'");
      return pickupTasks;
    },
    { ...config, ...customConfig }
  );
};

export const useGetDropoffTasks = (
  driverId: string,
  customConfig?: Omit<
    UseQueryOptions<
      DropoffTask[] | undefined,
      unknown,
      DropoffTask[] | undefined,
      string[]
    >,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery(
    ['dropoffTasks', driverId],
    async () => {
      const {
        data: { data: dropoffTasks },
      } = await axios.get<MSApiResponse<DropoffTask[]>>(
        `/api/tasks/dropoff/${driverId}`
      );

      return dropoffTasks;
    },
    { ...config, ...customConfig }
  );
};

export const useGetParcelsByTrackingId = (
  trackingId: string,
  customConfig?: Omit<
    UseQueryOptions<
      ParcelByTrackingId | undefined,
      unknown,
      ParcelByTrackingId | undefined,
      string[]
    >,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery(
    ['parcel', trackingId],
    async () => {
      const {
        data: { data: parcels },
      } = await axios.get<MSApiResponse<ParcelByTrackingId[]>>(
        `/api/parcel/trackingid/${trackingId}`
      );

      if (Array.isArray(parcels)) {
        return parcels[0];
      }

      return;
    },
    { ...config, ...customConfig }
  );
};

export const queries = {
  useGetSortingList,
  useGetParcelsByOrderId,
  useGetPickupTasks,
  useGetDropoffTasks,
};

export default queries;
