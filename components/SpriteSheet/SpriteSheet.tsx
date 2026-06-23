import { readFile } from 'node:fs/promises';
import path from 'node:path';

/*
 * Inlines the icon sprite into the document once (hidden), so components can
 * reference symbols with same-document `<use href="#icon-…">`. This is required
 * for `currentColor` (fill/stroke) to theme the icons: an external
 * `<use href="sprite.svg#…">` does NOT cross the document boundary in Chromium,
 * which renders the (uncoloured) icons black/invisible.
 */
export default async function SpriteSheet() {
  const svg = await readFile(
    path.join(process.cwd(), 'public/icons/sprite.svg'),
    'utf8'
  );
  return (
    <div hidden aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />
  );
}
