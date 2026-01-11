import useSWR from "swr";
import { apiCall } from "@/utils/api-client";
import { WorldWithMembers, UIEnchantment } from "@/types";

interface WorldDataResponse {
  world: WorldWithMembers | null;
  enchantments: UIEnchantment[];
  isLoading: boolean;
  isError: any;
  mutate: () => Promise<any>;
}

const fetcher = (url: string) => apiCall<any>(url);

export function useWorldData(worldId: string | undefined): WorldDataResponse {
  // CORRECCIÓN AQUÍ: Agregamos "/items" al final de la URL 👇
  const { data, error, isLoading, mutate } = useSWR(
    worldId ? `/api/world/${worldId}/items` : null,
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 5000,
    }
  );

  return {
    world: data?.world || null,
    enchantments: data?.enchantments || [],
    isLoading,
    isError: error,
    mutate,
  };
}
