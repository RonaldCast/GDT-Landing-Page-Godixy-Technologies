import type { Dictionary } from './en';

export const es: Dictionary = {
  meta: {
    title: 'Godixy Technologies | Software a medida, integración y soporte continuo',
    description:
      'Godixy Technologies desarrolla, integra y da soporte a software a medida, aplicaciones web y móviles para empresas que necesitan un socio tecnológico confiable. Alcance explícito, entrega verificable y soporte continuo.',
  },
  nav: {
    skipToContent: 'Saltar al contenido',
    primary: 'Navegación principal',
    links: {
      services: 'Servicios',
      process: 'Cómo trabajamos',
      audience: 'A quién servimos',
      about: 'Nosotros',
      engagement: 'Modalidades',
      faq: 'Preguntas',
    },
    cta: 'Iniciar un proyecto',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    language: 'Idioma',
    switchTo: 'Switch to English',
  },
  hero: {
    eyebrow: 'Socio de software y tecnología',
    titlePrefix: 'Software que',
    phrases: ['se entrega', 'opera en producción', 'mantiene su soporte'],
    titleAccessible: 'Software que se entrega, opera en producción y mantiene su soporte.',
    subtitle: [
      { text: 'Diseñamos', emphasis: true },
      { text: ', ', emphasis: false },
      { text: 'desarrollamos', emphasis: true },
      { text: ', ', emphasis: false },
      { text: 'integramos', emphasis: true },
      { text: ' y ', emphasis: false },
      { text: 'mantenemos', emphasis: true },
      {
        text: ' software a medida, aplicaciones web y móviles para empresas que necesitan un socio tecnológico que puedan ',
        emphasis: false,
      },
      { text: 'verificar', emphasis: true },
      { text: ', no solo confiar.', emphasis: false },
    ],
    primaryCta: 'Iniciar un proyecto',
    secondaryCta: 'Ver servicios',
    highlights: ['Alcance explícito por escrito', 'Criterios de aceptación por hito', 'Soporte después del go-live'],
    sceneLabel: 'Ilustración animada de bloques modulares inspirados en el logo de Godixy',
  },
  intro: {
    status: 'Cargando Godixy Technologies',
  },
  pillars: {
    label: 'Por qué Godixy',
    title: 'Un modelo de entrega basado en compromisos verificables',
    items: [
      {
        value: 'Precisión',
        title: 'Alcance explícito',
        text: 'Cada propuesta indica qué incluye, qué no incluye y cómo se aceptará cada entregable. Lo que se escribe es lo que se demuestra y se entrega.',
      },
      {
        value: 'Continuidad',
        title: 'Soporte continuo',
        text: 'El go-live no es la meta final. Mantenemos los sistemas operando con canales y responsables definidos, para que cada incidente tenga respuesta y cierre.',
      },
      {
        value: 'Claridad',
        title: 'Entrega verificable',
        text: 'Entregamos en incrementos pequeños y demostrables, y cada informe separa hechos, pendientes y riesgos.',
      },
    ],
  },
  services: {
    label: 'Servicios',
    title: 'Todo lo que tu software necesita, de la idea a la operación',
    intro:
      'Elige un servicio para ver lo que cubre. La mayoría de los proyectos combina varios bajo un mismo equipo responsable.',
    listLabel: 'Servicios de Godixy',
    outcomeLabel: 'Lo que obtienes',
    cta: 'Conversemos sobre este servicio',
    scrollHint: 'Sigue bajando para ver cada servicio.',
    items: [
      {
        id: 'custom-software',
        title: 'Software a medida, apps web y móviles',
        summary:
          'Soluciones digitales personalizadas, plataformas web corporativas y aplicaciones móviles construidas según cómo funciona realmente tu negocio.',
        points: [
          'Plataformas web y aplicaciones internas de negocio',
          'Apps móviles para clientes y equipos de campo',
          'Sitios corporativos con integración de CMS',
          'Frontends con TypeScript estricto y backends bien estructurados',
        ],
        outcome: 'Un producto listo para producción, adaptado a tu proceso, con código y documentación de tu propiedad.',
      },
      {
        id: 'integration',
        title: 'Implementación e integración de sistemas',
        summary:
          'Conectamos las plataformas que ya utilizas para que los datos fluyan de forma confiable y ponemos en producción módulos específicos.',
        points: [
          'Integraciones con APIs, webhooks y servicios de terceros',
          'Implementación de pasarelas de pago en línea',
          'Interoperabilidad entre sistemas heredados y modernos',
          'Manejo de fallos y trazabilidad en cada integración',
        ],
        outcome: 'Sistemas que se comunican entre sí, con un comportamiento claro cuando un servicio externo falla.',
      },
      {
        id: 'support',
        title: 'Soporte y mantenimiento continuo',
        summary:
          'Soporte preventivo y correctivo después del go-live, con canales y responsables definidos para que cada incidente tenga respuesta y cierre.',
        points: [
          'Correcciones y mantenimiento preventivo',
          'Actualizaciones de dependencias, seguridad y plataforma',
          'Canales, responsables y seguimiento de incidentes definidos',
          'Mejoras evolutivas con el mismo flujo de calidad',
        ],
        outcome: 'Continuidad: tu sistema sigue operando y mejorando mucho después del lanzamiento.',
      },
      {
        id: 'consulting',
        title: 'Consultoría tecnológica',
        summary:
          'Asesoría técnica estratégica para definir un alcance explícito, analizar la factibilidad y establecer criterios de aceptación claros antes de invertir.',
        points: [
          'Talleres de descubrimiento y levantamiento de requisitos',
          'Análisis de factibilidad y revisión de riesgos técnicos',
          'Arquitectura proporcional a la complejidad real',
          'Hojas de ruta con objetivos medibles',
        ],
        outcome: 'Decisiones basadas en hechos, con un alcance que todos entienden y pueden aprobar.',
      },
      {
        id: 'automation',
        title: 'Automatización de procesos',
        summary:
          'Digitalizamos y optimizamos flujos de trabajo operativos para eliminar tareas manuales, reducir errores y mejorar la eficiencia.',
        points: [
          'Mapeo de procesos actuales y cuellos de botella',
          'Digitalización de flujos y aprobaciones',
          'Notificaciones, reportes y sincronización de datos automatizados',
          'Herramientas de automatización solo donde aportan valor real',
        ],
        outcome: 'Menos esfuerzo manual, menos errores y procesos que puedes medir.',
      },
      {
        id: 'cloud',
        title: 'Infraestructura cloud y servicios de TI',
        summary:
          'Configuración y administración de hosting en la nube, gestión de certificados SSL y capacitación técnica para tu equipo.',
        points: [
          'Configuración y administración de hosting en la nube',
          'Gestión de dominios, DNS y certificados SSL',
          'Pipelines de despliegue, respaldos y planes de rollback',
          'Capacitación técnica para tu personal',
        ],
        outcome: 'Infraestructura segura, documentada y operable por tu equipo.',
      },
    ],
  },
  process: {
    label: 'Cómo trabajamos',
    title: 'Godixy Delivery Framework',
    intro:
      'Diez fases y nueve puertas de aprobación llevan cada proyecto desde la primera conversación hasta una operación estable. Selecciona una fase para ver qué ocurre y qué debe cumplirse para avanzar.',
    principlesTitle: 'Seis principios detrás de cada proyecto',
    principles: [
      'Entender antes de desarrollar',
      'Acordar antes de comprometerse',
      'Diseñar antes de escalar',
      'Entregar de forma incremental',
      'Calidad integrada al desarrollo',
      'Operar lo que se construye',
    ],
    phaseLabel: 'Fase',
    gateLabel: 'Puerta',
    ongoingLabel: 'Continuo',
    deliverablesLabel: 'Entregables clave',
    exitLabel: 'Para avanzar',
    previous: 'Fase anterior',
    next: 'Fase siguiente',
    scrollHint: 'Sigue bajando para recorrer cada fase.',
    phases: [
      {
        title: 'Contacto y calificación',
        text: 'Entendemos tu empresa, el problema que quieres resolver y su impacto, y confirmamos que somos el socio adecuado.',
        deliverables: ['Resumen de la oportunidad', 'Problema identificado', 'Próximo paso recomendado'],
        exit: 'Un problema claro y una oportunidad que vale la pena investigar.',
      },
      {
        title: 'Descubrimiento y requisitos',
        text: 'Mapeamos tu proceso actual, usuarios, reglas, integraciones y riesgos, y priorizamos lo que debe incluir la primera versión.',
        deliverables: ['Requisitos funcionales y no funcionales', 'Mapas de procesos', 'Lista priorizada de funcionalidades'],
        exit: 'Validas el problema, los requisitos y las prioridades.',
      },
      {
        title: 'Propuesta y contratación',
        text: 'Alcance, esfuerzo, plazos, pagos, responsabilidades y criterios de aceptación se convierten en un compromiso claro y escrito.',
        deliverables: ['Propuesta con alcance explícito', 'Hitos y calendario de pagos', 'Reglas de control de cambios'],
        exit: 'Propuesta y condiciones aprobadas por ti.',
      },
      {
        title: 'Planificación y kickoff',
        text: 'Convertimos el alcance acordado en un plan visible: backlog, hitos, responsables, ambientes y cadencia de comunicación.',
        deliverables: ['Ficha de inicio del proyecto', 'Backlog priorizado', 'Definition of Ready y Done'],
        exit: 'Equipo, accesos, prioridades y herramientas listos.',
      },
      {
        title: 'Diseño y arquitectura',
        text: 'Flujos de usuario, interfaces y una arquitectura técnica proporcional a la complejidad real, sin sobreingeniería.',
        deliverables: ['Diseños aprobados', 'Arquitectura y registros de decisiones', 'Planes de seguridad y pruebas'],
        exit: 'Una solución viable y diseños validados.',
      },
      {
        title: 'Desarrollo iterativo',
        text: 'Incrementos pequeños y revisables, con revisión de código, pruebas automatizadas y una Definition of Done estricta.',
        deliverables: ['Incrementos demostrables', 'Código revisado y probado', 'Demostraciones periódicas'],
        exit: 'Cada incremento cumple los controles de calidad.',
      },
      {
        title: 'QA y aceptación del cliente',
        text: 'Verificamos el comportamiento funcional y los riesgos técnicos; luego ejecutas los escenarios de aceptación acordados en staging.',
        deliverables: ['Evidencia de pruebas', 'Registro de defectos', 'Aprobación de aceptación'],
        exit: 'Criterios de aceptación cumplidos, sin defectos bloqueantes.',
      },
      {
        title: 'Puesta en producción',
        text: 'Una publicación controlada y verificable, con checklist de despliegue, plan de rollback y validación posterior.',
        deliverables: ['Runbook de despliegue', 'Plan de rollback', 'Validación posterior'],
        exit: 'El flujo principal del negocio funciona en producción.',
      },
      {
        title: 'Estabilización y entrega',
        text: 'Un periodo de hypercare, capacitación de usuarios y entrega formal de documentación, accesos y responsabilidades.',
        deliverables: ['Guías de usuario y técnicas', 'Accesos transferidos', 'Cierre formal'],
        exit: 'Entregables recibidos y responsable de la operación definido.',
      },
      {
        title: 'Soporte y evolución',
        text: 'El soporte correctivo, preventivo y evolutivo mantiene tu sistema estable y en mejora continua.',
        deliverables: ['Plan de soporte', 'Reportes de mantenimiento', 'Hoja de ruta de mejoras'],
        exit: 'Relación continua.',
      },
    ],
    tiersTitle: 'El proceso se adapta a tu proyecto',
    tiersIntro:
      'Los controles son proporcionales a la complejidad, la sensibilidad de los datos, las integraciones y el impacto de un fallo, no solo al presupuesto.',
    tiersLabel: 'Nivel del framework',
    aspectLabel: 'Aspecto',
    tiers: [
      {
        name: 'Lite',
        when: 'Proyectos pequeños, requisitos claros, pocas integraciones y bajo riesgo.',
        examples: 'Landing pages, sitios corporativos, formularios de contacto, dashboards sencillos.',
        rows: [
          'Reunión y requisitos esenciales',
          'Arquitectura breve',
          'Validaciones esenciales',
          'Checklist de publicación',
          'Garantía y condiciones básicas',
        ],
      },
      {
        name: 'Standard',
        when: 'Proyectos medianos con varios módulos, reglas de negocio, bases de datos, usuarios y APIs.',
        examples: 'Sistemas de cotizaciones, portales de clientes, CRM personalizados, sistemas de presupuestos.',
        rows: [
          'Documento funcional formal',
          'Diseño funcional y técnico',
          'Suite de pruebas automatizadas y UAT',
          'CI/CD con rollback documentado',
          'Plan de estabilización acordado',
        ],
      },
      {
        name: 'Advanced',
        when: 'Proyectos complejos con integraciones críticas, alta disponibilidad, datos sensibles o múltiples empresas.',
        examples: 'Plataformas SaaS multi-tenant, sistemas clínicos integrados, asistentes de IA empresariales.',
        rows: [
          'Análisis profundo y registro de riesgos',
          'Arquitectura detallada con ADR',
          'Pruebas ampliadas según riesgos',
          'Publicación gradual y recuperación reforzada',
          'SLA contractual y operación formal',
        ],
      },
    ],
    aspects: ['Descubrimiento', 'Diseño', 'Pruebas', 'Despliegue', 'Soporte'],
  },
  audience: {
    label: 'A quién servimos',
    title: 'Un solo socio para líderes de negocio y equipos técnicos',
    intro: 'Hablamos el idioma de la gerencia y del equipo de TI, y servimos a empresas de todos los tamaños.',
    groups: [
      {
        title: 'Ejecutivos y tomadores de decisión',
        text: 'Necesitas resultados predecibles, no ruido técnico.',
        points: [
          'Alcance, plazos y presupuesto por escrito antes de empezar',
          'Reportes semanales que separan hechos, pendientes y riesgos',
          'Control de cambios explícito que protege tu inversión',
        ],
      },
      {
        title: 'Equipos de TI e ingeniería',
        text: 'Necesitas un socio que respete tu stack y tus estándares.',
        points: [
          'Arquitectura proporcional y decisiones documentadas',
          'Revisión de código, pruebas automatizadas y CI/CD por defecto',
          'Entrega ordenada: documentación, accesos y runbooks',
        ],
      },
    ],
    sizesTitle: 'Para empresas de todos los tamaños',
    sizes: [
      { title: 'Pequeñas empresas', text: 'Digitaliza procesos y lanza tu primera plataforma con un alcance acotado y controlado.' },
      { title: 'Medianas empresas', text: 'Integra sistemas, automatiza operaciones y escala lo que ya funciona.' },
      { title: 'Grandes organizaciones', text: 'Amplía tu capacidad de TI con un equipo que trabaja con puertas formales y evidencia.' },
    ],
  },
  about: {
    label: 'Sobre Godixy',
    title: 'El profesionalismo se demuestra en el oficio',
    missionTitle: 'Misión',
    mission:
      'Desarrollamos, implementamos, damos soporte y mantenemos soluciones de software y aplicaciones web y móviles para empresas que requieren un socio tecnológico. Lo hacemos mediante consultoría, integración de sistemas y automatización de procesos, garantizando un alcance explícito, entrega verificable y soporte continuo.',
    visionTitle: 'Visión',
    vision:
      'En un horizonte de cinco a diez años, ser reconocidos por las empresas que necesitan desarrollo, integración o soporte de software como el referente de confianza y profesionalismo; ser la opción elegida porque el alcance prometido se cumple, el sistema queda operando en producción y el soporte se mantiene tras el lanzamiento.',
    valuesTitle: 'Nuestros valores',
    values: [
      {
        title: 'Precisión',
        quote: 'El profesionalismo se demuestra en el oficio.',
        text: 'El alcance escrito coincide exactamente con lo demostrado y entregado, y cada hito cuenta con criterios de aceptación explícitos.',
      },
      {
        title: 'Continuidad',
        quote: 'La confianza se sostiene más allá de la venta.',
        text: 'Tras la puesta en producción brindamos soporte y mantenimiento con canales y responsables definidos, para dar respuesta y cierre a cada incidente.',
      },
      {
        title: 'Claridad',
        quote: 'La confianza se apoya en hechos comprobables.',
        text: 'Las propuestas y reportes diferencian claramente hechos, pendientes y riesgos. Cada compromiso establece fecha, responsable y criterio de terminado.',
      },
    ],
  },
  engagement: {
    label: 'Modalidades',
    title: 'Modelos de contratación según tu nivel de certeza',
    intro: 'Recomendamos el modelo que se ajusta a qué tan definido está tu proyecto, y lo dejamos por escrito.',
    models: [
      { title: 'Precio fijo', text: 'Cuando los requisitos y el alcance están suficientemente definidos.' },
      { title: 'Tiempo y materiales', text: 'Cuando los requisitos cambian o la incertidumbre técnica es considerable.' },
      { title: 'Descubrimiento pagado', text: 'Cuando necesitas análisis, diseño o una prueba de viabilidad antes de comprometerte a construir.' },
      { title: 'Servicio mensual', text: 'Para mantenimiento, soporte, mejoras y evolución continua.' },
    ],
    supportTitle: 'Planes de soporte después del go-live',
    supportIntro: 'Planes mensuales con horas, tiempos de respuesta, tareas incluidas y exclusiones definidas.',
    plans: [
      {
        name: 'Essential',
        text: 'Mantenimiento preventivo y un volumen limitado de soporte.',
        points: ['Actualizaciones de dependencias y seguridad', 'Respaldos y controles operativos', 'Soporte correctivo'],
      },
      {
        name: 'Business',
        text: 'Mantenimiento, soporte prioritario y mejoras dentro de una bolsa de horas.',
        points: ['Todo lo de Essential', 'Respuesta prioritaria', 'Mejoras evolutivas'],
      },
      {
        name: 'Managed',
        text: 'Gestión operativa más amplia, monitoreo y compromisos de servicio acordados.',
        points: ['Todo lo de Business', 'Monitoreo y alertas', 'Compromisos de servicio acordados'],
      },
    ],
    plansNote: 'Los precios y niveles de servicio se definen por proyecto según la infraestructura, la criticidad y la carga de trabajo.',
    cta: 'Solicitar una propuesta',
  },
  faq: {
    label: 'Preguntas',
    title: 'Preguntas que nos hacen las empresas',
    items: [
      {
        q: '¿Cómo estiman el costo y el plazo?',
        a: 'Después del descubrimiento estimamos el esfuerzo por módulos y actividades, identificamos dependencias externas y presentamos una propuesta con hitos, calendario de pagos y criterios de aceptación. Si la incertidumbre es alta, recomendamos primero un descubrimiento pagado.',
      },
      {
        q: '¿Quién es propietario del código fuente?',
        a: 'La propiedad del código, las licencias y los servicios de terceros se establece de forma explícita en cada propuesta, junto con las obligaciones de confidencialidad y protección de datos.',
      },
      {
        q: '¿Qué pasa si necesitamos algo que no estaba en el alcance?',
        a: 'Registramos la solicitud, analizamos su impacto en esfuerzo y calendario y presentamos una propuesta de cambio. Nada cambia sin tu aprobación explícita; a veces es simplemente un intercambio entre funcionalidades.',
      },
      {
        q: '¿Trabajan con nuestros sistemas y nuestro equipo de TI?',
        a: 'Sí. La integración y la interoperabilidad son servicios centrales. Revisamos tus APIs, bases de datos y restricciones durante el descubrimiento y documentamos cada decisión para tu equipo.',
      },
      {
        q: '¿Qué soporte recibimos después del lanzamiento?',
        a: 'Cada proyecto incluye un periodo de estabilización. Después, los planes de soporte mensual cubren trabajo correctivo, preventivo y evolutivo con canales y responsables definidos.',
      },
      {
        q: '¿Trabajan en inglés y en español?',
        a: 'Sí. Trabajamos con clientes en ambos idiomas y la documentación puede entregarse en cualquiera de ellos.',
      },
    ],
  },
  contact: {
    label: 'Iniciar un proyecto',
    title: 'Cuéntanos qué necesitas resolver',
    intro:
      'Comparte algunos detalles y te responderemos con el próximo paso recomendado. Sin compromiso y sin presión comercial.',
    emailLabel: '¿Prefieres escribirnos?',
    email: 'hello@godixy.com',
    nextTitle: 'Qué sucede después',
    nextSteps: [
      'Revisamos tu solicitud y te respondemos por correo.',
      'Una llamada breve para entender el problema, los usuarios y el impacto.',
      'Un camino recomendado: descubrimiento, propuesta o una respuesta rápida.',
    ],
    form: {
      name: 'Nombre completo',
      email: 'Correo corporativo',
      company: 'Empresa',
      companySize: 'Tamaño de la empresa',
      companySizePlaceholder: 'Selecciona un tamaño',
      companySizes: {
        small: 'Pequeña (1-50 personas)',
        medium: 'Mediana (51-250 personas)',
        large: 'Grande (251-1000 personas)',
        enterprise: 'Corporativa (más de 1000 personas)',
      },
      service: 'Servicio de interés',
      servicePlaceholder: 'Selecciona un servicio',
      services: {
        'custom-software': 'Software a medida, apps web y móviles',
        integration: 'Implementación e integración de sistemas',
        support: 'Soporte y mantenimiento continuo',
        consulting: 'Consultoría tecnológica',
        automation: 'Automatización de procesos',
        cloud: 'Infraestructura cloud y servicios de TI',
        other: 'Otro',
      },
      message: '¿Qué necesitas resolver?',
      messageHint: 'El problema, cómo lo manejas hoy y cualquier fecha límite. Entre 20 y 2000 caracteres.',
      consent: 'Acepto que Godixy Technologies utilice esta información para responder a mi solicitud.',
      consentPrivacy: 'Leer el aviso de privacidad',
      honeypot: 'Deja este campo vacío',
      optional: 'opcional',
      submit: 'Enviar solicitud',
      sending: 'Enviando...',
      successTitle: 'Gracias. Tu solicitud fue enviada.',
      successText: 'La revisaremos y te responderemos por correo con el próximo paso recomendado.',
      sendAnother: 'Enviar otra solicitud',
      errorSummary: 'Revisa los campos marcados.',
      errors: {
        name: 'Ingresa tu nombre (entre 2 y 100 caracteres).',
        email: 'Ingresa un correo electrónico válido.',
        company: 'El nombre de la empresa debe tener 200 caracteres o menos.',
        companySize: 'Selecciona el tamaño de tu empresa.',
        service: 'Selecciona un servicio.',
        message: 'Describe tu necesidad en 20 a 2000 caracteres.',
        consent: 'Acepta para que podamos responderte.',
      },
      failureTitle: 'No pudimos enviar tu solicitud.',
      failureGeneric: 'Algo salió mal. Inténtalo de nuevo en un momento.',
      failureRateLimit: 'Demasiadas solicitudes. Espera unos minutos e inténtalo de nuevo.',
      failureUnavailable: 'Nuestro formulario no está disponible temporalmente.',
      mailtoFallback: 'Enviarla por correo',
      mailtoSubject: 'Nueva solicitud de proyecto',
    },
  },
  footer: {
    tagline: 'Software a medida, integración y soporte continuo para empresas que necesitan un socio tecnológico.',
    navTitle: 'Explorar',
    contactTitle: 'Contacto',
    legalName: 'Godixy Technologies EIRL',
    rights: 'Todos los derechos reservados.',
    backToTop: 'Volver arriba',
    privacy: 'Aviso de privacidad',
  },
  privacy: {
    title: 'Aviso de privacidad',
    description: 'Qué información recopila el sitio web de Godixy Technologies y cómo se utiliza.',
    intro: 'Este aviso explica qué información recopila este sitio web y cómo la utiliza Godixy Technologies EIRL.',
    updatedLabel: 'Última actualización',
    sections: [
      {
        title: 'Información que nos envías',
        text: 'Cuando usas el formulario de contacto recibimos tu nombre, correo electrónico, empresa (opcional), tamaño de la empresa, el servicio que te interesa, tu mensaje y el idioma de la página. Si nos escribes directamente, recibimos el contenido de tu correo.',
      },
      {
        title: 'Cómo la usamos',
        text: 'Usamos esta información solo para responder a tu solicitud y, si nos la pides, para preparar una propuesta. No la vendemos ni la usamos con fines publicitarios.',
      },
      {
        title: 'A dónde va',
        text: 'El formulario entrega tu solicitud por correo electrónico a la bandeja de nuestro equipo. Este sitio no mantiene una base de datos de solicitudes. Para proteger el formulario contra abusos, el servidor conserva brevemente tu dirección de red en memoria para limitar solicitudes repetidas.',
      },
      {
        title: 'Cookies',
        text: 'Este sitio usa una sola cookie, llamada "lang", para recordar el idioma que eliges. Solo contiene el código del idioma y vence al cabo de un año. No usamos cookies de analítica, publicidad ni seguimiento de terceros.',
      },
      {
        title: 'Tus opciones',
        text: 'Puedes pedirnos acceder, corregir o eliminar la información que nos enviaste escribiendo a la dirección indicada abajo.',
      },
    ],
    back: 'Volver a la página principal',
  },
  notFound: {
    title: 'Página no encontrada',
    text: 'La página que buscas no existe o fue movida.',
    cta: 'Ir a la página principal',
  },
};
