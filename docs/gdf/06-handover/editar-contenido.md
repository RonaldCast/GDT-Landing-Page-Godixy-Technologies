# Editar contenido EN / ES

Los textos del sitio **no se editan en la página**. Viven en dos diccionarios TypeScript. No hay CMS.

## Camino rápido

1. Abra `src/shared/i18n/en.ts` (inglés; define la forma de todos los textos).
2. Abra `src/shared/i18n/es.ts` (español; debe tener las mismas claves).
3. Cambie solo cadenas. No renombre claves ni borre entradas.
4. Ejecute `npm run check`. Si falta o sobra una clave en español, el chequeo falla.
5. Revise `npm run dev` en `/en/` y `/es/`.

## Dónde está cada bloque

| Clave raíz | Qué alimenta |
| --- | --- |
| `meta` | Título y descripción del documento (SEO) |
| `nav` | Cabecera, menú móvil, «Saltar al contenido», «Iniciar un proyecto», «Idioma» |
| `hero` | Titular, subtítulo, CTAs y destacados |
| `pillars` | «Por qué Godixy» |
| `services` | Explorador de servicios (títulos, puntos, resultado, CTA) |
| `process` | Fases GDF, principios, niveles Lite / Standard / Advanced |
| `audience` | «A quién servimos» |
| `about` | Misión, visión, valores |
| `engagement` | Modalidades y planes Essential / Business / Managed |
| `faq` | Preguntas y respuestas |
| `contact` | Columna de contacto y **todas** las etiquetas, errores y éxitos del formulario |
| `footer` | Pie, «Aviso de privacidad», «Volver arriba», nombre legal |
| `privacy` | Página `/en/privacy/` y `/es/privacy/` |
| `notFound` | Página 404 (se muestran ambos idiomas) |

Códigos compartidos (no son copy, pero las **etiquetas** sí): `src/shared/i18n/config.ts`

| Constante | Valores |
| --- | --- |
| `companySizes` | `small`, `medium`, `large`, `enterprise` |
| `serviceIds` | `custom-software`, `integration`, `support`, `consulting`, `automation`, `cloud` |
| `serviceInterests` | los seis + `other` |

Si añade un servicio o un tamaño, actualice `config.ts`, ambas etiquetas en `en.ts` / `es.ts`, y el formulario/esquema. Eso ya no es solo copy: pide revisión de frontend.

## Reglas

- **Un idioma no se publica sin el otro.** `es` está tipado como `Dictionary` (la forma de `en`).
- **No escriba frases sueltas en componentes.** Las islas reciben `t` como propiedad desde `.astro`.
- **No invente precios, plazos de respuesta ni métricas de clientes.** El QA rechaza compromisos no aprobados (ejemplo ya corregido: un plazo de «dos días hábiles»).
- **Correo público del sitio:** `contact.email` es `hello@godixy.com` en ambos diccionarios. Cámbielo solo si Godixy cambia el buzón público (y alinee `CONTACT_TO` en el entorno; ver [soporte.md](soporte.md)).
- **Fecha del aviso de privacidad:** el rótulo «Última actualización» / «Last updated» está en el diccionario; la fecha en sí está fijada en `src/pages/[lang]/privacy.astro` (`2026-10-25`). Si cambia el texto legal, actualice esa fecha en el mismo cambio.
- **Asunto del correo de reserva** (`mailto`): `contact.form.mailtoSubject`.

## Cómo comprobar

| Comprobación | Comando o acción |
| --- | --- |
| Paridad de claves | `npm run check` |
| Pruebas de diccionario | `npm run test` (incluye paridad i18n) |
| Vista local | `npm run dev` → `/en/` y `/es/` |
| Calidad local | `npm run verify` |

## Tras el cambio

1. Diff solo de los diccionarios (y `privacy.astro` si tocó la fecha).
2. Revisión bilingüe de tono (Godixy; el brief deja el copy final como aprobación humana).
3. No despliegue: G8 lo autoriza Ronald Castillo. El procedimiento de imagen está en [../05-release/deploy-runbook.md](../05-release/deploy-runbook.md).
