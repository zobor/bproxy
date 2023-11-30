import { useEffect, useRef } from 'react';
import { getVersion } from '../modules/bridge';

// 上报版本号
export function useUmamiInitReport(isReady: boolean) {
  const $hasReport = useRef(false);
  useEffect(() => {
    if (isReady && !$hasReport.current && (window as any).umami) {
      getVersion().then((v: any) => {
        $hasReport.current = true;
        (window as any).umami(`v${v}`);
      });
    }
  }, [isReady]);
}
