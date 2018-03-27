import React, { Component, PropTypes } from 'react';
import DragItem from './DragItem';

const listStyle = {
  width: '150px',
  padding: '10px',
  float: 'left',
  // textAlign:'center',
  backgroundColor:'white',
  height: '600px',
  overflow: 'auto',
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)"
};
class DragList extends Component {

  constructor (props) {
    super(props);
  }

  renderListArray (listArray) {
    return listArray.map(function (item, index) {
      return (
        <DragItem detail={item} key={index} type={'DragItem'}
                  generateUUID={this.props.generateUUID}
                  changeTempCard={this.props.changeTempCard}
                  delTempCard={this.props.delTempCard}
                  addGroup={this.props.addGroup}//TODO 临时待删除
        />
      );
    },this);
  }

  render () {
    let {listArray} = this.props;
    return (
      <div style={listStyle}>
        {this.renderListArray(listArray)}
      </div>
    );
  }
}

export default DragList;
