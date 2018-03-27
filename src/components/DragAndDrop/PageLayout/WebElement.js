import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DropTarget, DragSource } from 'react-dnd';

const dropSetting = {
    type: ['Element', 'DragMenu'],
    spec: {
        canDrop(props, monitor){
        },
        hover(props, monitor, component) {
            // return;
            let dragItem = monitor.getItem();
            let hoverItem = props.detail;
            let hoverCoordinate = props.coordinate;
            //hover自身不做处理
            const clientOffset = monitor.getClientOffset();
            let toDataSource = props.dataSource[props.areaIndex].componentArea;
            if (dragItem.detail.uuid == hoverItem.uuid) {
                return;
            }
            const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            if (dragItem.dragType == 'DragMenu') {
                //拖拽元素为Tab选项卡是，默认添加到最后，且只能存在一个选项卡。
                if (dragItem.detail.name == 'Tab') {
                    if (toDataSource.length && toDataSource[props.dataSource.length - 1].type == 'Tab') {
                        return;
                    } else {
                        let addItem = {
                            type: dragItem.detail.name,
                            uuid: dragItem.detail.uuid,
                            appName: dragItem.detail.appName,
                            temp: true,
                            defaultActiveKey: 0,
                            subComponent: [{
                                'title': '选项卡1',
                                'content': []
                            }, {
                                'title': '选项卡2',
                                'content': []
                            }, {
                                'title': '选项卡3',
                                'content': []
                            }],
                        };
                        toDataSource.push(addItem);
                        dragItem.areaIndex = props.areaIndex;
                        dragItem.dragType = 'Tab';
                        props.setComponentArea(props.dataSource);
                        return;
                    }
                }
                //如果要添加的元素为摘要字段，则不做添加。（再要字段默认已经添加进容器，且只能出现一次，所以不需要添加）
                if (dragItem.detail.name == 'ObjectSummary') {
                    return;
                }
                let addItem = {
                    type: dragItem.detail.name,
                    uuid: dragItem.detail.uuid,
                    appName: dragItem.detail.appName,
                    temp: true,
                };
                if (dragItem.detail.name == 'Relative') {
                    addItem.id = dragItem.detail.id;
                    //默认配置数据
                    addItem.displayFields = ['name', 'createdOn', 'owner'];
                    addItem.displayNum = 0;
                    addItem.displayInWeb = false;
                    addItem.displayInMobile = false;
                    addItem.sortBy = 'createdOn';
                    addItem.sortOrder = 'desc';
                    // addItem.metaName = dragItem.detail.metaName;
                } else if (dragItem.detail.name == 'GroupDetail') {
                    addItem.groupIndex = 0;//默认使用详细资料的第一个分组
                }
                if (hoverCoordinate[0] == 'mainArea') {
                    if (hoverClientY < hoverMiddleY) {// 在上面添加
                        toDataSource.splice(hoverCoordinate[1], 0, addItem);
                        dragItem.coordinate = ['mainArea', hoverCoordinate[1]];
                        dragItem.areaIndex = props.areaIndex;
                        dragItem.dragType = 'Element';
                    } else {//在下面添加
                        toDataSource.splice(hoverCoordinate[1] + 1, 0, addItem);
                        dragItem.coordinate = ['mainArea', hoverCoordinate[1] + 1];
                        dragItem.areaIndex = props.areaIndex;
                        dragItem.dragType = 'Element';
                    }
                } else if (hoverCoordinate[0] == 'Tab') {
                    let tabList = toDataSource[toDataSource.length - 1].subComponent[hoverCoordinate[1]].content;
                    if (hoverClientY < hoverMiddleY) {// 在上面添加
                        tabList.splice(hoverCoordinate[2], 0, addItem);
                        dragItem.coordinate = ['Tab', hoverCoordinate[1], hoverCoordinate[2]];
                        dragItem.areaIndex = props.areaIndex;
                        dragItem.dragType = 'Element';
                    } else {//在下面添加
                        tabList.splice(hoverCoordinate[2] + 1, 0, addItem);
                        dragItem.coordinate = ['Tab', hoverCoordinate[1], hoverCoordinate[1] + 1];
                        dragItem.areaIndex = props.areaIndex;
                        dragItem.dragType = 'Element';
                    }
                }
                props.setComponentArea(props.dataSource);
            } else if (dragItem.dragType == 'Element') {
                let fromAreaIndex = dragItem.areaIndex;
                let fromDataSource = props.dataSource[fromAreaIndex].componentArea;
                let toAreaIndex = props.areaIndex;
                let toDataSource = props.dataSource[toAreaIndex].componentArea;
                let movingItem = {};
                if (fromAreaIndex != toAreaIndex) {
                    let dragCoordinate = dragItem.coordinate;
                    if (hoverCoordinate[0] == 'mainArea' && dragCoordinate[0] == 'mainArea') {
                        // mainArea ==> mainArea
                        let hoverIndex = hoverCoordinate[1];
                        let dragIndex = dragCoordinate[1];
                        movingItem = fromDataSource.splice(dragIndex, 1)[0];
                        if (hoverClientY < hoverMiddleY) {// 在上面添加
                            toDataSource.splice(hoverIndex, 0, movingItem);
                            dragItem.coordinate = ['mainArea', hoverIndex];
                            dragItem.areaIndex = props.areaIndex;
                        } else {//在下面添加
                            toDataSource.splice(hoverIndex + 1, 0, movingItem);
                            dragItem.coordinate = ['mainArea', hoverIndex + 1];
                            dragItem.areaIndex = props.areaIndex;
                        }
                    } else if (hoverCoordinate[0] == 'Tab' && dragCoordinate[0] == 'mainArea') {
                        // mainArea ==> Tab
                        let tabDataSource = toDataSource[toDataSource.length - 1];
                        let toActiveKey = isNaN(tabDataSource.activeKey) ? 0 : tabDataSource.activeKey;
                        let toTabList = tabDataSource.subComponent[toActiveKey].content;
                        movingItem = fromDataSource.splice(dragCoordinate[1], 1)[0];
                        if (hoverClientY < hoverMiddleY) {// 在上面添加
                            toTabList.splice(hoverCoordinate[2], 0, movingItem);
                            dragItem.coordinate = ['Tab', toActiveKey, hoverCoordinate[2]];
                            dragItem.areaIndex = props.areaIndex;
                        } else {//在下面添加
                            toTabList.splice(hoverCoordinate[2] + 1, 0, movingItem);
                            dragItem.coordinate = ['Tab', toActiveKey, hoverCoordinate[2] + 1];
                            dragItem.areaIndex = props.areaIndex;
                        }
                    } else if (hoverCoordinate[0] == 'mainArea' && dragCoordinate[0] == 'Tab') {
                        // Tab ==> mainArea
                        let tabDataSource = fromDataSource[fromDataSource.length - 1];
                        let fromActiveKey = isNaN(tabDataSource.activeKey) ? 0 : tabDataSource.activeKey;
                        let fromTabList = tabDataSource.subComponent[fromActiveKey].content;
                        movingItem = fromTabList.splice(dragCoordinate[2], 1)[0];
                        if (hoverClientY < hoverMiddleY) {// 在上面添加
                            toDataSource.splice(hoverCoordinate[1], 0, movingItem);
                            dragItem.coordinate = ['mainArea', hoverCoordinate[1]];
                            dragItem.areaIndex = props.areaIndex;
                        } else {//在下面添加
                            toDataSource.splice(hoverCoordinate[1] + 1, 0, movingItem);
                            dragItem.coordinate = ['mainArea', hoverCoordinate[1] + 1];
                            dragItem.areaIndex = props.areaIndex;
                        }
                    } else if (hoverCoordinate[0] == 'Tab' && dragCoordinate[0] == 'Tab') {
                        // Tab ==> Tab
                        let fromTabDataSource = fromDataSource[fromDataSource.length - 1];
                        let fromActiveKey = isNaN(fromTabDataSource.activeKey) ? 0 : fromTabDataSource.activeKey;
                        let fromTabList = fromTabDataSource.subComponent[fromActiveKey].content;
                        let toTabDataSource = toDataSource[toDataSource.length - 1];
                        let toActiveKey = isNaN(toTabDataSource.activeKey) ? 0 : toTabDataSource.activeKey;
                        let toTabList = toTabDataSource.subComponent[toActiveKey].content;
                        movingItem = fromTabList.splice(dragCoordinate[2], 1)[0];
                        if (hoverClientY < hoverMiddleY) {// 在上面添加
                            toTabList.splice(hoverCoordinate[2], 0, movingItem);
                            dragItem.coordinate = ['Tab', toActiveKey, hoverCoordinate[2]];
                            dragItem.areaIndex = props.areaIndex;
                        } else {//在下面添加
                            toTabList.splice(hoverCoordinate[2] + 1, 0, movingItem);
                            dragItem.coordinate = ['Tab', toActiveKey, hoverCoordinate[2] + 1];
                            dragItem.areaIndex = props.areaIndex;
                        }
                    }
                } else {
                    let dragCoordinate = dragItem.coordinate;
                    if (hoverCoordinate[0] == dragCoordinate[0]) {//非跨容器拖拽
                        if (hoverCoordinate[0] == 'mainArea') {
                            let dragIndex = dragItem.coordinate[1];
                            let hoverIndex = hoverCoordinate[1];
                            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                                return;
                            }
                            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                                return;
                            }
                            let tempItem = fromDataSource[dragIndex];
                            fromDataSource[dragIndex] = fromDataSource[hoverIndex];
                            fromDataSource[hoverIndex] = tempItem;
                            monitor.getItem().coordinate[1] = hoverIndex;
                        } else {
                            let tabList = fromDataSource[fromDataSource.length - 1].subComponent[hoverCoordinate[1]].content;
                            let dragIndex = dragItem.coordinate[2];
                            let hoverIndex = hoverCoordinate[2];
                            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                                return;
                            }
                            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                                return;
                            }
                            let tempItem = tabList[dragIndex];
                            tabList[dragIndex] = tabList[hoverIndex];
                            tabList[hoverIndex] = tempItem;
                            monitor.getItem().coordinate[2] = hoverIndex;
                        }
                    } else {//跨容器拖拽
                        let tabDataSource = fromDataSource[fromDataSource.length - 1];
                        let activeKey = isNaN(tabDataSource.activeKey) ? 0 : tabDataSource.activeKey;
                        let tabList = tabDataSource.subComponent[activeKey].content;
                        let addItem = {};
                        //tab => mainArea
                        if (hoverCoordinate[0] == 'mainArea') {
                            tabList.some(function (item, i) {
                                if (item.uuid == dragItem.detail.uuid) {
                                    addItem = tabList.splice(i, 1)[0];
                                    return true;
                                } else {
                                    return false;
                                }
                            });
                            if (hoverClientY < hoverMiddleY) {// 在上面添加
                                fromDataSource.splice(hoverCoordinate[1], 0, addItem);
                                dragItem.coordinate = ['mainArea', hoverCoordinate[1]];
                            } else {//在下面添加
                                fromDataSource.splice(hoverCoordinate[1] + 1, 0, addItem);
                                dragItem.coordinate = ['mainArea', hoverCoordinate[1] + 1];

                            }
                        } else {//mainArea=>tab
                            fromDataSource.some(function (item, i) {
                                if (item.uuid == dragItem.detail.uuid) {
                                    addItem = fromDataSource.splice(i, 1)[0];
                                    return true;
                                } else {
                                    return false;
                                }
                            });
                            if (hoverClientY < hoverMiddleY) {// 在上面添加
                                tabList.splice(hoverCoordinate[2], 0, addItem);
                                dragItem.coordinate = ['Tab', activeKey, hoverCoordinate[2]];
                            } else {//在下面添加
                                tabList.splice(hoverCoordinate[2] + 1, 0, addItem);
                                dragItem.coordinate = ['Tab', activeKey, hoverCoordinate[2] + 1];
                            }
                        }
                    }
                }
                props.setComponentArea(props.dataSource);
            }
        },
        drop(props, monitor, component) {
            return {
                ...props,
                dropType: 'Element',
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
    type: 'Element',
    spec: {
        beginDrag(props) {
            return {
                ...props,
                dragType: 'Element',
            };
        },
        endDrag(props, monitor){
            const dropResult = monitor.getDropResult();
            // console.log(dropResult);
        },
        //重写isDragging方法，用于判断当前拖拽的元素
        isDragging (props, monitor) {
            return props.detail.uuid == monitor.getItem().detail.uuid;
        }
    },
    collect(connect, monitor){
        return {
            connectDragSource: connect.dragSource(),
            isDragging: monitor.isDragging(),
        };
    },
};
class WebElement extends Component {

    constructor (props) {
        super(props);
        this.state = {};
        this.overLeaveHandler = this.overLeaveHandler.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.onChange = this.onChange.bind(this);
        this.showModal = this.showModal.bind(this);
    }

    componentWillReceiveProps (nextProps) {
    }

    onChange (e) {

    }

    showModal () {

    }

    handleOk (e) {
    }

    handleCancel (e) {
    }

    overLeaveHandler (event) {
    }

    renderElement () {
        let {isDragging, temp} = this.props;
        let opacity = isDragging ? 0.2 : 1;//拖拽时为透明，不拖拽时完全不透明
        opacity = temp ? 0.5 : opacity;//temp card 半透明
        return (
            <div style={{opacity}}>
                {this.props.children}
            </div>
        );
    }

    render () {
        let {connectDragSource, connectDropTarget} = this.props;
        return connectDragSource(connectDropTarget(
            <div>
                {this.renderElement()}
            </div>
        ));
    }
}

WebElement = DropTarget(dropSetting.type, dropSetting.spec, dropSetting.collect)(WebElement);
export default DragSource(dragSetting.type, dragSetting.spec, dragSetting.collect)(WebElement);
