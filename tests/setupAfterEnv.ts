import format, { plugins } from 'pretty-format'

import { expect } from 'vitest'
import '@testing-library/jest-dom/vitest'

function cleanup(node: HTMLElement) {
  const childList = Array.from(node.childNodes)
  node.innerHTML = ''
  childList.forEach((child) => {
    if (!(child instanceof Text)) {
      node.appendChild(cleanup(child as any))
    }
    else if (child.textContent) {
      node.appendChild(child)
    }
  })
  return node
}

function formatHTML(nodes: any) {
  let cloneNodes: any
  if (Array.isArray(nodes) || nodes instanceof HTMLCollection || nodes instanceof NodeList) {
    cloneNodes = Array.from(nodes).map(node => cleanup(node.cloneNode(true) as any))
  }
  else {
    cloneNodes = cleanup(nodes.cloneNode(true))
  }

  const htmlContent = format(cloneNodes, {
    plugins: [plugins.DOMCollection, plugins.DOMElement],
  })

  const filtered = htmlContent
    .split('\n')
    .filter(line => line.trim())
    .join('\n')

  return filtered
}

/**
 * Custom snapshot serializer for HTML elements.
 * Produces consistent snapshot output by cleaning up empty text nodes.
 */
expect.addSnapshotSerializer({
  test: element =>
    typeof HTMLElement !== 'undefined'
    && (element instanceof HTMLElement
      || element instanceof DocumentFragment
      || element instanceof HTMLCollection
      || (Array.isArray(element) && element[0] instanceof HTMLElement)),
  print: element => formatHTML(element),
})
