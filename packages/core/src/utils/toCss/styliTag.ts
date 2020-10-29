import { memorize } from '../../utils'

export function generateStyleElement(name: string) {
  const $style = document.createElement('style')
  $style.dataset.styli = name

  // TODO: if user can config mounted tag
  const mountedTag = document.querySelector('head')

  if (!mountedTag) throw new Error('can not find <head> tag to mounted')

  mountedTag.append($style)

  return $style
}

export const getStyleElement = memorize(generateStyleElement)

export const getStyliElementContent = (tag: any) => tag.innerHTML

export const setStyliElementContent = memorize((tag: any, content: string) => {
  tag.innerHTML = content
  return true
})

export const getMediaStyliElement = memorize((value: number) => {
  const tag = generateStyleElement(`media-styli-${value}`)
  tag.innerHTML = `@media (min-width: ${value}px}) {}`
  return tag
})

export function getMediaElementContent(tag: any) {
  const content = tag.innerHTML
  const [, match = ''] = content.match(/{(.*)}/) || []
  return match
}

export const setMediaElementContent = memorize((tag: any, breakpoint: number, content: string) => {
  tag.innerHTML = `@media (min-width: ${breakpoint}px) {${content}}`
  return true
})
