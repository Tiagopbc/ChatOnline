import Link from 'next/link';

const palavrasReservadas = new Set([
  'async',
  'await',
  'const',
  'default',
  'export',
  'function',
  'if',
  'return',
]);

const valoresEspeciais = new Set(['false', 'null', 'true', 'undefined']);

function tokenizarLinha(linha) {
  const tokens = [];
  let indice = 0;

  while (indice < linha.length) {
    const trechoAtual = linha.slice(indice);

    const espacos = trechoAtual.match(/^\s+/);
    if (espacos) {
      tokens.push({ tipo: 'plain', valor: espacos[0] });
      indice += espacos[0].length;
      continue;
    }

    const comentario = trechoAtual.match(/^\/\/.*/);
    if (comentario) {
      tokens.push({ tipo: 'comment', valor: comentario[0] });
      break;
    }

    const texto = trechoAtual.match(/^`(?:\\.|[^`])*`|^"(?:\\.|[^"])*"|^'(?:\\.|[^'])*'/);
    if (texto) {
      tokens.push({ tipo: 'string', valor: texto[0] });
      indice += texto[0].length;
      continue;
    }

    const operadorComposto = trechoAtual.match(/^(===|!==|=>|\|\||&&|<=|>=|==|!=)/);
    if (operadorComposto) {
      tokens.push({ tipo: 'operator', valor: operadorComposto[0] });
      indice += operadorComposto[0].length;
      continue;
    }

    const numero = trechoAtual.match(/^\d+/);
    if (numero) {
      tokens.push({ tipo: 'number', valor: numero[0] });
      indice += numero[0].length;
      continue;
    }

    const pontuacao = trechoAtual.match(/^[{}()[\].,;:?]/);
    if (pontuacao) {
      tokens.push({ tipo: 'punctuation', valor: pontuacao[0] });
      indice += pontuacao[0].length;
      continue;
    }

    const operador = trechoAtual.match(/^[=+\-*/%<>!]/);
    if (operador) {
      tokens.push({ tipo: 'operator', valor: operador[0] });
      indice += operador[0].length;
      continue;
    }

    const identificador = trechoAtual.match(/^[A-Za-z_$][\w$]*/);
    if (identificador) {
      const valor = identificador[0];
      const ultimoCaractereAntes = linha.slice(0, indice).trimEnd().at(-1);
      const proximoCaractere = trechoAtual.slice(valor.length).trimStart().at(0);
      let tipo = 'plain';

      if (palavrasReservadas.has(valor)) {
        tipo = 'keyword';
      } else if (valoresEspeciais.has(valor)) {
        tipo = 'literal';
      } else if (ultimoCaractereAntes === '.') {
        tipo = 'method';
      } else if (proximoCaractere === '(') {
        tipo = 'function';
      } else if (valor.startsWith('set')) {
        tipo = 'function';
      }

      tokens.push({ tipo, valor });
      indice += valor.length;
      continue;
    }

    tokens.push({ tipo: 'plain', valor: linha[indice] });
    indice += 1;
  }

  return tokens;
}

function BlocoDeCodigo({ codigo }) {
  const linhas = codigo.trim().split('\n');

  return (
    <div className="code-window">
      <div className="code-window-bar">
        <div className="d-flex align-items-center gap-2">
          <span className="code-dot code-dot-red"></span>
          <span className="code-dot code-dot-yellow"></span>
          <span className="code-dot code-dot-green"></span>
        </div>
        <span className="code-window-title">JavaScript</span>
      </div>

      <div className="code-window-body">
        {linhas.map((linha, indice) => (
          <div key={`${indice}-${linha}`} className="code-line">
            <span className="code-line-number">{String(indice + 1).padStart(2, '0')}</span>
            <span className="code-line-content">
              {tokenizarLinha(linha).map((token, tokenIndex) => (
                <span key={`${indice}-${tokenIndex}`} className={`code-token code-token-${token.tipo}`}>
                  {token.valor}
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const tecnologias = [
  {
    nome: 'Next.js',
    descricao: 'Organiza as páginas do projeto e facilita a navegação entre a home, o chat e a apresentação.',
  },
  {
    nome: 'React',
    descricao: 'Controla os estados da tela, como nome, sala, lista de mensagens e campo de nova mensagem.',
  },
  {
    nome: 'Supabase',
    descricao: 'Guarda as mensagens no banco e atualiza o chat em tempo real quando uma nova mensagem é enviada.',
  },
  {
    nome: 'Bootstrap',
    descricao: 'Ajuda a montar o layout com rapidez, usando grid, botões, espaçamentos e responsividade.',
  },
];

const etapas = [
  {
    titulo: '1. Entrada do usuário',
    descricao: 'Na tela inicial, o usuário digita o nome e a sala. Se não informar sala, usamos GERAL.',
  },
  {
    titulo: '2. Validação da rota',
    descricao: 'A página do chat verifica se nome e sala chegaram corretamente. Se não chegaram, volta para a home.',
  },
  {
    titulo: '3. Leitura das mensagens',
    descricao: 'Quando a sala abre, buscamos no Supabase todas as mensagens já salvas daquela sala.',
  },
  {
    titulo: '4. Tempo real',
    descricao: 'Depois da busca inicial, o projeto fica ouvindo novas mensagens para atualizar a tela automaticamente.',
  },
];

const arquivos = [
  {
    caminho: 'src/app/page.js',
    motivo: 'Mostra a entrada do usuário e o redirecionamento para o chat.',
  },
  {
    caminho: 'src/app/chat/page.js',
    motivo: 'Mostra a validação dos parâmetros antes de abrir a sala.',
  },
  {
    caminho: 'src/app/chat/ChatRoom.jsx',
    motivo: 'É o coração do projeto: busca mensagens, escuta o tempo real e envia novas mensagens.',
  },
  {
    caminho: 'src/lib/supabase.js',
    motivo: 'Explica como o sistema se conecta ao banco de dados.',
  },
];

const trechos = [
  {
    titulo: 'Tela inicial',
    explicacao: 'Esse trecho mostra como os dados são preparados antes de entrar no chat.',
    codigo: `function entrarNoChat(e) {
  e.preventDefault();

  const nomeFinal = nome.trim();
  const salaFinal = (sala.trim() || 'GERAL').toUpperCase();

  if (!nomeFinal) return;

  router.push(\`/chat?sala=\${encodeURIComponent(salaFinal)}&nome=\${encodeURIComponent(nomeFinal)}\`);
}`,
  },
  {
    titulo: 'Validação da página do chat',
    explicacao: 'Aqui a rota confere se recebeu os dados corretos.',
    codigo: `export default async function ChatPage({ searchParams }) {
  const busca = await searchParams;

  const sala = typeof busca.sala = = = 'string' ? busca.sala.trim().toUpperCase() : '';
  const nome = typeof busca.nome = = = 'string' ? busca.nome.trim() : '';

  if (!sala || !nome) {
    redirect('/');
  }
}`,
  },
  {
    titulo: 'Busca e atualização em tempo real',
    explicacao: 'Esse é o trecho mais importante para explicar o funcionamento do chat.',
    codigo: `useEffect(() => {
  async function buscarMensagens() {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('room_code', sala)
      .order('created_at', { ascending: true });

    if (data) setMensagens(data);
  }

  buscarMensagens();

  const channel = supabase
    .channel(\`room_\${sala}\`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: \`room_code=eq.\${sala}\` }, (payload) => {
      setMensagens((listaAtual) => [...listaAtual, payload.new]);
    })
    .subscribe();

  return () => supabase.removeChannel(channel);
}, [sala]);`,
  },
];

export const metadata = {
  title: 'Apresentação | Midnight Chat',
  description: 'Página de apoio para apresentar o projeto Midnight Chat.',
};

export default function ApresentacaoPage() {
  return (
    <main
      className="min-vh-100 bg-midnight text-white py-4 py-md-5"
      style={{
        backgroundImage:
          'radial-gradient(circle at top left, rgba(34, 211, 238, 0.18), transparent 35%), radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.16), transparent 30%)',
      }}
    >
      <div className="container" style={{ maxWidth: '1100px' }}>
        <section className="glass-card rounded-4 p-4 p-md-5 mb-4 mb-md-5 shadow-lg">
          <div className="row g-4 align-items-center">
            <div className="col-lg-8">
              <span className="text-uppercase small fw-semibold text-neon">Projeto Programação para Wweb</span>
              <h1 className="display-5 fw-bold mt-2 mb-3">Midnight Chat</h1>
              <p className="fs-5 text-light-emphasis mb-3">
                Um chat em tempo real feito para demonstrar navegação, estado, integração com banco de dados
                e atualização instantânea de mensagens.
              </p>

            </div>

            <div className="col-lg-4">
              <div
                className="rounded-4 p-4 h-100"
                style={{
                  background: 'rgba(2, 6, 23, 0.55)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                }}
              >
                <p className="small text-secondary text-uppercase fw-semibold mb-3">Resumo rápido</p>
                <div className="d-flex flex-column gap-3">
                  <div>
                    <div className="text-neon fw-semibold">Objetivo</div>
                    <div className="text-light">Permitir conversa por salas em tempo real.</div>
                  </div>
                  <div>
                    <div className="text-neon fw-semibold">Destaque técnico</div>
                    <div className="text-light">Supabase Realtime + App Router do Next.js.</div>
                  </div>
                  <div>
                    <div className="text-neon fw-semibold">Estrutura</div>
                    <div className="text-light">Home, validação da rota, sala do chat e conexão com banco.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex flex-column flex-sm-row gap-3 mt-4">
            <Link href="/" className="btn btn-neon rounded-3 px-4 py-3">
              Abrir chat
            </Link>
            <a href="#codigo" className="btn btn-outline-light rounded-3 px-4 py-3 border-secondary-subtle">
              Ver trechos do código
            </a>
          </div>
        </section>

        <section className="mb-4 mb-md-5">
          <div className="d-flex justify-content-between align-items-end mb-3">
            <div>
              <p className="text-neon text-uppercase small fw-semibold mb-1">Tecnologias</p>
              <h2 className="h3 fw-bold mb-0">O que usamos no projeto</h2>
            </div>
          </div>

          <div className="row g-3">
            {tecnologias.map((tecnologia) => (
              <div key={tecnologia.nome} className="col-md-6 col-xl-3">
                <div className="glass-card rounded-4 p-4 h-100">
                  <h3 className="h5 fw-bold mb-2">{tecnologia.nome}</h3>
                  <p className="text-secondary mb-0">{tecnologia.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-4 mb-md-5">
          <div className="mb-3">
            <p className="text-neon text-uppercase small fw-semibold mb-1">Fluxo</p>
            <h2 className="h3 fw-bold mb-0">Como o sistema funciona</h2>
          </div>

          <div className="row g-3">
            {etapas.map((etapa) => (
              <div key={etapa.titulo} className="col-md-6">
                <div className="glass-card rounded-4 p-4 h-100">
                  <h3 className="h5 fw-bold mb-2">{etapa.titulo}</h3>
                  <p className="text-secondary mb-0">{etapa.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-4 mb-md-5">
          <div className="mb-3">
            <p className="text-neon text-uppercase small fw-semibold mb-1">Apresentação</p>
            <h2 className="h3 fw-bold mb-0">Arquivos e suas funções principais</h2>
          </div>

          <div className="row g-3">
            {arquivos.map((arquivo) => (
              <div key={arquivo.caminho} className="col-md-6">
                <div className="glass-card rounded-4 p-4 h-100">
                  <div className="small text-neon fw-semibold mb-2">{arquivo.caminho}</div>
                  <p className="text-secondary mb-0">{arquivo.motivo}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="codigo" className="mb-4 mb-md-5">
          <div className="mb-3">
            <p className="text-neon text-uppercase small fw-semibold mb-1">Código</p>
            <h2 className="h3 fw-bold mb-0">Trechos do código</h2>
          </div>

          <div className="d-flex flex-column gap-4">
            {trechos.map((trecho) => (
              <article key={trecho.titulo} className="glass-card rounded-4 p-4">
                <h3 className="h5 fw-bold mb-2">{trecho.titulo}</h3>
                <p className="text-secondary mb-3">{trecho.explicacao}</p>
                <BlocoDeCodigo codigo={trecho.codigo} />
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
