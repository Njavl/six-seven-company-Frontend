import { readFile } from 'node:fs/promises';
import path from 'node:path';

export default async function SpriteSheet() {
  let svg = '';
  try {
    svg = await readFile(
      path.join(process.cwd(), 'public/icons/sprite.svg'),
      'utf8'
    );
  } catch {
    return null;
  }
  return (
    <div hidden aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />
  );
}
