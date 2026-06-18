❯ Claro la cosa es que el proyecto se penso asi, investigar sobre un proyecto en espeficio  
  con toda la informacion disponiblee en intenert  y poder como que cruzarlo con mas        
  documentos del mismo pero de otras fuentes y habllar irregularidaes y coasas asii2        
  
⏺ Ah, eso es mucho más potente e interesante. Lo que describes es básicamente un sistema de
  investigación periodística asistida por IA — como lo que hacen los periodistas de datos
  para destapar corrupción.

  El flujo sería:

  ---
  El usuario ingresa un proyecto (ej: "Gasoducto Sur Peruano") → el sistema:
  
  1. Busca información en internet — noticias, documentos oficiales, contratos en SEACE,
  presupuesto en MEF
  2. Acepta documentos adicionales — el usuario sube PDFs, contratos, auditorías que
  encontró
  3. Cruza toda esa información — compara montos, fechas, empresas, beneficiarios
  4. Detecta irregularidades — sobrecostos, empresas fantasma, pagos sin obra, conflictos de
  interés
  5. El chat responde preguntas sobre ese proyecto específico con toda esa evidencia

  ---
  Técnicamente eso requiere:
  
  - Búsqueda web en tiempo real (ej: Tavily API o SerpAPI — ambas tienen free tier)
  - Subida y lectura de PDFs (extracción de texto)
  - RAG (Retrieval Augmented Generation) — que el chat busque en los documentos antes de
  responder
  - Groq como cerebro para el análisis (ya lo tienes)

  ---
  La parte más compleja es el RAG — básicamente crear un "buscador" sobre los documentos del
  proyecto para que el chat encuentre la información relevante antes de responder.