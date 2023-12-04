import { useEffect, useState } from 'react';
import { getConfigFilePath, getRuntimePlatform } from '../modules/bridge';
import { ws } from '../modules/socket';
import { useWsOpen } from './useWs';

export function useRuntimePlatform() {
  const [platform, setPlatform] = useState<string>('bash');
  const isWsOpen = useWsOpen();

  useEffect(() => {
    const check = () => {
      getRuntimePlatform().then((rs: any) => {
        setPlatform(rs);
      });
    };
    if (ws.connected || isWsOpen) {
      check();
    }
  }, [isWsOpen]);

  return { platform };
}

export function useConfigPath() {
  const [configFilePath, setConfigFilePath] = useState<string>('');

  const getConfigPath = () => {
    getConfigFilePath().then((rs) => {
      setConfigFilePath(rs as string);
    });
  };

  useEffect(() => {
    getConfigPath();
  }, []);

  return { configFilePath };
}
