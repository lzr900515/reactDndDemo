import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import 'moment/locale/zh-cn';

class Description extends Component {
    constructor (props) {
        super(props);
        this.state = {};
        this.initJSX = this.initJSX.bind(this);
    }

    initJSX () {
        let {type, subType, extendInfo} = this.props;
        let jsxDOM = null;
        if (subType == 'Org' || subType == 'User' || subType == 'Short' || subType == 'Long' || type == 'Select'
            || type == 'Lookup' || type == 'Aggregation' || type == 'MultiSelect' || type == 'DynamicLookup' ||
            type == 'AutoCode' || type == 'BizType' || type == 'MainDetail') {
            jsxDOM = <span>示例：{extendInfo}</span>;
        } else if (subType == 'Phone') {
            jsxDOM = <span>18800000000</span>;
        } else if (subType == 'Email') {
            jsxDOM = <span>demo@hecom.cn</span>;
        } else if (type == 'Integer') {
            jsxDOM = <span>99</span>;
        } else if (type == 'Real') {
            jsxDOM = <span>0.99</span>;
        } else if (type == 'Percent') {
            jsxDOM = <span>99.99%</span>;
        } else if (type == 'Currency') {
            jsxDOM = <span>999,999.99元</span>;
        } else if (type == 'Date') {
            jsxDOM = <span>{moment(Date.parse(new Date())).format('YYYY-MM-DD')}</span>;
        } else if (type == 'Time') {
            jsxDOM = <span>{moment(Date.parse(new Date())).format('YYYY-MM-DD HH:MM')}</span>;
        } else if (type == 'District') {
            jsxDOM = <span>北京市，海淀区</span>;
        } else if (type == 'Location') {
            jsxDOM = <span>北京西城区新街口外大街甲14号十月大厦</span>;
        } else if (subType == 'URL') {
            jsxDOM = <span>http://www.demo.cn</span>;
        } else if (subType == 'Image') {
            jsxDOM = <span>示例图片</span>;
        } else if (subType == 'Boolean') {
            jsxDOM = <span>是</span>;
        } else {
            jsxDOM = <span>{type} {subType}</span>
        }
        return jsxDOM;
    }

    render () {
        return (
            <div>{this.initJSX()}</div>
        );
    }
}
export default (Description);
