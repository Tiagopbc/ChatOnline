import { Suspense } from 'react';
import ChatRoom from './ChatRoom';

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-vh-100 bg-midnight d-flex align-items-center justify-content-center">
        <div className="spinner-border text-neon" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    }>
      <ChatRoom />
    </Suspense>
  );
}
