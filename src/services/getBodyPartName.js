import codes from '../codes/bodyPartId.json';

export default function getBodyPartName(id) {
  if (!id) return 'Unknown';
  return codes[id];
}
