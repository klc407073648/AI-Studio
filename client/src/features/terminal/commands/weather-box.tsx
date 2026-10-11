type LiveWeather = {
  province?: string
  city?: string
  weather?: string
  temperature?: string
  winddirection?: string
  windpower?: string
  humidity?: string
  reporttime?: string
  casts?: never
}

type ForecastWeather = {
  province?: string
  city?: string
  casts: Array<{
    date: string
    week: string
    dayweather: string
    nightweather: string
    daytemp_float: string
    nighttemp_float: string
  }>
}

type WeatherInfo = LiveWeather | ForecastWeather

function getDay(num: string) {
  const map: Record<string, string> = {
    '1': '星期一',
    '2': '星期二',
    '3': '星期三',
    '4': '星期四',
    '5': '星期五',
    '6': '星期六',
    '7': '星期日',
  }
  return map[num] ?? ''
}

export function WeatherBox({ weatherInfo }: { weatherInfo: WeatherInfo[] }) {
  const curInfo = weatherInfo[0]
  if (!curInfo) {
    return <div className="text-white/70">暂无天气数据</div>
  }

  if ('casts' in curInfo && curInfo.casts) {
    return (
      <div className="my-2 space-y-3 text-white">
        <div>
          {curInfo.province}:{curInfo.city}
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {curInfo.casts.map((cast) => (
            <div
              key={cast.date}
              className="rounded border border-white/20 bg-black/30 p-3"
            >
              <div className="mb-2 font-medium">
                {cast.date} {getDay(cast.week)}
              </div>
              <div>白天天气: {cast.dayweather}</div>
              <div>夜间天气: {cast.nightweather}</div>
              <div>白天温度: {cast.daytemp_float}</div>
              <div>夜间温度: {cast.nighttemp_float}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="my-2 space-y-1 text-white">
      <div>
        {curInfo.province}:{curInfo.city}
      </div>
      <div>天气: {curInfo.weather}</div>
      <div>当前气温: {curInfo.temperature}</div>
      <div>风向: {curInfo.winddirection}</div>
      <div>风力等级: {curInfo.windpower}</div>
      <div>空气湿度: {curInfo.humidity}%</div>
      <div>更新时间: {curInfo.reporttime}</div>
    </div>
  )
}
