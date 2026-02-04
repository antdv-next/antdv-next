import type { Plugin } from 'vite'

interface PrefetchConfig {
  concurrency?: number
}

function prefetch(config: PrefetchConfig = { concurrency: 2 }): Plugin {
  const snippet = `
<!-- Cloudflare Web Analytics -->
<script
  defer
  src="https://static.cloudflareinsights.com/beacon.min.js"
  data-cf-beacon='{"token": "6b0750c8a044412cb1993ad5c4524a61"}'>
</script>
<!-- End Cloudflare Web Analytics -->
`

  return {
    name: 'vite-plugin-prefetch',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      const dynamicImports: { js: string[], css: string[] } = {
        js: [],
        css: [],
      }
      let htmlAsset: any

      // 1. Collect dynamic imports and find index.html
      for (const fileName in bundle) {
        const chunk = bundle[fileName]

        if (chunk.type === 'chunk' && chunk.isDynamicEntry) {
          const jsFile = chunk.fileName?.startsWith('/') ? chunk.fileName : `/${chunk.fileName}`
          dynamicImports.js.push(jsFile)
          // Check for imported CSS by this chunk
          if (chunk.viteMetadata?.importedCss) {
            chunk.viteMetadata.importedCss.forEach((css) => {
              const cssFile = css.startsWith('/') ? css : `/${css}`
              dynamicImports.css.push(cssFile)
            })
          }
        }

        if (chunk.type === 'asset' && chunk.fileName === 'index.html') {
          htmlAsset = chunk
        }
      }

      if (!htmlAsset || (dynamicImports.js.length === 0 && dynamicImports.css.length === 0)) {
        return
      }

      // 2. Generate the runtime script content
      const resourcesBytes = JSON.stringify(dynamicImports)
      // Minified-ish runtime code
      const code = `
(function() {
  // check in iframe
  if (self !== top) return;
  const resources = ${resourcesBytes};
  const concurrency = ${config.concurrency || 2};
  const queue = [...resources.js.map(url => ({ url, type: 'script' })), ...resources.css.map(url => ({ url, type: 'style' }))];
  let active = 0;
  
  function load(item) {
    return new Promise((resolve) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = item.url;
      link.as = item.type;
      link.onload = link.onerror = resolve;
      document.head.appendChild(link);
    });
  }

  function next() {
    while (active < concurrency && queue.length > 0) {
      const item = queue.shift();
      active++;
      load(item).then(() => {
        active--;
        next();
      });
    }
  }

  const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
  
  if (document.readyState === 'complete') {
    idleCallback(next);
  } else {
    window.addEventListener('load', () => {
      idleCallback(next);
    });
  }
})();
`
      // 3. Emit the file
      const fileName = 'assets/prefetch.js'
      this.emitFile({
        type: 'asset',
        fileName,
        source: code,
      })

      // 4. Inject script tag with timestamp
      if (typeof htmlAsset.source === 'string') {
        const scriptTag = `<script src="/${fileName}?v=${Date.now()}"></script>`
        htmlAsset.source = htmlAsset.source.replace('</body>', `${scriptTag}</body>`)
      }
    },
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        // 防止重复注入（多入口 / 多次构建）
        if (html.includes('cloudflareinsights.com/beacon.min.js')) {
          return html
        }

        // 注入到 </head> 前（也可以放到 </body> 前）
        return html.replace(
          '</head>',
          `${snippet}\n</head>`,
        )
      },
    },
  }
}

export default prefetch
