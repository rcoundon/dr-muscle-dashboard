import codes from '../codes/bodyPartId.json';

export function getBodyPartName(id) {
  if (!id) return 'Unknown';
  return codes[id];
}
