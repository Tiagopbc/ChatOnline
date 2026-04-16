'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const router = useRouter();

  const handleJoin = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    // Define uma sala padrão caso o usuário não informe
    const finalRoom = roomCode.trim() || 'GERAL';
    
    // Repassa os dados por URL params
    router.push(`/chat?room=${encodeURIComponent(finalRoom)}&name=${encodeURIComponent(name.trim())}`);
  };

  return (
    <main className="d-flex align-items-center justify-content-center min-vh-100 p-3 bg-midnight">
      <div className="glass-card rounded-4 p-4 p-md-5 shadow-lg w-100" style={{ maxWidth: '450px' }}>
        
        <div className="text-center mb-4">
          <h1 className="h2 fw-bold text-white mb-2">
            Midnight <span className="text-neon">Chat</span>
          </h1>
          <p className="text-secondary small">Comunicação em tempo real em alta velocidade.</p>
        </div>

        <form onSubmit={handleJoin} className="d-flex flex-column gap-3">
          <div>
            <label htmlFor="name" className="form-label text-light small fw-medium mb-1">
              Seu nome <span className="text-neon">*</span>
            </label>
            <input
              type="text"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control glass-input rounded-3 py-2 px-3"
              placeholder="Como quer ser chamado?"
            />
          </div>

          <div>
            <label htmlFor="roomCode" className="form-label text-light small fw-medium mb-1">
              Código da sala <span className="text-secondary" style={{fontSize: '11px'}}>(Opcional)</span>
            </label>
            <input
              type="text"
              id="roomCode"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="form-control glass-input rounded-3 py-2 px-3 text-uppercase"
              placeholder="Ex: TURMA01"
            />
          </div>

          <button
            type="submit"
            className="btn btn-neon rounded-3 py-3 mt-3 w-100"
          >
            Entrar no Chat
          </button>
        </form>
      </div>
    </main>
  );
}
