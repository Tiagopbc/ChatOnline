import Link from 'next/link';

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

  const sala = typeof busca.sala === 'string' ? busca.sala.trim().toUpperCase() : '';
  const nome = typeof busca.nome === 'string' ? busca.nome.trim() : '';

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
                <pre
                  className="mb-0"
                  style={{
                    background: 'rgba(2, 6, 23, 0.78)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '1rem',
                    color: '#dbeafe',
                    fontFamily: 'var(--font-geist-mono), monospace',
                    fontSize: '0.9rem',
                    overflowX: 'auto',
                    padding: '1rem',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  <code>{trecho.codigo}</code>
                </pre>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-card rounded-4 p-4 p-md-5">
          <div className="row g-4">
            <div className="col-lg-7">
              <p className="text-neon text-uppercase small fw-semibold mb-1">Fala sugerida</p>
              <h2 className="h3 fw-bold mb-3">Resumo para falar ao professor</h2>
              <p className="text-secondary mb-3">
                Este projeto é um chat em tempo real feito com Next.js, React e Supabase. Primeiro, o
                usuário informa o nome e a sala. Depois, o sistema valida esses dados e abre a sala do chat.
              </p>
              <p className="text-secondary mb-0">
                Dentro da sala, as mensagens são buscadas no banco de dados e o Supabase Realtime atualiza a
                interface automaticamente quando uma nova mensagem é enviada. Assim, o chat funciona sem precisar
                recarregar a página.
              </p>
            </div>

            <div className="col-lg-5">
              <div
                className="rounded-4 p-4 h-100"
                style={{
                  background: 'rgba(2, 6, 23, 0.55)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                }}
              >
                <p className="small text-secondary text-uppercase fw-semibold mb-3">Ordem sugerida</p>
                <div className="d-flex flex-column gap-3">
                  <div>1. Mostrar a home.</div>
                  <div>2. Explicar o envio de nome e sala.</div>
                  <div>3. Abrir a sala do chat.</div>
                  <div>4. Mostrar o trecho do tempo real.</div>
                  <div>5. Concluir com o papel do Supabase.</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
