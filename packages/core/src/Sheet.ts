import hash from 'string-hash'
import { CSSProperties } from 'react'
import { Props, Atom } from './types'
import { kebab } from '@styli/utils'
import { styli } from './styli'
import { getValue } from './utils'

/**
 * Sheet, one Props map to one Sheet
 */
export class Sheet {
  private mediaStyles: string[] = ['', '', '', '', '', '']

  cssPropClassName: string = ''

  /**
   * atom parsed from props
   */
  atoms: Atom[] = []

  constructor(public props: Props) {}

  private storeMedieStyles(atom: Atom, cssKey: string, value: any[]) {
    value.forEach((_, i) => {
      // store responsive styles
      if (value[i + 1]) {
        this.mediaStyles[i] += `.${atom.className} { ${cssKey}: ${value[i + 1]}; }`
      }
    })
  }

  /**
   *  @example #fff -> fff;  50% -> 50p; 1.5 -> 15;
   * @param value
   * @param isArray
   */
  private getClassPostfix(value: any) {
    const valueStr = Array.isArray(value) ? value.join('-') : String(value)
    const str = valueStr.replace(/#/g, '').replace(/\%/g, 'p').replace(/\./g, 'd')
    const isValidClassName = /^[a-zA-Z0-9-]+$/.test(str)
    return isValidClassName ? str : hash(str)
  }

  /**
   * add atom to sheet
   * @param atom
   */
  addAtom(atom: Atom) {
    const { propKey = '' } = atom
    const value = this.props[propKey]

    if (typeof value === 'boolean') {
      atom.className = propKey
    } else {
      const postfix = this.getClassPostfix(value)
      atom.className = `${propKey}-${postfix}`
    }

    this.atoms.push(atom)
  }

  getAtom(propKey: string) {
    return this.atoms.find((i) => i.propKey === propKey)
  }

  removeAtom(propKey: string) {
    const idx = this.atoms.findIndex((i) => i.propKey === propKey)
    if (idx !== -1) {
      this.atoms.splice(idx, 1)
    }
  }

  updateAtom(propKey: string, atom: Atom) {
    const idx = this.atoms.findIndex((i) => i.propKey === propKey)
    if (idx !== -1) {
      this.atoms[idx] = atom
    } else {
      this.atoms.push(atom)
    }
  }

  /**
   * get component classNames
   */
  getClassNames() {
    return this.atoms.map((i) => i.className).join(' ')
  }

  /**
   * get style object
   */
  toStyles() {
    const styliStyles = this.atoms.reduce((result, cur) => {
      if (cur.type !== 'style') return result
      return { ...result, ...cur.style }
    }, {} as CSSProperties)

    /** array style for RN */
    if (Array.isArray(this.props.style)) {
      return [styliStyles, ...this.props.style]
    }

    return { ...styliStyles, ...this.props.style }
  }

  /**
   * get class string
   */
  toCss(): string {
    const css = this.atoms.reduce((result, atom) => {
      const { className = '' } = atom

      // has cache，dont't repeat generate css
      if (styli.cache[className]) return result

      switch (atom.type) {
        case 'prefix':
          return result + parseCSSProp(atom.style, className).join(' ')
        case 'no-prefix':
          return result + parseCSSProp(atom.style).join(' ')
      }

      /** to css atom string */
      const cssAtomStr = Object.keys(atom.style).reduce((r, k) => {
        const value: any = (atom as any).style[k]
        const cssKey = kebab(k)

        if (!Array.isArray(value)) return r + `${cssKey}: ${value};`

        //responsive style, TODO: 这里有不纯
        this.storeMedieStyles(atom, cssKey, value)

        return r + `${cssKey}: ${value[0]};`
      }, '')

      if (!cssAtomStr) return result

      // wrap with css className
      return result + `.${className} { ${cssAtomStr} }`
    }, '')

    const responsiveCss = styli
      .getTheme('breakpoints')
      .reduce((result: string, b: string, i: number) => {
        return result + `@media (min-width: ${b}) { ${this.mediaStyles[i]} }`
      }, '')

    return css + responsiveCss
  }
}

function getPaths(object: any): any {
  return (
    object &&
    typeof object === 'object' &&
    Object.keys(object).reduce(
      (p, k) => (getPaths(object[k]) || [[]]).reduce((r: any, a: any) => [...r, [k, ...a]], p),
      [],
    )
  )
}

/**
 * parse css props
 * // TODO: 太乱，需要重构
 * @param cssObj
 * @param className
 */
function parseCSSProp(cssObj: any, className = '') {
  const getPrefix = (v: string) => (/^::?.*/.test(v) ? '' : ' ')

  const paths = getPaths(cssObj)

  const cssPropFragmentList: string[] = paths
    .reduce((result: any, path: string[]) => {
      const attrValue = path.reduce((obj: any, c: string) => obj[c], cssObj)

      const attr = kebab('' + path.pop())

      // pseudo-class pseudo-element connect selector string directly
      const str = path.reduce((result, value) => `${result}${getPrefix(value)}${value}`, '')

      const obj = {
        key: `${className ? '.' + className : ''}${getPrefix(str)}${str}`,
        value: { [attr]: getValue(attrValue) },
      }

      // merge same class
      const idx = result.findIndex((a: any) => a.key === obj.key)
      if (idx === -1) {
        result = result.concat(obj)
      } else {
        const { key, value } = result[idx]
        result[idx] = { key, value: { ...obj.value, ...value } }
      }
      return result
    }, [])
    .map(({ key, value }: any) => {
      let str = ''
      for (let i in value) {
        str = `${str}${[i]}: ${value[i]};`
      }
      return `${key}{${str}}`
    })
  return cssPropFragmentList
}
