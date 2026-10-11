const techBlogList: Record<string, string> = {
  美团: 'https://tech.meituan.com/',
  有赞技术: 'https://tech.youzan.com/',
  Thoughtworks洞见: 'https://insights.thoughtworks.cn/',
}

const personBlogList: Record<string, string> = {
  'C++ 全栈知识体系': 'https://stibel.icu/',
  'Java 全栈知识体系': 'https://www.pdai.tech/',
  酷壳: 'https://www.coolshell.cn/',
}

function BlogSection({
  title,
  list,
}: {
  title: string
  list: Record<string, string>
}) {
  return (
    <div className="space-y-1">
      <div className="text-white/70">{title}</div>
      {Object.entries(list).map(([name, url]) => (
        <div key={name} className="grid grid-cols-[160px_1fr] gap-3">
          <span>{name}</span>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="text-sky-300 underline underline-offset-2"
          >
            {url}
          </a>
        </div>
      ))}
    </div>
  )
}

export function BlogBox() {
  return (
    <div className="my-2 space-y-4 text-white">
      <div>博客列表：</div>
      <BlogSection title="公司技术博客：" list={techBlogList} />
      <BlogSection title="个人技术博客：" list={personBlogList} />
    </div>
  )
}
