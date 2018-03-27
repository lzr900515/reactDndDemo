import React, { Component } from 'react';
import DigestSelector from './DigestSelector';
import { Icon } from 'antd';
const style = {
  title: {
    paddingBottom: '10px',
    borderBottom: '2px solid #53688e',
    fontWeight: '700',
    fontStyle: 'normal',
    fontSize: '16px'
  },
  helpIcon:{
    color:'#8f9091',
    marginLeft:'10px',
  }
};

class DigestArea extends Component {
  constructor (props) {
    super(props);
    this.helpEvent = this.helpEvent.bind(this);
  }

  helpEvent () {
  }

  render () {
    let {digestArr,menuData,setDigest} = this.props;
    return (
      <div>
        <div style={style.title}>
          <span>摘要字段</span>
          <span onClick={this.helpEvent}><Icon style={style.helpIcon} type="question-circle"/></span>
        </div>
        <DigestSelector digestArr={digestArr} menuData={menuData} setDigest={setDigest}/>
      </div>
    );
  }
}

export default (DigestArea);
