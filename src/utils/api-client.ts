// src/utils/api-client.ts

type RequestConfig = RequestInit & {
  data?: any; // Permite pasar un objeto JS directo, nosotros lo convertimos a JSON
};

export async function apiCall<T>(
  endpoint: string,
  { data, headers: customHeaders, ...customConfig }: RequestConfig = {}
): Promise<T> {
  const config: RequestConfig = {
    method: data ? "POST" : "GET",
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      "Content-Type": "application/json",
      ...customHeaders,
    },
    ...customConfig,
  };

  try {
    const response = await fetch(endpoint, config);

    // Intentamos parsear el JSON, si falla (ej: 500 error server), manejamos texto
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.error || "Ocurrió un error desconocido");
    }

    return result as T;
  } catch (error: any) {
    console.error(`Error en apiCall a ${endpoint}:`, error);
    throw error; // Re-lanzamos para que el componente muestre la alerta
  }
}
