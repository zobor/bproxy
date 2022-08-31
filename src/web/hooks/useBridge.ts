import { useEffect, useState } from 'react';
import { getRuntimePlatform } from '../modules/bridge';

export function useRuntimePlatform() {
  const [platform, setPlatform] = useState<string>('bash');

  useEffect(() => {
    getRuntimePlatform().then((rs: any) => {
      setPlatform(rs);
    });
  }, []);

  return { platform };
}
