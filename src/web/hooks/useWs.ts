import { useEffect, useState } from 'react';
import { checkProxy } from '../modules/bridge';
import { ws } from '../modules/socket';
import useBool from './useBool';

export function useWsOpen() {
  const [isOpen, setIsOpen] = useState<boolean>(ws.connected);

  useEffect(() => {
    if (ws.connected) {
      setIsOpen(true);
      return;
    }
    const open$ = ws.on('open', () => {
      setIsOpen(true);
    });

    return () => {
      open$.unsubscribe();
    };
  }, []);

  return isOpen;
}

export default function useSystemProxyOpen() {
  const { state, ok, no } = useBool(false);
  const isOpen = useWsOpen();

  useEffect(() => {
    if (isOpen) {
      checkProxy().then((isProxyOpen) => {
        if (isProxyOpen) {
          ok();
        } else {
          no();
        }
      });
    }
  }, [isOpen]);

  return { state };
}
