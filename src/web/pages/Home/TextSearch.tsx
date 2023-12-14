import React, { useContext } from 'react';
import './TextSearch.scss';
import { Ctx } from '../ctx';
import classNames from 'classnames';

export default function TextSearch() {
  const { state, dispatch } = useContext(Ctx);
  const { textSearch } = state;
  const onClose = () => dispatch({ type: 'setShowTextSearch', showTextSearch: false });
  const onKeyUp = (e) => {
    switch (e.keyCode) {
      // 回车
      case 13:
        dispatch({ type: 'setTextSearch', textSearch: e.target.value.trim() });
        dispatch({ type: 'setShowTextSearch', showTextSearch: false });
        break;
      // ESC
      case 27:
        dispatch({ type: 'setShowTextSearch', showTextSearch: false });
      default:
        break;
    }
  };

  if (!state.showTextSearch) {
    return null;
  }

  return (
    <div className={classNames('text-search', {
      show: state.showTextSearch
    })}>
      <div className="text-search-mask" onClick={onClose} />
      <input placeholder="输入你要搜索的响应文本，按回车确认" defaultValue={textSearch} autoFocus onKeyUp={onKeyUp} />
    </div>
  );
}
