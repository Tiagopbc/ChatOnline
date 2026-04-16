'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [nome, setNome] = useState('');
  const [sala, setSala] = useState('');
  const router = useRouter();

  function entrarNoChat(e) {
    e.preventDefault();

    const nomeFinal = nome.trim();
    const salaFinal = (sala.trim() || 'GERAL').toUpperCase();

    if (!nomeFinal) {
      return;
    }

    router.push(`/chat?sala=${encodeURIComponent(salaFinal)}&nome=${encodeURIComponent(nomeFinal)}`);
  }

  return (
    <main className="d-flex align-items-center justify-content-center min-vh-100 p-3 bg-midnight">
      <div className="glass-card rounded-4 p-4 p-md-5 shadow-lg w-100" style={{ maxWidth: '450px' }}>

        <div className="text-center mb-4">
          <h1 className="h2 fw-bold text-white mb-2">
            Midnight <span className="text-neon">Chat</span>
          </h1>
          <p className="text-secondary small">Comunicação em tempo real em alta velocidade.</p>
        </div>

        <form onSubmit={entrarNoChat} className="d-flex flex-column gap-3">
          <div>
            <label htmlFor="name" className="form-label text-light small fw-medium mb-1">
              Seu nome <span className="text-neon">*</span>
            </label>
            <input
              type="text"
              id="name"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="form-control glass-input rounded-3 py-2 px-3"
              placeholder="Como quer ser chamado?"
            />
          </div>

          <div>
            <label htmlFor="roomCode" className="form-label text-light small fw-medium mb-1">
              Número da sala <span className="text-secondary" style={{ fontSize: '11px' }}>(Opcional)</span>
            </label>
            <input
              type="text"
              id="roomCode"
              value={sala}
              onChange={(e) => setSala(e.target.value.toUpperCase())}
              className="form-control glass-input rounded-3 py-2 px-3"
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

        <Link
          href="/apresentacao"
          className="btn btn-outline-light rounded-3 py-3 mt-3 w-100 border-secondary-subtle"
        >
          Ver página de apresentação
        </Link>
      </div>
    </main>
  );
}
