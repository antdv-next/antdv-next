import hash from '@emotion/hash'

// // @ts-expect-error this is a valid package
// import unitless from '@emotion/unitless'

export default (src: string) => (hash as any).default && (typeof (hash as any).default === 'function') ? (hash as any).default(src) : hash(src)
