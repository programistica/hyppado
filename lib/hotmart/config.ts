/**
 * lib/hotmart/config.ts
 * Centraliza as variáveis de ambiente da Hotmart e valida na inicialização.
 * Lança erro claro se alguma estiver faltando para evitar falhas silenciosas.
 */

function requireEnv(key: string): string {
  const value = process.env[key]?.trim();
  if (!value) {
    throw new Error(
      `[Hotmart] Variável de ambiente obrigatória ausente: ${key}. ` +
        `Verifique seu .env ou as configurações do projeto.`,
    );
  }
  return value;
}

export function getHotmartConfig() {
  return {
    clientId: requireEnv("HOTMART_CLIENTE_ID"),
    clientSecret: requireEnv("HOTMART_CLIENT_SECRET"),
    // Base64 de "client_id:client_secret" — usado no header Authorization do OAuth
    basicToken: requireEnv("HOTMART_BASIC"),

    // Hotmart OAuth token endpoint
    tokenUrl: "https://api-sec-vlc.hotmart.com/security/oauth/token",

    // Base URL da Hotmart REST API v2
    apiBaseUrl: "https://api-worker.hotmart.com",

    // Quanto antes do vencimento do token renovar (em ms). Padrão: 60s.
    tokenRefreshBuffer: 60_000,
  } as const;
}

export type HotmartConfig = ReturnType<typeof getHotmartConfig>;
