import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import { useState } from 'react';
import { getDebugTargets } from '../modules/bridge';
import {
  onDebuggerClientChange,
  onDebuggerClientChangeUnmount,
} from '../modules/socket';

export default function useWerine() {
  const [clients, setClients] = useState<any>({});

  useEffect(() => {
    const getClients = () => {
      getDebugTargets().then((weinreClients: any) => {
        if (!isEmpty(weinreClients)) {
          setClients(weinreClients);
        } else {
          setClients({});
        }
      });
    };
    onDebuggerClientChange(getClients);
    getClients();

    return () => {
      onDebuggerClientChangeUnmount(getClients);
    };
  }, []);

  return {
    clients,
  };
}
