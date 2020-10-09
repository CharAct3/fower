import 'react-app-polyfill/ie11'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { View } from '../.'
import { createStyle, Styli } from '@styli/core'
import { flexPropToStyle } from '@styli/core/dist/modifier'

Styli.config({
  covertConfig: [
    {
      key: 'disabledStyle',
      style: {
        color: 'gray'
      },
    },
    {
      key: (prop) => {
        return /test-\d+/.test(prop)
      },
      style: (prop) => {
        const [, value] = prop.match(/test-(\d+)/)
        return { fontSize: value + 'px', color: 'red' }
      },
    }]
})

const App = () => {
  return (
    <div className="box">
      <View
        // s-600
        // borderBlack-10
        // textCenter
        s-600
        textCenter
        bgGray300
        between
        centerY
        disabledStyle
        test-18
      >
        <View s-80 bgBlue400 p-50>
          Box1
        </View>
        <View w-120 h-120 bgGreen400>
          Box2
        </View>
      </View>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))