# Thumbnails de Vídeos TikTok

## Arquitetura

O sistema obtém thumbnails reais dos vídeos do TikTok através da **oEmbed API** oficial, garantindo imagens sempre atualizadas e de alta qualidade.

### Fluxo de Dados

```
XLSX (Kalodata)     →     API Route     →     Frontend
thumbnailUrl: null       oEmbed fetch       exibe thumbnail
                         ↓
                    TikTok oEmbed API
                    (thumbnail_url)
```

## Implementação

### 1. XLSX Parser (`lib/kalodata/xlsx-parser.ts`)

O parser **sempre retorna `thumbnailUrl: null`**. Não usamos placeholders ou URLs mockadas.

```typescript
// thumbnailUrl: set by API route via oEmbed; parser always returns null
thumbnailUrl: null,
```

### 2. API Route (`app/api/kalodata/videos/route.ts`)

A rota de API **enriquece** os vídeos com thumbnails reais:

```typescript
async function enrichVideo(video: VideoDTO): Promise<VideoDTO> {
  // 1. Resolve URLs curtas (vm.tiktok.com → tiktok.com/@user/video/...)
  if (rawUrl && isShortTikTokUrl(rawUrl)) {
    resolvedUrl = await resolveShortTikTokUrl(rawUrl, 8000);
  }

  // 2. Normaliza para URL canônica
  const canonical = normalizeTikTokUrlToCanonical({...});

  // 3. Busca thumbnail via oEmbed
  const oembed = await fetchTikTokOEmbed(oEmbedUrl, 8000);
  thumbnailUrl = oembed?.thumbnail_url ?? null;

  return { ...video, thumbnailUrl };
}
```

### 3. TikTok oEmbed (`lib/kalodata/tiktok.ts`)

```typescript
export async function fetchTikTokOEmbed(
  videoUrl: string,
  timeoutMs = 8000,
): Promise<{ thumbnail_url: string; title?: string } | null> {
  const oEmbedEndpoint = `https://www.tiktok.com/oembed?url=${encodeURIComponent(videoUrl)}`;

  const res = await fetch(oEmbedEndpoint, {
    next: { revalidate: 86400 }, // cache 24h
  });

  const data = await res.json();
  return { thumbnail_url: data.thumbnail_url };
}
```

### 4. VideoCard (`app/components/dashboard/VideoCard.tsx`)

O componente exibe a thumbnail real ou um placeholder visual (padrão de pontos):

```tsx
const hasThumbnail = !!video?.thumbnailUrl;

{
  /* Real thumbnail image (from oEmbed) */
}
{
  hasThumbnail && (
    <Image
      src={video.thumbnailUrl!}
      alt={video.title}
      fill
      className="object-cover"
    />
  );
}

{
  /* Dot pattern placeholder (visible when no thumbnail) */
}
{
  !hasThumbnail && <Box className="dot-pattern-placeholder" />;
}
```

## Performance

| Otimização       | Implementação                                                        |
| ---------------- | -------------------------------------------------------------------- |
| **Concorrência** | `withConcurrency(videos, 3, enrichVideo)` - máx 3 chamadas paralelas |
| **Timeout**      | 8s por requisição oEmbed                                             |
| **Cache**        | Next.js `revalidate: 86400` (24h)                                    |
| **Fallback**     | Placeholder visual quando thumbnail indisponível                     |

## Por que não usar placeholders estáticos?

1. **Qualidade**: Thumbnails reais são mais atraentes e informativos
2. **Precisão**: Imagem correta do vídeo, não genérica
3. **Cache**: oEmbed cacheia por 24h, então não há overhead significativo
4. **Confiabilidade**: API oficial do TikTok, sempre disponível

## Endpoints TikTok Utilizados

| Endpoint                                | Uso                         |
| --------------------------------------- | --------------------------- |
| `https://www.tiktok.com/oembed?url=...` | Obter thumbnail e metadados |
| HEAD request em `vm.tiktok.com/*`       | Resolver URLs curtas        |

## Exemplo de Resposta oEmbed

```json
{
  "version": "1.0",
  "type": "video",
  "title": "E foi aí que caiu a ficha...",
  "author_url": "https://www.tiktok.com/@alesilva0520",
  "author_name": "alesilva0520",
  "thumbnail_url": "https://p16-sign-sg.tiktokcdn.com/...",
  "thumbnail_width": 576,
  "thumbnail_height": 1024
}
```
