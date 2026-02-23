import { beforeEach, describe, expect, it } from 'vitest'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { SplitterPanel } from '..'
import { resetWarned } from '../../_util/warning'
import Splitter from '../index'

describe('splitter.SSR', () => {
  beforeEach(() => {
    resetWarned()
    document.body.innerHTML = ''
  })

  it('px value', async () => {
    const str = await renderToString(createSSRApp(() => (
      <Splitter>
        <SplitterPanel defaultSize={23} />
        <SplitterPanel />
      </Splitter>
    )))

    const div = document.createElement('div')
    div.innerHTML = str
    document.body.appendChild(div)

    expect(div.querySelectorAll('.ant-splitter-panel')[0]).toHaveStyle({
      flexBasis: '23px',
      flexGrow: '0',
    })
    expect(div.querySelectorAll('.ant-splitter-panel')[1]).toHaveStyle({
      flexBasis: 'auto',
      flexGrow: '1',
    })
  })

  it('ptg value', async () => {
    const str = await renderToString(createSSRApp(() => (
      <Splitter>
        <SplitterPanel defaultSize="33%" />
        <SplitterPanel />
      </Splitter>
    )))

    const div = document.createElement('div')
    div.innerHTML = str
    document.body.appendChild(div)

    expect(div.querySelectorAll('.ant-splitter-panel')[0]).toHaveStyle({
      flexBasis: '33%',
      flexGrow: '0',
    })
    expect(div.querySelectorAll('.ant-splitter-panel')[1]).toHaveStyle({
      flexBasis: 'auto',
      flexGrow: '1',
    })
  })
})
