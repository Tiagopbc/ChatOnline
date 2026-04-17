'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function ChatRoom({ sala, nome }) {
  const router = useRouter();
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const fimDasMensagensRef = useRef(null);

  useEffect(() => {
    async function buscarMensagens() {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('room_code', sala)
        .order('created_at', { ascending: true });

      if (data) {
        setMensagens(data);
      }
    }

    buscarMensagens();

    const channel = supabase
      .channel(`room_${sala}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_code=eq.${sala}`,
        },
        (payload) => {
          setMensagens((listaAtual) => [...listaAtual, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sala]);

  useEffect(() => {
    fimDasMensagensRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  async function enviarMensagem(e) {
    e.preventDefault();
    const conteudo = novaMensagem.trim();

    if (!conteudo) {
      return;
    }

    setNovaMensagem('');

    await supabase.from('messages').insert({
      room_code: sala,
      user_name: nome,
      content: conteudo,
    });
  }

  return (
    <div className="bg-midnight vh-100 d-flex flex-column align-items-center overflow-hidden py-1 py-md-4 px-1 px-md-3">

      <div className="w-100 h-100 d-flex flex-column glass-card rounded-md-4 shadow-lg overflow-hidden" style={{ maxWidth: '900px' }}>

        <header className="p-3 px-4 border-bottom border-secondary d-flex justify-content-between align-items-center text-white" style={{ backgroundColor: 'rgba(2, 6, 23, 0.4)' }}>
          <div>
            <h5 className="m-0 fw-bold">Sala <span className="text-neon">#{sala}</span></h5>
            <small className="text-secondary">Conectado como <span className="text-light">{nome}</span></small>
          </div>
          <button onClick={() => router.push('/')} className="btn btn-sm btn-outline-secondary text-light border-0">
            Sair da sala
          </button>
        </header>

        <main className="flex-grow-1 overflow-auto p-3 p-md-4 d-flex flex-column gap-3">
          {mensagens.length === 0 ? (
            <div className="h-100 d-flex flex-column align-items-center justify-content-center text-secondary">
              <div className="fs-1 mb-2">👋</div>
              <p>Nenhuma mensagem trocada ainda.</p>
            </div>
          ) : (
            mensagens.map((mensagem) => {
              const ehMinha = mensagem.user_name === nome;
              return (
                <div key={mensagem.id} className={`d-flex flex-column ${ehMinha ? 'align-items-end' : 'align-items-start'}`}>
                  <small className="text-secondary fw-semibold mb-1 px-1" style={{ fontSize: '10px' }}>{mensagem.user_name}</small>
                  <div className={`px-3 py-2 text-break ${ehMinha ? 'message-mine' : 'message-other'}`} style={{ maxWidth: '85%' }}>
                    <p className="m-0 mb-1" style={{ fontSize: '15px' }}>{mensagem.content}</p>
                    <div className="text-end" style={{ fontSize: '10px', opacity: 0.7 }}>
                      {new Date(mensagem.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={fimDasMensagensRef} style={{ height: '1px' }}></div>
        </main>

        <footer className="p-3 border-top border-secondary" style={{ backgroundColor: 'rgba(2, 6, 23, 0.6)' }}>
          <form onSubmit={enviarMensagem} className="d-flex gap-2">
            <input
              type="text"
              value={novaMensagem}
              onChange={(e) => setNovaMensagem(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="form-control glass-input rounded-3"
            />
            <button type="submit" disabled={!novaMensagem.trim()} className="btn btn-neon rounded-3 px-3 px-md-4 d-flex align-items-center justify-content-center">
              Enviar
            </button>
          </form>
        </footer>

      </div>
    </div>
  );
}
