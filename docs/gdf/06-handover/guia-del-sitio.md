# Guía del sitio — Godixy Technologies

Cómo usa un operador de Godixy el sitio público. Los textos entre comillas son los que muestra la interfaz en español (`src/shared/i18n/es.ts`).

Sitio previsto: [https://godixy.com](https://godixy.com). G7, G8 y G9 **no están aprobados**; esta guía no afirma que el sitio ya esté en producción.

## Camino rápido

1. Abra `https://godixy.com`. El servidor redirige a `/es/` o `/en/` (cookie `lang`, si no el idioma del navegador, si no inglés).
2. Use la cabecera para ir a una sección o pulse «Iniciar un proyecto».
3. Para cambiar de idioma, use el control «Idioma» (`EN` / `ES`).
4. Envíe una solicitud en «Cuéntanos qué necesitas resolver», o escriba a `hello@godixy.com`.
5. El aviso legal está en «Aviso de privacidad» (`/es/privacy/`).

## Acceso e idiomas

| Dirección | Qué es |
| --- | --- |
| `https://godixy.com/` | Redirección 302 a `/en/` o `/es/` |
| `https://godixy.com/es/` | Página principal en español |
| `https://godixy.com/en/` | Página principal en inglés |
| `https://godixy.com/es/privacy/` | «Aviso de privacidad» |
| `https://godixy.com/en/privacy/` | «Privacy notice» |

La elección manual se guarda en la cookie `lang` durante un año. El conmutador intenta abrir el otro idioma en la misma sección visible (las secciones con ancla: servicios, proceso, audiencia, nosotros, modalidades, preguntas, contacto).

En pantallas estrechas: botón «Abrir menú» / «Cerrar menú». Escape cierra el menú.

Enlace inicial de teclado: «Saltar al contenido».

## Secciones de la página principal

La navegación («Navegación principal») enlaza estas anclas. El logo vuelve a `/{idioma}/`.

| Enlace | Ancla | Qué verá (títulos en español) |
| --- | --- | --- |
| — | Hero (sin ancla de nav) | «Socio de software y tecnología». Acciones: «Iniciar un proyecto» (`#contact`) y «Ver servicios» (`#services`). |
| — | Pilares | «Por qué Godixy» / «Un modelo de entrega basado en compromisos verificables» (Precisión, Continuidad, Claridad). |
| Servicios | `#services` | «Todo lo que tu software necesita, de la idea a la operación». Seis pestañas; el detalle muestra «Lo que obtienes» y «Conversemos sobre este servicio» (abre el formulario con ese servicio marcado). |
| Cómo trabajamos | `#process` | «Godixy Delivery Framework». Diez fases, principios y niveles Lite / Standard / Advanced. Controles «Fase anterior» y «Fase siguiente». |
| A quién servimos | `#audience` | «Un solo socio para líderes de negocio y equipos técnicos». |
| Nosotros | `#about` | «El profesionalismo se demuestra en el oficio» (Misión, Visión, valores). |
| Modalidades | `#engagement` | «Modelos de contratación según tu nivel de certeza» y «Planes de soporte después del go-live» (Essential, Business, Managed). La nota del sitio dice que precios y niveles se definen por proyecto. **Esta guía no añade cifras.** |
| Preguntas | `#faq` | «Preguntas que nos hacen las empresas». Acordeón nativo; la primera pregunta empieza abierta. |
| Iniciar un proyecto | `#contact` | Formulario de solicitud. |

Pie de página: «Explorar» (mismos enlaces + «Iniciar un proyecto»), «Contacto» (`hello@godixy.com`), conmutador de idioma, «Aviso de privacidad», «Volver arriba», y «Godixy Technologies EIRL» / «Todos los derechos reservados.»

## Enviar una solicitud

### Qué ocurre después (texto del sitio)

1. «Revisamos tu solicitud y te respondemos por correo.»
2. «Una llamada breve para entender el problema, los usuarios y el impacto.»
3. «Un camino recomendado: descubrimiento, propuesta o una respuesta rápida.»

No hay en la interfaz un plazo de respuesta. No prometa uno.

### Campos (etiquetas en español)

| Campo | Obligatorio | Notas |
| --- | --- | --- |
| Nombre completo | Sí | 2 a 100 caracteres |
| Correo corporativo | Sí | Correo válido |
| Empresa | No | Marcado «(opcional)»; máximo 200 caracteres |
| Tamaño de la empresa | Sí | Pequeña (1-50) · Mediana (51-250) · Grande (251-1000) · Corporativa (más de 1000) |
| Servicio de interés | Sí | Los seis servicios o «Otro» |
| ¿Qué necesitas resolver? | Sí | 20 a 2000 caracteres. Ayuda: «El problema, cómo lo manejas hoy y cualquier fecha límite.» |
| Consentimiento | Sí | «Acepto que Godixy Technologies utilice esta información para responder a mi solicitud.» más el enlace «Leer el aviso de privacidad» (`/es/privacy/`). |

Hay un campo oculto «Deja este campo vacío» (trampa para bots). Un visitante no debe rellenarlo.

Botón: «Enviar solicitud». Mientras envía: «Enviando...» (el botón se desactiva).

### Resultados que verá el visitante

| Situación | Título / texto en pantalla |
| --- | --- |
| Envío correcto | «Gracias. Tu solicitud fue enviada.» / «La revisaremos y te responderemos por correo con el próximo paso recomendado.» Acción: «Enviar otra solicitud». |
| Campos incompletos | «Revisa los campos marcados.» más el mensaje de cada campo. |
| Error genérico | «No pudimos enviar tu solicitud.» / «Algo salió mal. Inténtalo de nuevo en un momento.» |
| Demasiados envíos | «Demasiadas solicitudes. Espera unos minutos e inténtalo de nuevo.» |
| Correo no disponible | «Nuestro formulario no está disponible temporalmente.» Enlace «Enviarla por correo» (abre el cliente de correo hacia `hello@godixy.com`). |

Siempre puede usar «¿Prefieres escribirnos?» → `hello@godixy.com`.

## Aviso de privacidad

Ruta: `/es/privacy/`. Título: «Aviso de privacidad». Introducción: «Este aviso explica qué información recopila este sitio web y cómo la utiliza Godixy Technologies EIRL.»

La página muestra «Última actualización» con la fecha fijada en el código (25 de octubre de 2026).

| Apartado | Qué dice (resumen fiel al texto) |
| --- | --- |
| Información que nos envías | Nombre, correo, empresa (opcional), tamaño, servicio, mensaje e idioma; o el contenido si escriben directo. |
| Cómo la usamos | Solo para responder y, si lo piden, preparar una propuesta. No se vende ni se usa para publicidad. |
| A dónde va | Correo a la bandeja del equipo. No hay base de datos de solicitudes. La IP se guarda un momento en memoria para limitar abusos. |
| Cookies | Una cookie `lang` (código de idioma, un año). Sin analítica, publicidad ni seguimiento de terceros. |
| Tus opciones | Pedir acceso, corrección o eliminación escribiendo a la dirección de la página. |

Al final: correo `hello@godixy.com` y «Volver a la página principal». El conmutador de idioma en esta página cambia a `/en/privacy/` o `/es/privacy/`.

**Pendiente:** Isabel registró que el texto de privacidad debe revisarse en Godixy (y con asesoría legal si aplica) antes de publicarlo. Esta guía no lo da por aprobado.

## Página no encontrada

Si la ruta no existe, el sitio muestra «Página no encontrada» / «La página que buscas no existe o fue movida.» y el equivalente en inglés, con «Ir a la página principal» hacia `/es/` o `/en/`.

## Lista de comprobación del operador

- [ ] `/` redirige a `/es/` o `/en/`.
- [ ] Las seis secciones de nav y «Iniciar un proyecto» desplazan a la ancla correcta.
- [ ] `EN` / `ES` cambia el idioma y conserva la sección cuando tiene ancla.
- [ ] Un envío válido muestra el mensaje de gracias (con SMTP configurado en el entorno publicado).
- [ ] Sin SMTP, aparece el fallo temporal y «Enviarla por correo».
- [ ] `/es/privacy/` carga el aviso y el correo `hello@godixy.com`.

Si algo de lo anterior falla, use [soporte.md](soporte.md).
