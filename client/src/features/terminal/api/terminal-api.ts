type TerminalApiResult<T = unknown> = {
  code: number
  data?: T
  message?: string
  description?: string
}

async function postTerminalApi<T>(
  path: string,
  body: Record<string, unknown>,
): Promise<TerminalApiResult<T>> {
  try {
    const response = await fetch(`/api/terminal${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return (await response.json()) as TerminalApiResult<T>
  } catch (error) {
    return {
      code: -1,
      message: '请求失败',
      description: error instanceof Error ? error.message : String(error),
    }
  }
}

export async function getCurrentWeather(city: string) {
  if (!city) return null
  return postTerminalApi<string>('/weather/now', { city })
}

export async function getFutureWeather(city: string, days: string) {
  if (!city) return null
  return postTerminalApi<string>('/weather/future', { city, days })
}

export async function translate(
  keywords: string,
  config: Record<string, string>,
) {
  if (!keywords) return null
  return postTerminalApi<string>('/fanyi/translate', { keywords, config })
}

export async function getSingleMusic(keywords: string) {
  if (!keywords) return null
  return postTerminalApi<{ id: number; name: string }>('/music/get', {
    keywords,
  })
}

export async function listHotMusics() {
  return postTerminalApi<
    Array<{ id: number; al: { name: string; picUrl: string } }>
  >('/music/list/hot', {})
}

export async function getRandomBackground(lx: string) {
  return postTerminalApi<string>('/background/get/random', { lx })
}
