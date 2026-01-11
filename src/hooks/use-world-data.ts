import useSWR from "swr";
import { apiCall } from "@/utils/api-client";
// 👇 CAMBIO 1: Importamos 'World' (nuestra interfaz personalizada), no 'WorldWithMembers'
import { World, UIEnchantment } from "@/types";

interface WorldDataResponse {
  // 👇 CAMBIO 2: Usamos 'World' aquí también
  world: World | null;
  enchantments: UIEnchantment[];
  isLoading: boolean;
  isError: any;
  mutate: () => Promise<any>;
}

const fetcher = (url: string) => apiCall<any>(url);

export function useWorldData(worldId: string | undefined): WorldDataResponse {
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
