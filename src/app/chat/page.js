import { redirect } from 'next/navigation';
import ChatRoom from './ChatRoom';

export default async function ChatPage({ searchParams }) {
  const busca = await searchParams;

  const sala = typeof busca.sala === 'string' ? busca.sala.trim().toUpperCase() : '';

  if (!sala) {
    redirect('/');
  }

  return <ChatRoom sala={sala} />;
}
