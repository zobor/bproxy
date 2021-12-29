import classnames from "classnames";
import { read } from "fs";
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
    setTimeout(() => {
      setReady(true);
    }, 500);
  };
  useEffect(() => {
    setReady(false);
  }, [src]);


  return <>
    {ready ? null : <Spin style={{ marginTop: 20 }} />}
    <img onLoad={onload} style={{visibility: ready ? 'visible': 'hidden'}} className={classnames({
      [classNames]: classNames,
      ['animate__animated animate__zoomIn']: ready,
    })} src={src} />
  </>
}
