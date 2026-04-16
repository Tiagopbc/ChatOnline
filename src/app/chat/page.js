import { redirect } from 'next/navigation';
import ChatRoom from './ChatRoom';

export default async function ChatPage({ searchParams }) {
  const busca = await searchParams;

  const sala = typeof busca.sala === 'string' ? busca.sala.trim().toUpperCase() : '';
  const nome = typeof busca.nome === 'string' ? busca.nome.trim() : '';

  if (!sala || !nome) {
    redirect('/');
  }

  return <ChatRoom sala={sala} nome={nome} />;
}
