/**
 * Created by lizeren on 17/10/12.
 */
import React, { Component, PropTypes } from 'react';
import { Row, Col, Modal, Icon, Input, Radio, message } from 'antd';
import _ from 'lodash';
import { findDOMNode } from 'react-dom';
import { DropTarget, DragSource } from 'react-dnd';
import update from 'react/lib/update';
import generateUUID from '../../../utils/generateUUID';

const RadioGroup = Radio.Group;

const dropSetting = {
    type: ['TabElement'],
    spec: {
        canDrop(props, monitor){
        },
        hover(props, monitor, component) {
            const dragIndex = monitor.getItem().index;
            const hoverIndex = props.index;
            const defaultActiveKey = props.defaultActiveKey;
            if (dragIndex === hoverIndex) {
                return;
            }
            const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            if (dragIndex == defaultActiveKey) {
                props.setDefaultActiveKey(hoverIndex);
            } else if (hoverIndex == defaultActiveKey) {
                props.setDefaultActiveKey(dragIndex);
            }
            props.moveTabElement(dragIndex, hoverIndex);
            monitor.getItem().index = hoverIndex;
        },
        drop(props, monitor, component) {
            return {
                ...props,
                dropType: 'TabElement',
            };
        }
    },
    collect(connect, monitor){
        return {
            // Call this function inside render()
            // to let React DnD handle the drag events:
            connectDropTarget: connect.dropTarget(),
            // You can ask the monitor about the current drag state:
            isOver: monitor.isOver(),
            isOverCurrent: monitor.isOver({shallow: true}),
            canDrop: monitor.canDrop(),
            itemType: monitor.getItemType()
        };
    },
};
const dragSetting = {
    type: 'TabElement',
    spec: {
        beginDrag(props) {
            return {
                ...props,
                dragType: 'TabElement',
            };
        },
        endDrag(props, monitor){
            const dropResult = monitor.getDropResult();
        },
        //重写isDragging方法，用于判断当前拖拽的元素
        isDragging (props, monitor) {
            return props.uuid == monitor.getItem().uuid;
        }
    },
    collect(connect, monitor){
        return {
            connectDragSource: connect.dragSource(),
            isDragging: monitor.isDragging(),
            connectDragPreview: connect.dragPreview(),
        };
    },
};
class TabElement extends Component {
    constructor (props) {
        super(props);
    }

    render () {
        let {connectDragPreview, connectDragSource, connectDropTarget, isDragging} = this.props;
        let opacity = isDragging ? 0.2 : 1;//拖拽时为透明，不拖拽时完全不透明
        return connectDragPreview(connectDropTarget(
            <div style={{opacity}}>
                <Row style={{height: '40px'}}>
                    {connectDragSource(<div><Col span={2}
                                                 style={{lineHeight: '32px', fontSize: '28px', textAlign: 'left'}}>
                        <Icon type="bars"/>
                    </Col></div>)}
                    {this.props.children}
                </Row>
            </div>
        ));
    }
}
TabElement = DropTarget(dropSetting.type, dropSetting.spec, dropSetting.collect)(TabElement);
TabElement = DragSource(dragSetting.type, dragSetting.spec, dragSetting.collect)(TabElement);

class TabsSetModal extends Component {

    constructor (props) {
        super(props);
        this.renderSelect = this.renderSelect.bind(this);
        this.addTab = this.addTab.bind(this);
        this.delTab = this.delTab.bind(this);
        this.setTabName = this.setTabName.bind(this);
        this.changeDefaultTap = this.changeDefaultTap.bind(this);
        this.moveTabElement = this.moveTabElement.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.setDefaultActiveKey = this.setDefaultActiveKey.bind(this);

        this.state = {
            // visible: true,
            tabList: [],
            defaultActiveKey: 0,
        };
    }

    componentWillMount () {
        this.setState({
            tabList: this.props.tabList ? _.cloneDeep(this.props.tabList) : [],
            defaultActiveKey: ~~this.props.defaultActiveKey,
        });
    }

    componentWillReceiveProps (nextProps) {
        if (!_.isEqual(this.props.tabList, nextProps.tabList)) {
            this.setState({
                tabList: _.cloneDeep(nextProps.tabList),
            });
        }
        if (!_.isEqual(this.props.defaultActiveKey, nextProps.defaultActiveKey)) {
            this.setState({
                defaultActiveKey: ~~nextProps.defaultActiveKey,
            });
        }
    }

    changeDefaultTap (e) {
        this.setState({
            defaultActiveKey: e.target.value,
        });
    }

    setDefaultActiveKey (val) {
        this.setState({
            defaultActiveKey: val,
        });
    }

    addTab () {
        let {tabList} = this.state;
        if (tabList.length < 24) {
            tabList.push({
                'title': '选项卡' + (tabList.length + 1),
                'uuid': generateUUID(),
                'content': [],
            });
            this.setState({tabList});
        } else {
            message.warning('最多24个标签页!');
        }
    }

    moveTabElement (dragIndex, hoverIndex) {
        const {tabList} = this.state;
        const dragTabElement = tabList[dragIndex];

        this.setState(
            update(this.state, {
                tabList: {
                    $splice: [[dragIndex, 1], [hoverIndex, 0, dragTabElement]],
                },
            }),
        );
    }

    delTab (index) {
        let {tabList, defaultActiveKey} = this.state;
        tabList.splice(index, 1);
        this.setState({tabList, defaultActiveKey: 0});
    }

    setTabName (e, index) {
        const {value} = e.target;
        let {tabList} = this.state;
        tabList[index].title = value;
        this.setState({tabList});
    }

    onCancel () {
        this.setState({
            tabList: _.cloneDeep(this.props.tabList),
        });
        this.props.onCancel();
    }

    renderSelect () {
        let {tabList, defaultActiveKey} = this.state;
        let jsxDOM = [];
        let _this = this;
        tabList.forEach(function (item, i, arr) {
            jsxDOM.push(
                <TabElement index={i} key={i} moveTabElement={_this.moveTabElement} uuid={item.uuid}
                            defaultActiveKey={defaultActiveKey} setDefaultActiveKey={_this.setDefaultActiveKey}>
                    <Col span={2} style={{lineHeight: '32px', textAlign: 'left'}}>
                        <Radio value={i}></Radio>
                    </Col>
                    <Col span={8}>
                        <Input
                            type="text"
                            className="ant-input-lg"
                            placeholder=""
                            value={item.title}
                            onChange={(e) => {_this.setTabName(e, i);}}
                        />
                    </Col>
                    <Col span={2} style={{
                        lineHeight: '32px',
                        fontSize: '24px',
                        textAlign: 'center',
                        display: arr.length > 1 ? 'initial' : 'none'
                    }}>
                        <Icon
                            className="dynamic-delete-button"
                            type="minus-circle-o"
                            onClick={() => _this.delTab(i)}
                            // key={\"_remove"}
                        />
                    </Col>
                </TabElement>
            );
        });
        return jsxDOM;
    }

    render () {
        let {visible, onOk} = this.props;
        let {tabList, defaultActiveKey} = this.state;
        return (
            <Modal title={'组件-选项卡'} visible={visible} onOk={() => onOk(tabList, defaultActiveKey)}
                   onCancel={this.onCancel}>
                <Row>
                    <Col span={4} style={{lineHeight: '32px', textAlign: 'left', color: '#609bff'}}>
                        选项卡设置
                    </Col>
                    <Col span={8} style={{lineHeight: '32px', textAlign: 'left'}}>
                        最多24个标签页
                    </Col>
                </Row>
                <div style={{margin: '10px 0px'}}>
                    <Row>
                        <Col span={2} style={{lineHeight: '32px', textAlign: 'left'}}>
                            排序
                        </Col>
                        <Col span={2} style={{lineHeight: '32px', textAlign: 'left'}}>
                            默认
                        </Col>
                        <Col span={8} style={{lineHeight: '32px', textAlign: 'left'}}>
                            标签名
                        </Col>
                    </Row>
                    <RadioGroup style={{display: 'initial'}} value={defaultActiveKey} onChange={this.changeDefaultTap}>
                        {this.renderSelect()}
                    </RadioGroup>
                </div>
                <Row>
                    <Col span={4} onClick={this.addTab}
                         style={{lineHeight: '32px', textAlign: 'left', color: '#609bff'}}>
                        + 添加标签页
                    </Col>
                </Row>
            </Modal>
        );
    }
}

export default TabsSetModal;
