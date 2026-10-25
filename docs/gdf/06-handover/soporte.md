# Soporte del sitio — Godixy Technologies

Procedimiento para fallos del sitio publicado y del formulario. **No hay SLA, garantía ni tiempo de respuesta en este documento.** Esos términos, si existen, se acuerdan fuera de este repositorio (el brief deja el soporte de Fase 10 como acuerdo aparte).

Despliegue, variables (solo nombres), healthcheck y rollback: [../05-release/deploy-runbook.md](../05-release/deploy-runbook.md). Este archivo no inventa pasos de Coolify.

## Camino rápido

1. Compruebe `GET /api/health` en el origen publicado. Cuerpo esperado: `{"status":"ok"}`.
2. Compruebe `/`, `/en/` y `/es/`.
3. Si el formulario falla, lea el mensaje en pantalla (tabla abajo) y el correo `hello@godixy.com` como reserva.
4. Si el mensaje es «formulario no disponible», revise en el entorno si `SMTP_HOST` está definido (el valor no se documenta aquí).
5. Si el proceso no responde, use el rollback del runbook (imagen anterior). No escale a un segundo réplica: el límite de envíos vive en memoria de un solo proceso.

## Qué cubre este sitio

| Elemento | Hecho en el código |
| --- | --- |
| Entrega de solicitudes | Correo SMTP a `CONTACT_TO` (predeterminado `hello@godixy.com`). No hay base de datos. |
| Reserva | Enlace «Enviarla por correo» / «Send it by email instead» hacia `hello@godixy.com` |
| Salud | `GET /api/health` → JSON `{ "status": "ok" }`, `Cache-Control: no-store` |
| Límite | 5 envíos / 10 minutos por IP (memoria del proceso; se pierde al reiniciar) |
| Trampa | Campo oculto `website`: si viene lleno, la Action responde éxito y no envía |

## Fallos del formulario

Textos que ve el visitante (español / inglés):

| Código interno | Español | Inglés | Qué hacer |
| --- | --- | --- | --- |
| Validación | «Revisa los campos marcados.» | «Please review the highlighted fields.» | El visitante corrige; no es un incidente de servidor. |
| `TOO_MANY_REQUESTS` | «Demasiadas solicitudes. Espera unos minutos e inténtalo de nuevo.» | «Too many requests…» | Esperar la ventana de 10 minutos o, si es un ataque, revisar logs. Reiniciar el contenedor **borra** el contador. |
| `SERVICE_UNAVAILABLE` | «Nuestro formulario no está disponible temporalmente.» | «Our form is temporarily unavailable.» | `SMTP_HOST` vacío o transporte no creado. Usar `mailto`. Configurar SMTP en el entorno (nombres en el runbook). |
| `INTERNAL_SERVER_ERROR` / otro | «Algo salió mal. Inténtalo de nuevo en un momento.» | «Something went wrong…» | Fallo al enviar (`send_failed`) u otro error. Revisar logs del proceso (`[contact] failed to send email`). No reenviar secretos. |

En desarrollo (`astro dev`), si no hay SMTP, el servidor **registra** el mensaje y la Action responde éxito. Eso no ocurre en producción: ahí la Action devuelve no disponible.

El correo interno que genera la Action va en inglés, asunto `[godixy.com] {servicio} - {nombre}`, `Reply-To` el correo del visitante.

## SMTP (nombres, no valores)

| Variable | Efecto si falta o está mal |
| --- | --- |
| `SMTP_HOST` | Sin host no hay transporte. Producción: formulario no disponible + `mailto`. |
| `SMTP_PORT` / `SMTP_SECURE` | El transporte usa estos valores; el predeterminado del esquema es puerto 587 y `SMTP_SECURE=false`. |
| `SMTP_USER` / `SMTP_PASS` | Si ambos existen, se usan como auth. |
| `CONTACT_TO` | Buzón destino (predeterminado `hello@godixy.com`). |
| `CONTACT_FROM` | Remitente; si falta, el código usa `SMTP_USER` y luego `CONTACT_TO`. |

Los valores viven solo en el entorno de alojamiento. No los copie a tickets, git ni a este paquete.

Una entrega real con credenciales SMTP sigue pendiente como prueba de humo de G8 (informe de QA, criterio AC-19).

## Comprobación de salud

1. `GET {origen}/api/health` — cuerpo `{"status":"ok"}`.
2. El `Dockerfile` ya declara `HEALTHCHECK` contra `http://127.0.0.1:4321/api/health`.
3. `GET /` debe responder 302 a `/en/` o `/es/`.
4. Cabeceras de `server.mjs` (nosniff, `X-Frame-Options: DENY`, etc.). HSTS solo si `ENABLE_HSTS` es la cadena `true` y HTTPS ya está comprobado (runbook §5 y §8).

Si el healthcheck falla, no hay datos de aplicación que restaurar. La recuperación es redesplegar la imagen anterior o un commit conocido, más las mismas variables de entorno. Detalle: runbook §6 y §7.

## Qué no prometemos aquí

- Tiempo máximo de respuesta a un lead o a un incidente.
- Disponibilidad porcentual.
- Ventana de garantía.
- Precios de planes Essential / Business / Managed (el propio sitio dice que se definen por proyecto).
- Un proveedor SMTP concreto (sigue abierto en requisitos D-01 y en el runbook).

## Contacto interno de este proyecto

| Tema | Dueño |
| --- | --- |
| Textos EN/ES | Edición según [editar-contenido.md](editar-contenido.md); aprobación de copy: Godixy |
| Despliegue / rollback | Paula Castillo — runbook; autorización de producción: Ronald Castillo |
| Criterios de aceptación | Isabel Medina — `docs/gdf/04-quality/qa-report.md` |
| Arquitectura | Gabriel Núñez — `docs/gdf/03-design/architecture.md` |
| Buzón público `hello@godixy.com` | Operación Godixy (la propiedad de la cuenta SMTP no está fijada en el repo) |

**Siguiente dueño de la puerta G9:** Ronald Castillo.
