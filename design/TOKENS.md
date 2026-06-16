# Дизайн-токени Tasteorama

Витягнуто з Figma-макета. Усі токени вже в `app/globals.css` як CSS-змінні +
типографічні утиліти. **Не хардкодь кольори/розміри — використовуй змінні.**

## Шрифт

**Montserrat** (підключений через `next/font` у `app/layout.tsx`, змінна
`--font-montserrat`, weights 400/500/600/700). Базовий `font-family` — у `body`.

## Кольори (CSS-змінні)

| Змінна | Значення | Призначення |
|---|---|---|
| `--color-cream` | `#faf3e0` | фон hero/секцій (`--color-bg-accent`) |
| `--color-brown` | `#9b6c43` | акцент: кнопки, активні стани (`--color-accent`) |
| `--color-brown-dark` | `#3d2218` | заголовки (`--color-text`) |
| `--color-black` | `#000000` | основний текст (`--color-text-body`) |
| `--color-gray` | `#595d62` | приглушений текст (`--color-text-muted`) |
| `--color-gray-light` | `#9f9f9f` | плейсхолдери (`--color-text-placeholder`) |
| `--color-border` | `#d9d9d9` | рамки, роздільники |
| `--color-surface` | `#fbfcf8` | картки/поверхні |
| `--color-white` | `#ffffff` | базовий фон (`--color-bg`) |
| `--color-error` | `#c80000` | помилки валідації |

## Типографіка (утиліти-класи в globals.css)

| Клас | Стиль |
|---|---|
| `.display-xl` | 600 · 48/53 |
| `.display-lg` | 600 · 40/49 |
| `.display-md` | 600 · 32/39 |
| `.display-sm` | 600 · 24/29 |
| `.body-lg` | 400 · 18/22 |
| `.body-md` | 400 · 16/25 (базовий) |
| `.body-sm` | 400 · 12/15 |

Для SemiBold/Bold варіантів — `font-weight: 600/700` поверх потрібного розміру.

## Радіуси та тіні

| Змінна | Значення | Де |
|---|---|---|
| `--radius-xs` | 4px | дрібні елементи |
| `--radius-sm` | 8px | кнопки, інпути (база) |
| `--radius-lg` | 16px | картки |
| `--radius-pill` | 32px | пілюлі/чіпи |
| `--shadow-lg` | `0 8px 24px rgba(0,0,0,.16)` | картки/модалки |
| `--focus-ring` | `0 0 0 4px rgba(78,70,180,.2)` | focus-стан |

## Приклад

```css
.button {
  background: var(--color-accent);
  color: var(--color-white);
  border-radius: var(--radius-sm);
  padding: 12px 24px;
}
.card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}
```
