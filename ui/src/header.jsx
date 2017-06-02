import React from 'react'
import Filter from './filter.jsx'

class Header extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="form-inline filter-control">
        <div className="form-group" >
          <Filter msg={this.props.msg}/>
        </div>
      </div>
    );
  }
}

export default Header;