'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function ChatRoom() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const room = searchParams.get('room');
  const name = searchParams.get('name');

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Redireciona usuários intrusos que não preencheram nome na tela inicial
  useEffect(() => {
    if (!name || !room) router.replace('/');
  }, [name, room, router]);

  // Núcleo de Comunicação: Carregamento do Histórico e Conexão em Tempo Real
  useEffect(() => {
    if (!room) return;

    // 1. Busca todas as mensagens estáticas que já existem no Banco de Dados
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('room_code', room)
        .order('created_at', { ascending: true });
        
      if (data) setMessages(data);
    };

    fetchMessages();

    // 2. Abre uma linha de escuta de WebSockets via Realtime
    // Toda vez que alguém no mundo inserir uma mensagem no banco, a tela atualiza!
    const channel = supabase
      .channel(`room_${room}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_code=eq.${room}` }, (payload) => {
          setMessages((current) => [...current, payload.new]); // Adiciona mensagem que acabou de chegar
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [room]);

  // Empurra a tela para baixo automaticamente a cada mensagem nova
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Função disparada ao clicar no botão Enviar (ou apertar enter)
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageText = newMessage.trim();
    setNewMessage(''); // Limpa o input instantaneamente para dar sensação de velocidade
    
    // 3. Salva a nova mensagem no banco e deixa o Supabase disparar o Realtime pros outros
    await supabase.from('messages').insert([
      { room_code: room, user_name: name, content: messageText }
    ]);
  };

  if (!name || !room) return null;

  return (
    <div className="bg-midnight vh-100 d-flex flex-column align-items-center overflow-hidden py-1 py-md-4 px-1 px-md-3">
      
      <div className="w-100 h-100 d-flex flex-column glass-card rounded-md-4 shadow-lg overflow-hidden" style={{ maxWidth: '900px' }}>
        
        {/* Cabecalho Superior */}
        <header className="p-3 px-4 border-bottom border-secondary d-flex justify-content-between align-items-center text-white" style={{ backgroundColor: 'rgba(2, 6, 23, 0.4)' }}>
          <div>
            <h5 className="m-0 fw-bold">Sala <span className="text-neon">#{room.toUpperCase()}</span></h5>
            <small className="text-secondary">Conectado como <span className="text-light">{name}</span></small>
          </div>
          <button onClick={() => router.push('/')} className="btn btn-sm btn-outline-secondary text-light border-0">
            Sair da sala
          </button>
        </header>

        {/* Área de rolagem com todas as mensagens */}
        <main className="flex-grow-1 overflow-auto p-3 p-md-4 d-flex flex-column gap-3">
          {messages.length === 0 ? (
            <div className="h-100 d-flex flex-column align-items-center justify-content-center text-secondary">
              <div className="fs-1 mb-2">👋</div>
              <p>Nenhuma mensagem trocada ainda.</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.user_name === name;
              return (
                <div key={msg.id} className={`d-flex flex-column ${isMine ? 'align-items-end' : 'align-items-start'}`}>
                  <small className="text-secondary fw-semibold mb-1 px-1" style={{ fontSize: '10px' }}>{msg.user_name}</small>
                  <div className={`px-3 py-2 text-break ${isMine ? 'message-mine' : 'message-other'}`} style={{ maxWidth: '85%' }}>
                    <p className="m-0 mb-1" style={{ fontSize: '15px' }}>{msg.content}</p>
                    <div className="text-end" style={{ fontSize: '10px', opacity: 0.7 }}>
                      {new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} style={{ height: '1px' }}></div>
        </main>

        {/* Formulário Fixo no rodapé para envio de Chat */}
        <footer className="p-3 border-top border-secondary" style={{ backgroundColor: 'rgba(2, 6, 23, 0.6)' }}>
          <form onSubmit={handleSendMessage} className="d-flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="form-control glass-input rounded-3"
            />
            <button type="submit" disabled={!newMessage.trim()} className="btn btn-neon rounded-3 px-3 px-md-4 d-flex align-items-center justify-content-center">
              Enviar
            </button>
          </form>
        </footer>

      </div>
    </div>
  );
}
