export function InfoBox() {
  return (
    <div className="space-y-1 text-white">
      <div>关于本站：cmdTerminal 极客范儿的浏览器主页（React 移植版）</div>
      <div>
        <a
          href="https://github.com/klc407073648/cmd-terminal"
          target="_blank"
          rel="noreferrer"
          className="text-sky-300 underline underline-offset-2"
        >
          代码开源，欢迎 star 和贡献~
        </a>
      </div>
      <div>
        已融入 Admin Console · 阶段 2：终端命令集
      </div>
    </div>
  )
}
