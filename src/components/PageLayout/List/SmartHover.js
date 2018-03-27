import React, { Component, PropTypes } from 'react';
import { Icon } from 'antd';
import './SmartHover.less';

class SmartHover extends Component {

    constructor (props) {
        super(props);
    }

    render () {
        let {edit,close,style} = this.props;
        return (
            <div className="SmartHover" style={{...style}}>
                <div className="floatBtn">
                    <span onClick={ edit|| (()=>{}) }>
                        <Icon type="edit" style={{color:'white',margin:'0 8px',display:edit?'':'none'}}/>
                    </span>
                    <span onClick={ close|| (()=>{}) }>
                        <Icon type="close" style={{color:'white',margin:'0 8px',display:close?'':'none'}}/>
                    </span>
                </div>
                {this.props.children}
            </div>
        );
    }
}

export default SmartHover;
