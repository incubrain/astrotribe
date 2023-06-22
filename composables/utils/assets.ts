export function dynamicAsset(path: string): string {
  const assets = import.meta.glob('~/assets/images/**/*', {
    eager: true,
    import: 'default'
  })
  return assets['/assets/images/' + path]
}
