-- Seed de dados para apresentação Auto Prestige
-- Idempotente para conteúdos com slug único e parceiros por email

-- VÍDEOS
INSERT INTO videos (slug, titulo, descricao, autor, categoria, duracao, video_url, thumbnail, tags, status)
VALUES
  (
    'apresentacao-auto-prestige-plataforma',
    'Apresentação da Plataforma Auto Prestige',
    'Conheça os recursos principais da Auto Prestige para o mercado automóvel.',
    'Auto Prestige',
    'Apresentação',
    '03:12',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    ARRAY['plataforma','apresentacao','auto-prestige']::text[],
    'published'
  ),
  (
    'analise-mercado-automovel-2025',
    'Análise do Mercado Automóvel 2025',
    'Tendências, crescimento e perspectivas para o setor em Angola.',
    'Equipe Auto Prestige',
    'Mercado',
    '08:45',
    'https://www.youtube.com/watch?v=3GwjfUFyY6M',
    'https://img.youtube.com/vi/3GwjfUFyY6M/hqdefault.jpg',
    ARRAY['mercado','analise','2025']::text[],
    'published'
  )
ON CONFLICT (slug) DO UPDATE SET
  titulo = EXCLUDED.titulo,
  descricao = EXCLUDED.descricao,
  autor = EXCLUDED.autor,
  categoria = EXCLUDED.categoria,
  duracao = EXCLUDED.duracao,
  video_url = EXCLUDED.video_url,
  thumbnail = EXCLUDED.thumbnail,
  tags = EXCLUDED.tags,
  status = EXCLUDED.status,
  updated_at = NOW();

-- ARTIGOS
INSERT INTO artigos (slug, titulo, resumo, conteudo, autor, categoria, imagem, tags, status)
VALUES
  (
    'como-escolher-seu-primeiro-carro',
    'Como escolher seu primeiro carro',
    'Guia prático para a primeira compra de veículo em Angola.',
    'Neste artigo abordamos orçamento, financiamento, inspeção e negociações com concessionárias.',
    'Equipe Auto Prestige',
    'Guia',
    '/uploads/image/guia-primeiro-carro.jpg',
    ARRAY['guia','compra','carro']::text[],
    'published'
  ),
  (
    'top-10-suvs-para-familia-em-angola',
    'Top 10 SUVs para família em Angola',
    'Lista comentada com foco em segurança, conforto e custo-benefício.',
    'Selecionamos SUVs com bom espaço interno, manutenção acessível e desempenho equilibrado.',
    'Redação Auto Prestige',
    'Listas',
    '/uploads/image/top10-suvs.jpg',
    ARRAY['lista','suv','familia']::text[],
    'published'
  )
ON CONFLICT (slug) DO UPDATE SET
  titulo = EXCLUDED.titulo,
  resumo = EXCLUDED.resumo,
  conteudo = EXCLUDED.conteudo,
  autor = EXCLUDED.autor,
  categoria = EXCLUDED.categoria,
  imagem = EXCLUDED.imagem,
  tags = EXCLUDED.tags,
  status = EXCLUDED.status,
  updated_at = NOW();

-- NOTÍCIAS
INSERT INTO noticias (slug, titulo, resumo, conteudo, categoria, autor, imagem, destaque, fonte, link, tags, status)
VALUES
  (
    'lancamento-nova-geracao-sedan',
    'Lançamento: nova geração de sedan chega ao mercado angolano',
    'Modelo traz segurança avançada e menor consumo de combustível.',
    'A nova geração apresenta pacote tecnológico completo, incluindo assistentes de condução e conectividade.',
    'Mercado',
    'Redação Auto Prestige',
    '/uploads/image/sedan-lancamento.jpg',
    TRUE,
    'Assessoria da Marca',
    'https://fabricante.example/novo-sedan',
    ARRAY['lancamento','sedan','mercado']::text[],
    'published'
  ),
  (
    'parceria-auto-prestige-concessionarias',
    'Auto Prestige firma parceria com rede de concessionárias',
    'Acordo amplia ofertas e benefícios aos leitores e clientes.',
    'Com a parceria, usuários terão acesso a promoções exclusivas e melhor atendimento.',
    'Parcerias',
    'Equipe Auto Prestige',
    '/uploads/image/parceria-auto-prestige.jpg',
    FALSE,
    'Auto Prestige',
    'https://autoprestige.example/parceria',
    ARRAY['parceria','concessionarias','beneficios']::text[],
    'published'
  )
ON CONFLICT (slug) DO UPDATE SET
  titulo = EXCLUDED.titulo,
  resumo = EXCLUDED.resumo,
  conteudo = EXCLUDED.conteudo,
  categoria = EXCLUDED.categoria,
  autor = EXCLUDED.autor,
  imagem = EXCLUDED.imagem,
  destaque = EXCLUDED.destaque,
  fonte = EXCLUDED.fonte,
  link = EXCLUDED.link,
  tags = EXCLUDED.tags,
  status = EXCLUDED.status,
  updated_at = NOW();

-- PARTNERS
INSERT INTO partners (name, type, status, email, phone, website, address, city, province, logo, join_date, verified, featured, description, specialties)
VALUES
  (
    'AutoLuanda', 'dealer', 'active', 'contato@autoluanda.ao', '+244 923 000 001', 'https://autoluanda.ao',
    'Av. Deolinda Rodrigues, 100', 'Luanda', 'Luanda', '/uploads/image/autoluanda.png', CURRENT_DATE - INTERVAL '90 days', TRUE, TRUE,
    'Concessionária com portfólio completo e atendimento premium.', ARRAY['vendas','financiamento']::text[]
  ),
  (
    'Benguela Motors', 'service', 'active', 'info@benguelamotors.ao', '+244 923 000 002', 'https://benguelamotors.ao',
    'Rua 15 de Agosto, 45', 'Benguela', 'Benguela', '/uploads/image/benguela-motors.png', CURRENT_DATE - INTERVAL '120 days', TRUE, FALSE,
    'Oficina autorizada e serviços de manutenção preventiva.', ARRAY['servicos','pecas']::text[]
  ),
  (
    'Segura Angola', 'insurance', 'active', 'comercial@segura.ao', '+244 923 000 003', 'https://segura.ao',
    'Rua Rainha Ginga, 12', 'Lubango', 'Huíla', '/uploads/image/segura.png', CURRENT_DATE - INTERVAL '60 days', FALSE, FALSE,
    'Seguradora parceira com planos acessíveis.', ARRAY['seguros','assistencia']::text[]
  )
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  status = EXCLUDED.status,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  province = EXCLUDED.province,
  logo = EXCLUDED.logo,
  join_date = EXCLUDED.join_date,
  verified = EXCLUDED.verified,
  featured = EXCLUDED.featured,
  description = EXCLUDED.description,
  specialties = EXCLUDED.specialties,
  updated_at = NOW();

-- Fim do seed
