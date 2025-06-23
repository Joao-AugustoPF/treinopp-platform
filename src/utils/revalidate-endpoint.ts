export const revalidateEndpoint = (endpoint: string) => (key: string | string[]) =>
  Array.isArray(key) && key[0] === endpoint;
