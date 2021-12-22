import { useEffect, useState } from "react";
import { Spin } from "../UI";

interface ImageProps {
  classNames: string;
  src: string;
}

export default (props: ImageProps) => {
  const { src, classNames } = props;
  const [ready, setReady] = useState<boolean>(false);
  const onload = () => {
    setReady(true);
  };
  return <>
    {ready ? null : <Spin style={{ marginTop: 20 }} />}
    <img onLoad={onload} style={{visibility: ready ? 'visible': 'hidden'}} className={classNames} src={src} />
  </>
}
