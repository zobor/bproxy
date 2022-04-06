import { useState } from 'react';
import { shorthand } from '../../modules/util';
import { Tooltip } from '../UI';

export default function ViewAll(props: {
  limit?: number;
  children: string;
  tooltip?: boolean;
}) {
  const { children, limit, tooltip } = props;
  const [showAll, setShowAll] = useState<boolean>(false);
  const max = limit || 30;
  const onClick = () => {
    setShowAll((pre) => !pre);
  };

  return (
    <span onClick={onClick}>
      {showAll ? (
        children
      ) : tooltip || tooltip === undefined && children && children.length >= max ? (
        <Tooltip overlayStyle={{ minWidth: 550, textAlign: 'center' }} title={<div style={{ width: 500, textAlign: 'center' }}>{children}</div>}>
          {shorthand(children, parseInt(`${max / 2}`, 10), max)}
        </Tooltip>
      ) : (
        shorthand(children, parseInt(`${max / 2}`, 10), max)
      )}
    </span>
  );
}
