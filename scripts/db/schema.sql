-- Esquema inicial do banco de dados Auto Prestige
-- Nenhuma seed é criada. Apenas tabelas e índices.

-- EXTENSÕES (opcional)
-- CREATE EXTENSION IF NOT EXISTS pgcrypto; -- para gen_random_uuid()

-- NOTICIAS
CREATE TABLE IF NOT EXISTS noticias (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  titulo TEXT NOT NULL,
  resumo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  categoria TEXT NOT NULL,
  autor TEXT NOT NULL,
  data_publicacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  imagem TEXT,
  destaque BOOLEAN NOT NULL DEFAULT FALSE,
  visualizacoes INTEGER NOT NULL DEFAULT 0,
  fonte TEXT,
  link TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_noticias_categoria ON noticias (categoria);
CREATE INDEX IF NOT EXISTS idx_noticias_autor ON noticias (autor);
CREATE INDEX IF NOT EXISTS idx_noticias_destaque ON noticias (destaque);
CREATE INDEX IF NOT EXISTS idx_noticias_data_publicacao ON noticias (data_publicacao DESC);

CREATE TABLE IF NOT EXISTS noticia_imagens (
  id BIGSERIAL PRIMARY KEY,
  noticia_id BIGINT NOT NULL REFERENCES noticias(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  legenda TEXT
);

-- ARTIGOS
CREATE TABLE IF NOT EXISTS artigos (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  titulo TEXT NOT NULL,
  resumo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  autor TEXT NOT NULL,
  data_publicacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  categoria TEXT NOT NULL,
  tempo_leitura TEXT,
  imagem TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  specs JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_artigos_categoria ON artigos (categoria);
CREATE INDEX IF NOT EXISTS idx_artigos_data_publicacao ON artigos (data_publicacao DESC);

CREATE TABLE IF NOT EXISTS artigo_imagens (
  id BIGSERIAL PRIMARY KEY,
  artigo_id BIGINT NOT NULL REFERENCES artigos(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  legenda TEXT
);

-- VIDEOS
CREATE TABLE IF NOT EXISTS videos (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  conteudo_detalhado TEXT,
  autor TEXT NOT NULL,
  data_publicacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  categoria TEXT,
  duracao TEXT,
  visualizacoes INTEGER NOT NULL DEFAULT 0,
  likes INTEGER NOT NULL DEFAULT 0,
  video_url TEXT NOT NULL,
  thumbnail TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_videos_categoria ON videos (categoria);
CREATE INDEX IF NOT EXISTS idx_videos_data_publicacao ON videos (data_publicacao DESC);

-- TEST DRIVES
CREATE TABLE IF NOT EXISTS test_drives (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  veiculo TEXT NOT NULL,
  marca TEXT NOT NULL,
  categoria TEXT,
  nota REAL,
  preco TEXT,
  resumo TEXT NOT NULL,
  conteudo_completo TEXT,
  pontos_favoraveis TEXT[] NOT NULL DEFAULT '{}',
  pontos_negativos TEXT[] NOT NULL DEFAULT '{}',
  avaliacoes JSONB,
  especificacoes JSONB,
  data_publicacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  autor TEXT,
  imagem TEXT,
  destaque BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS test_drive_imagens (
  id BIGSERIAL PRIMARY KEY,
  test_drive_id BIGINT NOT NULL REFERENCES test_drives(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  legenda TEXT
);

-- Status de publicação para conteúdos
ALTER TABLE noticias ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'published';
ALTER TABLE artigos ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'published';
ALTER TABLE videos ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'published';
ALTER TABLE test_drives ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'published';

-- PARTNERS
CREATE TABLE IF NOT EXISTS partners (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  website TEXT,
  address TEXT,
  city TEXT,
  province TEXT,
  logo TEXT,
  join_date DATE,
  last_activity TIMESTAMPTZ,
  rating REAL DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  vehicles_listed INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  total_sales NUMERIC DEFAULT 0,
  revenue NUMERIC DEFAULT 0,
  commission REAL DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  description TEXT,
  specialties TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_partners_type ON partners (type);
CREATE INDEX IF NOT EXISTS idx_partners_status ON partners (status);
CREATE INDEX IF NOT EXISTS idx_partners_province ON partners (province);

-- CONCESSIONARIAS
CREATE TABLE IF NOT EXISTS concessionarias (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  marca TEXT,
  endereco TEXT,
  cidade TEXT,
  provincia TEXT,
  telefone TEXT,
  email TEXT,
  website TEXT,
  horario_funcionamento JSONB,
  coordenadas JSONB,
  servicos TEXT[] NOT NULL DEFAULT '{}',
  avaliacoes JSONB,
  imagens TEXT[] NOT NULL DEFAULT '{}',
  destaque BOOLEAN DEFAULT FALSE,
  verificada BOOLEAN DEFAULT FALSE,
  data_atualizacao TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_concessionarias_marca ON concessionarias (marca);
CREATE INDEX IF NOT EXISTS idx_concessionarias_cidade ON concessionarias (cidade);
CREATE INDEX IF NOT EXISTS idx_concessionarias_provincia ON concessionarias (provincia);

-- NEWSLETTER
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CONTATOS
CREATE TABLE IF NOT EXISTS contatos (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT,
  email TEXT,
  telefone TEXT,
  categoria TEXT,
  prioridade TEXT,
  mensagem TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'novo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SOLICITACOES
CREATE TABLE IF NOT EXISTS solicitacoes (
  id BIGSERIAL PRIMARY KEY,
  tipo TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'novo',
  dados JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PUBLICIDADE: CAMPANHAS
CREATE TABLE IF NOT EXISTS advertising_campaigns (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  client TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  start_date DATE,
  end_date DATE,
  budget NUMERIC,
  targeting JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_advertising_campaigns_status ON advertising_campaigns (status);
CREATE INDEX IF NOT EXISTS idx_advertising_campaigns_dates ON advertising_campaigns (start_date, end_date);

-- PUBLICIDADE: ANÚNCIOS
CREATE TABLE IF NOT EXISTS advertising_ads (
  id BIGSERIAL PRIMARY KEY,
  campaign_id BIGINT REFERENCES advertising_campaigns(id) ON DELETE SET NULL,
  titulo TEXT NOT NULL,
  url TEXT NOT NULL,
  formato TEXT,
  posicao TEXT CHECK (posicao IN ('top','middle','bottom','sidebar')),
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  imagem TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_advertising_ads_posicao ON advertising_ads (posicao);
CREATE INDEX IF NOT EXISTS idx_advertising_ads_ativo ON advertising_ads (ativo);
CREATE INDEX IF NOT EXISTS idx_advertising_ads_campaign ON advertising_ads (campaign_id);

-- PUBLICIDADE: EVENTOS (IMPRESSÕES/CLICKS)
CREATE TABLE IF NOT EXISTS advertising_events (
  id BIGSERIAL PRIMARY KEY,
  ad_id BIGINT NOT NULL REFERENCES advertising_ads(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('impression','click')),
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  meta JSONB
);

CREATE INDEX IF NOT EXISTS idx_advertising_events_type ON advertising_events (event_type);
CREATE INDEX IF NOT EXISTS idx_advertising_events_time ON advertising_events (occurred_at DESC);
