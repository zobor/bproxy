import { useState } from "react";

export default (defaultState: boolean) => {
  const [state, setState] = useState<boolean>(defaultState || false);
  const toggle = () => {
    setState(pre => !pre);
  };
  const ok = () => {
    setState(true);
  };
  const no = () => {
    setState(false);
  };

  return { toggle, state, ok, no };
};
