import React, { Component, PropTypes } from 'react';
import { Row, Col, Modal, Icon, Tabs } from 'antd';
import SmartHover from '../List/SmartHover';
import _ from 'lodash';
import Element from '../../DragAndDrop/PageLayout/Element';
import Detail from './Detail';
import Record from './Record';
import Comment from './Comment';
import ObjectSummary from './ObjectSummary';
import File from './File';
import Schedule from './Schedule';
import WorkFlow from './WorkFlow';
import Tab from './Tab';
import Relative from './Relative';

const TabPane = Tabs.TabPane;
class DragImgMap extends Component {

    constructor (props) {
        super(props);
    }

    elementRender () {
        let {type} = this.props;
        console.log(type);
        switch (type) {
            case 'Detail':
                return (type);
            case 'ObjectSummary':
                return (type);
            case 'Comment':
                return (<Comment/>);
            case 'Record':
                return (<Record/>);
            case 'File':
                return (<File/>);
            case 'Schedule':
                return (<Schedule/>);
            case 'WorkFlow':
                return (<WorkFlow/>);
            case 'Relative':
                return  (<Relative/>);
            case 'Tab':
                return (type);
            default:
                return (type);
        }
    }

    render () {
        return (
            <div>
                {this.elementRender()}
            </div>
        );
    }
}

export default DragImgMap;
