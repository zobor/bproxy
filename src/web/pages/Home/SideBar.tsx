import classNames from 'classnames';
import React, { useCallback, useContext } from 'react';
import Icon from '../../components/Icon';
import Shortcuts from '../../components/Shortcuts';
import { Tooltip } from '../../components/UI';
import { UseSubject } from '../../hooks/useSubject';
import { Ctx } from '../ctx';
import './SideBar.scss';

export default function Sidebar() {
  const { state, dispatch } = useContext(Ctx);
  const { fixedToTableBottom } = state;
  const rx$ = UseSubject();
  const onClickScrollTop = () => {
    // {behavior: "smooth", block: "end", inline: "nearest"}
    document.querySelector('.table tbody tr:first-child')?.scrollIntoView();
  };
  const onClickScrollBottom = () => {
    document.querySelector('.table tbody tr:last-child')?.scrollIntoView();
  };
  const onClickLockScroll = useCallback(() => {
    dispatch({
      type: 'setFixedToTableBottom',
      fixedToTableBottom: !fixedToTableBottom,
    });
  }, [fixedToTableBottom]);
  const onClickShowShortcut = () => {
    rx$.next({ type: 'on-show-shortcut' });
  };

  return (
    <div className="HomeSideBar">
      <Tooltip title="滚动到顶部" placement="left">
        <div className="sidebar-item" onClick={onClickScrollTop}>
          <Icon type="scrollTop" />
        </div>
      </Tooltip>
      <Tooltip title="锁定滚动" placement="left">
        <div
          className={classNames({
            'sidebar-item': true,
            actived: fixedToTableBottom,
          })}
          onClick={onClickLockScroll}
        >
          <Icon type={fixedToTableBottom ? 'lock' : 'unlock'} />
        </div>
      </Tooltip>
      <Tooltip title="快捷键" placement="left">
        <div className="sidebar-item" onClick={onClickShowShortcut}>
          <Icon type="shortcut" />
        </div>
      </Tooltip>
      <Tooltip title="滚动到底部" placement="left">
        <div className="sidebar-item" onClick={onClickScrollBottom}>
          <Icon type="scrollBottom" />
        </div>
      </Tooltip>
      <Shortcuts />
    </div>
  );
}
