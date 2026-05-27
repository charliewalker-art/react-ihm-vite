import { useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_URL = 'http://localhost:8080/ws';

export const useWebSocket = (onMessage: () => void) => {
  const clientRef = useRef<Client | null>(null);
  // on stabilise la référence pour éviter les reconnexions inutiles
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  const stableOnMessage = useCallback(() => {
    onMessageRef.current();
  }, []);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000, // reconnexion auto si coupure réseau
      onConnect: () => {
        client.subscribe('/topic/commandes', () => {
          stableOnMessage();
        });
      },
      onDisconnect: () => {
        console.log('[WebSocket] Déconnecté');
      },
      onStompError: (frame) => {
        console.error('[WebSocket] Erreur STOMP :', frame);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [stableOnMessage]);
};