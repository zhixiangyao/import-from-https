import { get } from 'https'

/**
 *
 * @param {string} specifier
 * @param {{conditions: string[],importAssertions: object, parentURL: string}} context
 * @param {AsyncFunction} defaultResolve
 * @returns
 */
export function resolve(specifier, context, defaultResolve) {
  const { parentURL = null } = context

  if (specifier.startsWith('https://')) {
    return {
      url: specifier,
    }
  } else if (parentURL && parentURL.startsWith('https://')) {
    return {
      url: new URL(specifier, parentURL).href,
    }
  }

  return defaultResolve(specifier, context, defaultResolve)
}

/**
 *
 * @param {string} url
 * @param {{ format: 'module' | undefined , importAssertions: object}} context
 * @param {AsyncFunction} defaultLoad
 * @returns
 */
export function load(url, context, defaultLoad) {
  if (url.startsWith('https://')) {
    return new Promise((resolve, reject) => {
      get(url, res => {
        let data = ''
        res.on('data', chunk => (data += chunk))
        res.on('end', () =>
          resolve({
            format: 'module',
            source: data,
          })
        )
      }).on('error', err => reject(err))
    })
  }

  return defaultLoad(url, context, defaultLoad)
}
