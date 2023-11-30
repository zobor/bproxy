import React, { MouseEventHandler } from 'react';
import classnames from 'classnames';
import './index.scss';

const assetpath = './assets/';
const Icons = (import.meta as any).importGlob('./assets/*.svg', { eager: true });

export const iconTypeList = Object.keys(Icons).map((path: string) => path.replace(/\.\/assets\/(\S+)\.svg/, '$1'));

interface IconProps {
  type: keyof typeof Icons;
  className?: Record<string, any>;
  onClick?: MouseEventHandler<HTMLElement>;
}

function Icon(props: IconProps) {
  const { type, className = {}, onClick = () => {} } = props;
  const Com: any = Icons[`${assetpath}${type.toString()}.svg`];

  return (
    <i
      className={classnames({
        'bp-icon': true,
        ...className,
        [`icon-${type.toString()}`]: true,
      })}
      onClick={onClick}
    >
      {Com?.default ? <Com.default /> : null}
    </i>
  );
}

export default Icon;
