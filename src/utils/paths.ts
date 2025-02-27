export function getPath(path: string) {
  const basePath = process.env.NODE_ENV === 'production' ? '/bimlfrontend' : '';
  return `${basePath}${path}`;
}