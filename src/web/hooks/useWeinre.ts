import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import { useState } from 'react';
import { getDebugTargets } from '../modules/bridge';
import { onDebuggerClientChange } from '../modules/socket';

export default function useWerine(updateFlag?: any) {
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
    const evt$ = onDebuggerClientChange(getClients);
    getClients();

    return () => {
      evt$.unsubscribe();
    };
  }, [updateFlag]);

  return {
    clients,
  };
}
