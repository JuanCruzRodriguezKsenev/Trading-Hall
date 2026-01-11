import useSWR from "swr";
import { apiCall } from "@/utils/api-client";
// Importamos nuestros tipos personalizados para evitar errores de TS con 'ownerName'
import { World, UIEnchantment } from "@/types";

interface WorldDataResponse {
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
      // --- ESTRATEGIA DE TIEMPO REAL EFICIENTE ---

      // 1. Sondeo cada 5 segundos:
      // Suficiente para ver cambios de amigos sin bombardear la base de datos.
      refreshInterval: 5000,

      // 2. Ahorro de recursos:
      // Si el usuario minimiza la ventana o cambia de pestaña, DEJA de pedir datos.
      // Esto protege tu cuota gratuita de Neon/Vercel.
      refreshWhenHidden: false,
      refreshWhenOffline: false,

      // 3. Reactividad instantánea:
      // Apenas el usuario vuelve a mirar la pestaña, actualiza los datos inmediatamente.
      revalidateOnFocus: true,
      revalidateOnReconnect: true,

      // Evita peticiones duplicadas muy seguidas
      dedupingInterval: 4000,
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
