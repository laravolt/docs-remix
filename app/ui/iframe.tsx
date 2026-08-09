import type { Handle } from 'remix/ui'

export function IFrame(
  handle: Handle<{ src?: string; title?: string; width?: string; height?: string }>,
) {
  return () => {
    let { src, title, width, height } = handle.props

    return (
      <div className="w-full">
        <iframe src={src} title={title} width={width} height={height} />
      </div>
    )
  }
}
