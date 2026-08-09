import type { Handle } from 'remix/ui'

export function Figure(handle: Handle<{ src?: string; alt?: string; caption?: string }>) {
  return () => {
    let { src, alt = '', caption } = handle.props

    return (
      <figure>
        <img src={src} alt={alt} />
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    )
  }
}
