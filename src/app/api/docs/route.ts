import { NextResponse } from 'next/server'

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Auto Prestige API',
    version: '1.0.0',
    description: 'API REST para a plataforma Auto Prestige - Portal automotivo de Angola',
    contact: {
      name: 'Auto Prestige',
      email: 'api@autoprestige.ao'
    }
  },
  servers: [
    {
      url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      description: 'Servidor principal'
    }
  ],
  paths: {
    '/api/health': {
      get: {
        tags: ['Sistema'],
        summary: 'Verificar saúde da API',
        description: 'Endpoint para verificar o status e saúde da API',
        responses: {
          '200': {
            description: 'API funcionando corretamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    timestamp: { type: 'string', format: 'date-time' },
                    version: { type: 'string', example: '1.0.0' },
                    environment: { type: 'string', example: 'development' },
                    uptime: { type: 'number', example: 3600 },
                    services: {
                      type: 'object',
                      properties: {
                        database: { type: 'string', example: 'ok' },
                        external_apis: { type: 'string', example: 'ok' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/noticias': {
      get: {
        tags: ['Notícias'],
        summary: 'Listar notícias',
        description: 'Obter lista de notícias com filtros e paginação',
        parameters: [
          {
            name: 'categoria',
            in: 'query',
            description: 'Filtrar por categoria',
            schema: { type: 'string' }
          },
          {
            name: 'autor',
            in: 'query',
            description: 'Filtrar por autor',
            schema: { type: 'string' }
          },
          {
            name: 'destaque',
            in: 'query',
            description: 'Filtrar notícias em destaque',
            schema: { type: 'boolean' }
          },
          {
            name: 'busca',
            in: 'query',
            description: 'Busca textual no título e conteúdo',
            schema: { type: 'string' }
          },
          {
            name: 'pagina',
            in: 'query',
            description: 'Número da página',
            schema: { type: 'integer', default: 1 }
          },
          {
            name: 'limite',
            in: 'query',
            description: 'Itens por página',
            schema: { type: 'integer', default: 10 }
          },
          {
            name: 'ordenacao',
            in: 'query',
            description: 'Campo para ordenação',
            schema: { type: 'string', enum: ['dataPublicacao', 'titulo', 'visualizacoes'], default: 'dataPublicacao' }
          },
          {
            name: 'direcao',
            in: 'query',
            description: 'Direção da ordenação',
            schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' }
          }
        ],
        responses: {
          '200': {
            description: 'Lista de notícias',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Noticia' }
                    },
                    meta: { $ref: '#/components/schemas/PaginationMeta' }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Notícias'],
        summary: 'Criar nova notícia',
        description: 'Criar uma nova notícia',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/NoticiaInput' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Notícia criada com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Noticia' },
                    message: { type: 'string' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Dados inválidos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/api/noticias/{id}': {
      get: {
        tags: ['Notícias'],
        summary: 'Obter notícia por ID',
        description: 'Obter uma notícia específica pelo ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID da notícia',
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Notícia encontrada',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        noticia: { $ref: '#/components/schemas/Noticia' },
                        relacionadas: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Noticia' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          '404': {
            description: 'Notícia não encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      },
      put: {
        tags: ['Notícias'],
        summary: 'Atualizar notícia',
        description: 'Atualizar uma notícia existente',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID da notícia',
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/NoticiaInput' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Notícia atualizada com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Noticia' },
                    message: { type: 'string' }
                  }
                }
              }
            }
          },
          '404': {
            description: 'Notícia não encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Notícias'],
        summary: 'Deletar notícia',
        description: 'Deletar uma notícia existente',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID da notícia',
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Notícia deletada com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' }
                  }
                }
              }
            }
          },
          '404': {
            description: 'Notícia não encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/api/carros': {
      get: {
        tags: ['Carros'],
        summary: 'Listar carros',
        description: 'Obter lista de carros com filtros e paginação',
        parameters: [
          {
            name: 'marca',
            in: 'query',
            description: 'Filtrar por marca',
            schema: { type: 'string' }
          },
          {
            name: 'modelo',
            in: 'query',
            description: 'Filtrar por modelo',
            schema: { type: 'string' }
          },
          {
            name: 'ano_min',
            in: 'query',
            description: 'Ano mínimo',
            schema: { type: 'integer' }
          },
          {
            name: 'ano_max',
            in: 'query',
            description: 'Ano máximo',
            schema: { type: 'integer' }
          },
          {
            name: 'preco_min',
            in: 'query',
            description: 'Preço mínimo',
            schema: { type: 'number' }
          },
          {
            name: 'preco_max',
            in: 'query',
            description: 'Preço máximo',
            schema: { type: 'number' }
          },
          {
            name: 'categoria',
            in: 'query',
            description: 'Categoria do veículo',
            schema: { type: 'string', enum: ['sedan', 'suv', 'hatchback', 'pickup', 'coupe', 'convertible', 'wagon'] }
          },
          {
            name: 'combustivel',
            in: 'query',
            description: 'Tipo de combustível',
            schema: { type: 'string', enum: ['gasolina', 'diesel', 'hibrido', 'eletrico'] }
          },
          {
            name: 'transmissao',
            in: 'query',
            description: 'Tipo de transmissão',
            schema: { type: 'string', enum: ['manual', 'automatica', 'cvt'] }
          },
          {
            name: 'estado',
            in: 'query',
            description: 'Estado do veículo',
            schema: { type: 'string', enum: ['novo', 'usado', 'seminovo'] }
          },
          {
            name: 'cidade',
            in: 'query',
            description: 'Filtrar por cidade',
            schema: { type: 'string' }
          },
          {
            name: 'provincia',
            in: 'query',
            description: 'Filtrar por província',
            schema: { type: 'string' }
          },
          {
            name: 'destaque',
            in: 'query',
            description: 'Filtrar carros em destaque',
            schema: { type: 'boolean' }
          },
          {
            name: 'promocao',
            in: 'query',
            description: 'Filtrar carros em promoção',
            schema: { type: 'boolean' }
          },
          {
            name: 'busca',
            in: 'query',
            description: 'Busca textual',
            schema: { type: 'string' }
          },
          {
            name: 'pagina',
            in: 'query',
            description: 'Número da página',
            schema: { type: 'integer', default: 1 }
          },
          {
            name: 'limite',
            in: 'query',
            description: 'Itens por página',
            schema: { type: 'integer', default: 12 }
          },
          {
            name: 'ordenacao',
            in: 'query',
            description: 'Campo para ordenação',
            schema: { type: 'string', enum: ['dataPublicacao', 'preco', 'ano', 'quilometragem', 'visualizacoes'], default: 'dataPublicacao' }
          },
          {
            name: 'direcao',
            in: 'query',
            description: 'Direção da ordenação',
            schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' }
          }
        ],
        responses: {
          '200': {
            description: 'Lista de carros',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Carro' }
                    },
                    meta: { $ref: '#/components/schemas/PaginationMeta' },
                    estatisticas: { $ref: '#/components/schemas/CarroEstatisticas' }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Carros'],
        summary: 'Criar novo carro',
        description: 'Adicionar um novo carro ao catálogo',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CarroInput' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Carro criado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Carro' },
                    message: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/calculadoras': {
      get: {
        tags: ['Calculadoras'],
        summary: 'Listar calculadoras disponíveis',
        description: 'Obter lista de calculadoras automotivas disponíveis',
        responses: {
          '200': {
            description: 'Lista de calculadoras',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Calculadora' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/calculadoras/financiamento': {
      post: {
        tags: ['Calculadoras'],
        summary: 'Calcular financiamento',
        description: 'Calcular parcelas e juros de financiamento de veículo',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/FinanciamentoInput' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Cálculo de financiamento',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/FinanciamentoResultado' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/calculadoras/consumo': {
      post: {
        tags: ['Calculadoras'],
        summary: 'Calcular consumo de combustível',
        description: 'Calcular consumo e custos de combustível',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ConsumoInput' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Cálculo de consumo',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/ConsumoResultado' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/ferramentas': {
      get: {
        tags: ['Ferramentas'],
        summary: 'Listar ferramentas',
        description: 'Obter lista de ferramentas automotivas com filtros',
        parameters: [
          {
            name: 'categoria',
            in: 'query',
            description: 'Filtrar por categoria',
            schema: { type: 'string' }
          },
          {
            name: 'status',
            in: 'query',
            description: 'Filtrar por status',
            schema: { type: 'string', enum: ['ativo', 'premium'] }
          },
          {
            name: 'busca',
            in: 'query',
            description: 'Busca textual',
            schema: { type: 'string' }
          },
          {
            name: 'ordenacao',
            in: 'query',
            description: 'Campo para ordenação',
            schema: { type: 'string', enum: ['nome', 'categoria', 'popularidade', 'recente'] }
          },
          {
            name: 'pagina',
            in: 'query',
            description: 'Número da página',
            schema: { type: 'integer', default: 1 }
          },
          {
            name: 'limite',
            in: 'query',
            description: 'Itens por página',
            schema: { type: 'integer', default: 12 }
          }
        ],
        responses: {
          '200': {
            description: 'Lista de ferramentas',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Ferramenta' }
                    },
                    meta: { $ref: '#/components/schemas/PaginationMeta' },
                    estatisticas: { $ref: '#/components/schemas/FerramentaEstatisticas' }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Ferramentas'],
        summary: 'Criar nova ferramenta',
        description: 'Adicionar uma nova ferramenta',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/FerramentaInput' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Ferramenta criada com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Ferramenta' },
                    message: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/ferramentas/comparador': {
      post: {
        tags: ['Ferramentas'],
        summary: 'Comparar carros',
        description: 'Comparar especificações de múltiplos carros',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['carros'],
                properties: {
                  carros: {
                    type: 'array',
                    items: { type: 'string' },
                    minItems: 2,
                    maxItems: 4
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Comparação de carros',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/ComparacaoResultado' }
                  }
                }
              }
            }
          }
        }
      },
      get: {
        tags: ['Ferramentas'],
        summary: 'Buscar carros para comparação',
        description: 'Buscar carros disponíveis para comparação',
        parameters: [
          {
            name: 'faixa_preco',
            in: 'query',
            description: 'Faixa de preço',
            schema: { type: 'string', enum: ['ate_50k', '50k_100k', '100k_200k', 'acima_200k'] }
          }
        ],
        responses: {
          '200': {
            description: 'Carros disponíveis para comparação',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/CarroComparacao' }
                    },
                    estatisticas: { type: 'object' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/ferramentas/conversor': {
      post: {
        tags: ['Ferramentas'],
        summary: 'Converter unidades',
        description: 'Converter unidades automotivas',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['categoria', 'unidadeOrigem', 'unidadeDestino', 'valor'],
                properties: {
                  categoria: { type: 'string' },
                  unidadeOrigem: { type: 'string' },
                  unidadeDestino: { type: 'string' },
                  valor: { type: 'number' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Resultado da conversão',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/ConversaoResultado' }
                  }
                }
              }
            }
          }
        }
      },
      get: {
        tags: ['Ferramentas'],
        summary: 'Listar categorias de conversão',
        description: 'Obter categorias e unidades disponíveis para conversão',
        parameters: [
          {
            name: 'categoria',
            in: 'query',
            description: 'Categoria específica',
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Categorias de conversão',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'object' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/busca': {
      get: {
        tags: ['Busca'],
        summary: 'Busca básica',
        description: 'Realizar busca básica no conteúdo',
        parameters: [
          {
            name: 'q',
            in: 'query',
            required: true,
            description: 'Termo de busca',
            schema: { type: 'string' }
          },
          {
            name: 'tipo',
            in: 'query',
            description: 'Tipo de conteúdo',
            schema: { type: 'string', enum: ['artigo', 'noticia', 'carro', 'video', 'concessionaria', 'ferramenta'] }
          },
          {
            name: 'categoria',
            in: 'query',
            description: 'Categoria',
            schema: { type: 'string' }
          },
          {
            name: 'ordenacao',
            in: 'query',
            description: 'Ordenação',
            schema: { type: 'string', enum: ['relevancia', 'data', 'titulo', 'tipo'], default: 'relevancia' }
          },
          {
            name: 'pagina',
            in: 'query',
            description: 'Número da página',
            schema: { type: 'integer', default: 1 }
          },
          {
            name: 'limite',
            in: 'query',
            description: 'Itens por página',
            schema: { type: 'integer', default: 10 }
          }
        ],
        responses: {
          '200': {
            description: 'Resultados da busca',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/ResultadoBusca' }
                    },
                    meta: { $ref: '#/components/schemas/PaginationMeta' },
                    estatisticas: { type: 'object' },
                    sugestoes: { type: 'array', items: { type: 'string' } }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Busca'],
        summary: 'Busca avançada',
        description: 'Realizar busca avançada com filtros complexos',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/BuscaAvancadaInput' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Resultados da busca avançada',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/ResultadoBusca' }
                    },
                    meta: { $ref: '#/components/schemas/PaginationMeta' },
                    analise: { type: 'object' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/analytics': {
      get: {
        tags: ['Analytics'],
        summary: 'Obter métricas de analytics',
        description: 'Obter métricas e estatísticas de uso da plataforma',
        parameters: [
          {
            name: 'periodo',
            in: 'query',
            description: 'Período das métricas',
            schema: { type: 'string', enum: ['hoje', 'ontem', '7dias', '30dias', '90dias'], default: '7dias' }
          },
          {
            name: 'tipo',
            in: 'query',
            description: 'Tipo de métrica',
            schema: { type: 'string', enum: ['resumo', 'tempo_real', 'conteudo', 'usuarios', 'dispositivos', 'localizacao', 'conversao'], default: 'resumo' }
          },
          {
            name: 'pagina',
            in: 'query',
            description: 'Página específica',
            schema: { type: 'string' }
          },
          {
            name: 'dispositivo',
            in: 'query',
            description: 'Tipo de dispositivo',
            schema: { type: 'string', enum: ['desktop', 'mobile', 'tablet'] }
          }
        ],
        responses: {
          '200': {
            description: 'Métricas de analytics',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/MetricasAnalytics' }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Analytics'],
        summary: 'Registrar evento',
        description: 'Registrar um novo evento de analytics',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/EventoAnalyticsInput' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Evento registrado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/publicidade': {
      get: {
        tags: ['Publicidade'],
        summary: 'Obter anúncios e campanhas',
        description: 'Obter anúncios, campanhas e métricas de publicidade',
        parameters: [
          {
            name: 'tipo',
            in: 'query',
            description: 'Tipo de dados',
            schema: { type: 'string', enum: ['anuncios', 'campanhas', 'metricas', 'relatorios'], default: 'anuncios' }
          },
          {
            name: 'posicao',
            in: 'query',
            description: 'Posição do anúncio',
            schema: { type: 'string', enum: ['banner_topo', 'banner_lateral', 'banner_rodape', 'entre_conteudo', 'popup'] }
          },
          {
            name: 'categoria',
            in: 'query',
            description: 'Categoria do anúncio',
            schema: { type: 'string' }
          },
          {
            name: 'status',
            in: 'query',
            description: 'Status da campanha',
            schema: { type: 'string', enum: ['ativa', 'pausada', 'finalizada'] }
          },
          {
            name: 'periodo',
            in: 'query',
            description: 'Período para métricas',
            schema: { type: 'string', enum: ['hoje', 'ontem', '7dias', '30dias'], default: '7dias' }
          }
        ],
        responses: {
          '200': {
            description: 'Dados de publicidade',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'object' }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Publicidade'],
        summary: 'Criar campanha ou registrar evento',
        description: 'Criar nova campanha publicitária ou registrar impressão/clique',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                oneOf: [
                  { $ref: '#/components/schemas/CampanhaInput' },
                  { $ref: '#/components/schemas/AnuncioInput' },
                  { $ref: '#/components/schemas/EventoPublicidadeInput' }
                ]
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Operação realizada com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'object' },
                    message: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/concessionarias': {
      get: {
        tags: ['Concessionárias'],
        summary: 'Listar concessionárias',
        description: 'Obter lista de concessionárias com filtros e busca por proximidade',
        parameters: [
          {
            name: 'marca',
            in: 'query',
            description: 'Filtrar por marca',
            schema: { type: 'string' }
          },
          {
            name: 'cidade',
            in: 'query',
            description: 'Filtrar por cidade',
            schema: { type: 'string' }
          },
          {
            name: 'provincia',
            in: 'query',
            description: 'Filtrar por província',
            schema: { type: 'string' }
          },
          {
            name: 'servico',
            in: 'query',
            description: 'Filtrar por serviço oferecido',
            schema: { type: 'string' }
          },
          {
            name: 'verificada',
            in: 'query',
            description: 'Filtrar concessionárias verificadas',
            schema: { type: 'boolean' }
          },
          {
            name: 'destaque',
            in: 'query',
            description: 'Filtrar concessionárias em destaque',
            schema: { type: 'boolean' }
          },
          {
            name: 'latitude',
            in: 'query',
            description: 'Latitude para busca por proximidade',
            schema: { type: 'number' }
          },
          {
            name: 'longitude',
            in: 'query',
            description: 'Longitude para busca por proximidade',
            schema: { type: 'number' }
          },
          {
            name: 'raio',
            in: 'query',
            description: 'Raio em quilômetros para busca por proximidade',
            schema: { type: 'number' }
          },
          {
            name: 'busca',
            in: 'query',
            description: 'Busca textual',
            schema: { type: 'string' }
          },
          {
            name: 'pagina',
            in: 'query',
            description: 'Número da página',
            schema: { type: 'integer', default: 1 }
          },
          {
            name: 'limite',
            in: 'query',
            description: 'Itens por página',
            schema: { type: 'integer', default: 10 }
          },
          {
            name: 'ordenacao',
            in: 'query',
            description: 'Campo para ordenação',
            schema: { type: 'string', enum: ['nome', 'distancia', 'avaliacao'], default: 'nome' }
          },
          {
            name: 'direcao',
            in: 'query',
            description: 'Direção da ordenação',
            schema: { type: 'string', enum: ['asc', 'desc'], default: 'asc' }
          }
        ],
        responses: {
          '200': {
            description: 'Lista de concessionárias',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Concessionaria' }
                    },
                    meta: { $ref: '#/components/schemas/PaginationMeta' },
                    estatisticas: { $ref: '#/components/schemas/ConcessionariaEstatisticas' }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Noticia: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          titulo: { type: 'string' },
          resumo: { type: 'string' },
          conteudo: { type: 'string' },
          autor: { type: 'string' },
          categoria: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
          imagemDestaque: { type: 'string' },
          destaque: { type: 'boolean' },
          dataPublicacao: { type: 'string', format: 'date-time' },
          dataAtualizacao: { type: 'string', format: 'date-time' },
          visualizacoes: { type: 'integer' },
          curtidas: { type: 'integer' },
          comentarios: { type: 'integer' }
        }
      },
      NoticiaInput: {
        type: 'object',
        required: ['titulo', 'resumo', 'conteudo', 'autor', 'categoria'],
        properties: {
          titulo: { type: 'string' },
          resumo: { type: 'string' },
          conteudo: { type: 'string' },
          autor: { type: 'string' },
          categoria: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
          imagemDestaque: { type: 'string' },
          destaque: { type: 'boolean', default: false }
        }
      },
      Carro: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          marca: { type: 'string' },
          modelo: { type: 'string' },
          ano: { type: 'integer' },
          preco: { type: 'number' },
          moeda: { type: 'string', enum: ['AOA', 'USD', 'EUR'] },
          categoria: { type: 'string', enum: ['sedan', 'suv', 'hatchback', 'pickup', 'coupe', 'convertible', 'wagon'] },
          combustivel: { type: 'string', enum: ['gasolina', 'diesel', 'hibrido', 'eletrico'] },
          transmissao: { type: 'string', enum: ['manual', 'automatica', 'cvt'] },
          quilometragem: { type: 'number' },
          cor: { type: 'string' },
          estado: { type: 'string', enum: ['novo', 'usado', 'seminovo'] },
          localizacao: {
            type: 'object',
            properties: {
              cidade: { type: 'string' },
              provincia: { type: 'string' }
            }
          },
          especificacoes: {
            type: 'object',
            properties: {
              motor: { type: 'string' },
              potencia: { type: 'string' },
              torque: { type: 'string' },
              consumo: { type: 'string' },
              aceleracao: { type: 'string' },
              velocidadeMaxima: { type: 'string' }
            }
          },
          equipamentos: { type: 'array', items: { type: 'string' } },
          imagens: { type: 'array', items: { type: 'string' } },
          descricao: { type: 'string' },
          vendedor: {
            type: 'object',
            properties: {
              tipo: { type: 'string', enum: ['concessionaria', 'particular'] },
              nome: { type: 'string' },
              telefone: { type: 'string' },
              email: { type: 'string' },
              verificado: { type: 'boolean' }
            }
          },
          destaque: { type: 'boolean' },
          promocao: { type: 'boolean' },
          dataPublicacao: { type: 'string', format: 'date-time' },
          visualizacoes: { type: 'integer' }
        }
      },
      CarroInput: {
        type: 'object',
        required: ['marca', 'modelo', 'ano', 'preco', 'categoria', 'combustivel', 'transmissao', 'estado', 'localizacao', 'vendedor'],
        properties: {
          marca: { type: 'string' },
          modelo: { type: 'string' },
          ano: { type: 'integer' },
          preco: { type: 'number' },
          moeda: { type: 'string', enum: ['AOA', 'USD', 'EUR'], default: 'AOA' },
          categoria: { type: 'string', enum: ['sedan', 'suv', 'hatchback', 'pickup', 'coupe', 'convertible', 'wagon'] },
          combustivel: { type: 'string', enum: ['gasolina', 'diesel', 'hibrido', 'eletrico'] },
          transmissao: { type: 'string', enum: ['manual', 'automatica', 'cvt'] },
          quilometragem: { type: 'number', default: 0 },
          cor: { type: 'string' },
          estado: { type: 'string', enum: ['novo', 'usado', 'seminovo'] },
          localizacao: {
            type: 'object',
            required: ['cidade', 'provincia'],
            properties: {
              cidade: { type: 'string' },
              provincia: { type: 'string' }
            }
          },
          especificacoes: {
            type: 'object',
            properties: {
              motor: { type: 'string' },
              potencia: { type: 'string' },
              torque: { type: 'string' },
              consumo: { type: 'string' },
              aceleracao: { type: 'string' },
              velocidadeMaxima: { type: 'string' }
            }
          },
          equipamentos: { type: 'array', items: { type: 'string' } },
          imagens: { type: 'array', items: { type: 'string' } },
          descricao: { type: 'string' },
          vendedor: {
            type: 'object',
            required: ['tipo', 'nome', 'telefone', 'email'],
            properties: {
              tipo: { type: 'string', enum: ['concessionaria', 'particular'] },
              nome: { type: 'string' },
              telefone: { type: 'string' },
              email: { type: 'string' },
              verificado: { type: 'boolean', default: false }
            }
          },
          destaque: { type: 'boolean', default: false },
          promocao: { type: 'boolean', default: false }
        }
      },
      Concessionaria: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          nome: { type: 'string' },
          marca: { type: 'string' },
          endereco: { type: 'string' },
          cidade: { type: 'string' },
          provincia: { type: 'string' },
          telefone: { type: 'string' },
          email: { type: 'string' },
          website: { type: 'string', nullable: true },
          horarioFuncionamento: {
            type: 'object',
            properties: {
              segunda: { type: 'string' },
              terca: { type: 'string' },
              quarta: { type: 'string' },
              quinta: { type: 'string' },
              sexta: { type: 'string' },
              sabado: { type: 'string' },
              domingo: { type: 'string' }
            }
          },
          coordenadas: {
            type: 'object',
            properties: {
              latitude: { type: 'number' },
              longitude: { type: 'number' }
            }
          },
          servicos: { type: 'array', items: { type: 'string' } },
          avaliacoes: {
            type: 'object',
            properties: {
              media: { type: 'number' },
              total: { type: 'integer' }
            }
          },
          imagens: { type: 'array', items: { type: 'string' } },
          destaque: { type: 'boolean' },
          verificada: { type: 'boolean' },
          dataAtualizacao: { type: 'string', format: 'date-time' },
          distancia: { type: 'number', nullable: true }
        }
      },
      PaginationMeta: {
        type: 'object',
        properties: {
          total: { type: 'integer' },
          pagina: { type: 'integer' },
          limite: { type: 'integer' },
          totalPaginas: { type: 'integer' },
          temProxima: { type: 'boolean' },
          temAnterior: { type: 'boolean' }
        }
      },
      CarroEstatisticas: {
        type: 'object',
        properties: {
          total: { type: 'integer' },
          porMarca: { type: 'object' },
          porCategoria: { type: 'object' },
          porEstado: { type: 'object' },
          precoMedio: { type: 'number' }
        }
      },
      ConcessionariaEstatisticas: {
        type: 'object',
        properties: {
          total: { type: 'integer' },
          porMarca: { type: 'object' },
          porProvincia: { type: 'object' },
          verificadas: { type: 'integer' },
          avaliacaoMedia: { type: 'number' }
        }
      },
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: { type: 'string' }
        }
      },
      Calculadora: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          nome: { type: 'string' },
          descricao: { type: 'string' },
          categoria: { type: 'string' },
          url: { type: 'string' },
          icone: { type: 'string' },
          ativo: { type: 'boolean' }
        }
      },
      FinanciamentoInput: {
        type: 'object',
        required: ['valorVeiculo', 'entrada', 'prazo', 'taxaJuros'],
        properties: {
          valorVeiculo: { type: 'number' },
          entrada: { type: 'number' },
          prazo: { type: 'integer' },
          taxaJuros: { type: 'number' },
          seguro: { type: 'number' },
          taxaAdministracao: { type: 'number' }
        }
      },
      FinanciamentoResultado: {
        type: 'object',
        properties: {
          valorFinanciado: { type: 'number' },
          valorParcela: { type: 'number' },
          valorTotal: { type: 'number' },
          totalJuros: { type: 'number' },
          custoEfetivo: { type: 'number' },
          tabela: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                parcela: { type: 'integer' },
                valorParcela: { type: 'number' },
                juros: { type: 'number' },
                amortizacao: { type: 'number' },
                saldoDevedor: { type: 'number' }
              }
            }
          }
        }
      },
      ConsumoInput: {
        type: 'object',
        required: ['distancia', 'consumo', 'precoCombustivel'],
        properties: {
          distancia: { type: 'number' },
          consumo: { type: 'number' },
          precoCombustivel: { type: 'number' },
          tipoCombustivel: { type: 'string', enum: ['gasolina', 'diesel', 'etanol'] }
        }
      },
      ConsumoResultado: {
        type: 'object',
        properties: {
          litrosNecessarios: { type: 'number' },
          custoTotal: { type: 'number' },
          custoPorKm: { type: 'number' },
          economia: { type: 'object' },
          comparacao: { type: 'object' }
        }
      },
      Ferramenta: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          nome: { type: 'string' },
          descricao: { type: 'string' },
          categoria: { type: 'string' },
          url: { type: 'string' },
          icone: { type: 'string' },
          status: { type: 'string', enum: ['ativo', 'premium'] },
          popularidade: { type: 'integer' },
          tags: { type: 'array', items: { type: 'string' } },
          dataCriacao: { type: 'string', format: 'date-time' },
          dataAtualizacao: { type: 'string', format: 'date-time' }
        }
      },
      FerramentaInput: {
        type: 'object',
        required: ['nome', 'descricao', 'categoria', 'url'],
        properties: {
          nome: { type: 'string' },
          descricao: { type: 'string' },
          categoria: { type: 'string' },
          url: { type: 'string' },
          icone: { type: 'string' },
          status: { type: 'string', enum: ['ativo', 'premium'], default: 'ativo' },
          tags: { type: 'array', items: { type: 'string' } }
        }
      },
      FerramentaEstatisticas: {
        type: 'object',
        properties: {
          total: { type: 'integer' },
          porCategoria: { type: 'object' },
          porStatus: { type: 'object' },
          categorias: { type: 'array', items: { type: 'string' } }
        }
      },
      CarroComparacao: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          marca: { type: 'string' },
          modelo: { type: 'string' },
          ano: { type: 'integer' },
          preco: { type: 'number' },
          especificacoes: { type: 'object' },
          imagem: { type: 'string' }
        }
      },
      ComparacaoResultado: {
        type: 'object',
        properties: {
          carros: {
            type: 'array',
            items: { $ref: '#/components/schemas/CarroComparacao' }
          },
          analise: {
            type: 'object',
            properties: {
              preco: { type: 'object' },
              potencia: { type: 'object' },
              consumo: { type: 'object' },
              aceleracao: { type: 'object' },
              portaMalas: { type: 'object' }
            }
          },
          pontuacao: { type: 'object' },
          recomendacao: { type: 'string' }
        }
      },
      ConversaoResultado: {
        type: 'object',
        properties: {
          categoria: { type: 'string' },
          unidadeOrigem: { type: 'string' },
          unidadeDestino: { type: 'string' },
          valorOriginal: { type: 'number' },
          valorConvertido: { type: 'number' },
          formula: { type: 'string' },
          relacionadas: { type: 'array', items: { type: 'object' } },
          exemplos: { type: 'array', items: { type: 'string' } }
        }
      },
      ResultadoBusca: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          tipo: { type: 'string' },
          titulo: { type: 'string' },
          descricao: { type: 'string' },
          url: { type: 'string' },
          imagem: { type: 'string' },
          categoria: { type: 'string' },
          autor: { type: 'string' },
          dataPublicacao: { type: 'string', format: 'date-time' },
          relevancia: { type: 'number' },
          destaque: { type: 'boolean' }
        }
      },
      BuscaAvancadaInput: {
        type: 'object',
        required: ['termos'],
        properties: {
          termos: { type: 'array', items: { type: 'string' } },
          tipos: { type: 'array', items: { type: 'string' } },
          categorias: { type: 'array', items: { type: 'string' } },
          autores: { type: 'array', items: { type: 'string' } },
          dataInicio: { type: 'string', format: 'date' },
          dataFim: { type: 'string', format: 'date' },
          destaque: { type: 'boolean' },
          relevanciaMinima: { type: 'number' },
          ordenacao: { type: 'string', enum: ['relevancia', 'data', 'titulo', 'tipo'] },
          direcao: { type: 'string', enum: ['asc', 'desc'] },
          pagina: { type: 'integer', default: 1 },
          limite: { type: 'integer', default: 10 }
        }
      },
      MetricasAnalytics: {
        type: 'object',
        properties: {
          periodo: { type: 'string' },
          tipo: { type: 'string' },
          dados: { type: 'object' },
          comparacao: { type: 'object' },
          tendencias: { type: 'object' }
        }
      },
      EventoAnalyticsInput: {
        type: 'object',
        required: ['tipo', 'pagina'],
        properties: {
          tipo: { type: 'string', enum: ['pageview', 'click', 'download', 'form_submit', 'video_play', 'search'] },
          pagina: { type: 'string' },
          elemento: { type: 'string' },
          valor: { type: 'string' },
          propriedades: { type: 'object' }
        }
      },
      CampanhaInput: {
        type: 'object',
        required: ['acao', 'nome', 'dataInicio', 'dataFim', 'orcamento'],
        properties: {
          acao: { type: 'string', enum: ['criar_campanha'] },
          nome: { type: 'string' },
          descricao: { type: 'string' },
          dataInicio: { type: 'string', format: 'date' },
          dataFim: { type: 'string', format: 'date' },
          orcamento: { type: 'number' },
          publico: { type: 'object' },
          objetivos: { type: 'array', items: { type: 'string' } }
        }
      },
      AnuncioInput: {
        type: 'object',
        required: ['acao', 'campanhaId', 'titulo', 'descricao', 'url', 'posicao'],
        properties: {
          acao: { type: 'string', enum: ['criar_anuncio'] },
          campanhaId: { type: 'string' },
          titulo: { type: 'string' },
          descricao: { type: 'string' },
          url: { type: 'string' },
          imagem: { type: 'string' },
          posicao: { type: 'string', enum: ['banner_topo', 'banner_lateral', 'banner_rodape', 'entre_conteudo', 'popup'] },
          categoria: { type: 'string' },
          publico: { type: 'object' }
        }
      },
      EventoPublicidadeInput: {
        type: 'object',
        required: ['acao', 'anuncioId'],
        properties: {
          acao: { type: 'string', enum: ['impressao', 'clique'] },
          anuncioId: { type: 'string' },
          usuarioId: { type: 'string' },
          pagina: { type: 'string' },
          posicao: { type: 'string' },
          dispositivo: { type: 'string' }
        }
      }
    }
  },
  tags: [
    {
      name: 'Sistema',
      description: 'Endpoints relacionados ao sistema'
    },
    {
      name: 'Notícias',
      description: 'Gestão de notícias automotivas'
    },
    {
      name: 'Carros',
      description: 'Catálogo de veículos'
    },
    {
      name: 'Concessionárias',
      description: 'Diretório de concessionárias'
    },
    {
      name: 'Calculadoras',
      description: 'Calculadoras automotivas (financiamento, consumo, etc.)'
    },
    {
      name: 'Ferramentas',
      description: 'Ferramentas utilitárias (comparador, conversor, etc.)'
    },
    {
      name: 'Busca',
      description: 'Sistema de busca e pesquisa de conteúdo'
    },
    {
      name: 'Analytics',
      description: 'Métricas e estatísticas de uso da plataforma'
    },
    {
      name: 'Publicidade',
      description: 'Gestão de anúncios e campanhas publicitárias'
    }
  ]
}

export async function GET() {
  return NextResponse.json(swaggerSpec)
}
