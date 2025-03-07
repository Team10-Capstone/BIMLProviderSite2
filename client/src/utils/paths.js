export function getPath(path) {
  const basePath = process.env.NODE_ENV === 'production' ? '/bimlfrontend' : '';
  return `${basePath}${path}`;
}