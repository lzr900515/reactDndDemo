import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';
// import Element from '../../DragAndDrop/PageLayout/Element';
import WebTab from '../../PageLayout/WebElements/WebTab';
import WebElementMap from '../../PageLayout/WebElements/WebElementMap';
import generateUUID from '../../../utils/generateUUID';
const dndSetting = {
    type: ['Element', 'DragMenu'],
    spec: {
        drop(props, monitor, component) {
            let source = monitor.getItem();
            let target = props;
            /**
             *   it is going to become the drop result and will be available to the drag source
             *   in its endDrag method as monitor.getDropResult()
             */
            // console.log(monitor.getDropResult());
            if (monitor.getDropResult()) {
                return {
                    dropType: monitor.getDropResult().dropType,
                };
            } else {
                return {
                    dropType: 'mainArea',
                };
            }
        },
        canDrop(props, monitor){
            return true;
        },
        hover(props, monitor, component) {
            // console.log(monitor.getItem());
            let isOverCurrent = monitor.isOver({shallow: true});
            if (!isOverCurrent) {
                return;
            }
            let dragItem = monitor.getItem();
            let {dataSource, areaIndex} = props;
            let dropAim = dataSource[areaIndex].componentArea;
            let haveTab = dropAim.length && dropAim[dropAim.length - 1].type == 'Tab';
            if (dragItem.dragType == 'DragMenu') {
                if (dragItem.detail.name == 'Tab') {
                    if (!haveTab) {
                        dropAim.splice(dropAim.length, 0, {
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
                        });
                        dragItem.areaIndex = areaIndex;
                        dragItem.dragType = 'Tab';
                        props.setComponentArea(dataSource);
                    }
                    return;
                }
                //如果要添加的元素为摘要字段，则不做添加。（再要字段默认已经添加进容器，且只能出现一次，所以不需要添加）
                if (dragItem.detail.name == 'ObjectSummary') {
                    return;
                }
                //添加元素
                let length = dropAim.length;
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
                if (haveTab) {
                    dropAim.splice(length - 1, 0, addItem);
                    dragItem.dragType = 'Element';
                    dragItem.areaIndex = areaIndex;
                    dragItem.coordinate = ['mainArea', length - 1];
                } else {
                    dropAim.splice(length, 0, addItem);
                    dragItem.dragType = 'Element';
                    dragItem.areaIndex = areaIndex;
                    dragItem.coordinate = ['mainArea', length];

                }
            } else if (dragItem.dragType == 'Element') {
                if (dragItem.areaIndex != areaIndex) {
                    let fromAreaIndex = dragItem.areaIndex;
                    let fromDataSource = dataSource[fromAreaIndex].componentArea;
                    let toAreaIndex = areaIndex;
                    let toDataSource = dataSource[toAreaIndex].componentArea;
                    let movingItem = {};
                    if (dragItem.coordinate[0] == 'mainArea') {
                        fromDataSource.some(function (item, i) {
                            if (item.uuid == dragItem.detail.uuid) {
                                movingItem = fromDataSource.splice(i, 1)[0];
                                return true;
                            } else {
                                return false;
                            }
                        });
                        //由于插入末尾要判断容器末尾是否为Tab元素，现在更改策略为默认添加到最前边。
                        toDataSource.unshift(movingItem);
                        dragItem.coordinate = ['mainArea', 0];
                        dragItem.areaIndex = toAreaIndex;
                    } else if (dragItem.coordinate[0] == 'Tab') {
                        let tabData = fromDataSource[fromDataSource.length - 1];
                        let activeKey = isNaN(tabData.activeKey) ? 0 : tabData.activeKey;
                        let tabList = tabData.subComponent[activeKey].content;
                        let movingItem = {};
                        tabList.some(function (item, i) {
                            if (item.uuid == dragItem.detail.uuid) {
                                movingItem = tabList.splice(i, 1)[0];
                                return true;
                            } else {
                                return false;
                            }
                        });
                        toDataSource.unshift(movingItem);
                        dragItem.coordinate = ['mainArea', 0];
                        dragItem.areaIndex = toAreaIndex;
                    }
                } else {
                    if (dragItem.coordinate[0] == 'mainArea') {
                        return;
                    } else {
                        let tabData = dropAim[dropAim.length - 1];
                        let activeKey = isNaN(tabData.activeKey) ? 0 : tabData.activeKey;
                        let tabList = tabData.subComponent[activeKey].content;
                        let addItem = {};
                        tabList.some(function (item, i) {
                            if (item.uuid == dragItem.detail.uuid) {
                                addItem = tabList.splice(i, 1)[0];
                                return true;
                            } else {
                                return false;
                            }
                        });
                        let insertIndex = dropAim.length - 1;//插入数组的index
                        dropAim.splice(insertIndex, 0, addItem);
                        dragItem.coordinate = ['mainArea', insertIndex];
                    }
                }
            } else if (dragItem.dragType == 'Tab') {
                if (dragItem.areaIndex != areaIndex) {
                    let fromAreaIndex = dragItem.areaIndex;
                    let fromDataSource = dataSource[fromAreaIndex].componentArea;
                    let toAreaIndex = areaIndex;
                    let toDataSource = dataSource[toAreaIndex].componentArea;
                    let movingItem = {};
                    if (toDataSource.length && (toDataSource[toDataSource.length - 1].type == 'Tab')) {
                        return;//每个容器，只能包含一个Tab组件
                    } else {
                        fromDataSource.some(function (item, i) {
                            if (item.uuid == dragItem.detail.uuid) {
                                movingItem = fromDataSource.splice(i, 1)[0];
                                return true;
                            } else {
                                return false;
                            }
                        });
                        toDataSource.push(movingItem);
                        let insertIndex = toDataSource.length;//插入数组的index
                        dragItem.coordinate = ['mainArea', insertIndex];
                        dragItem.areaIndex = toAreaIndex;
                    }
                } else {
                    return;
                }
            }
            props.setComponentArea(dataSource);
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
class WebDropArea extends Component {
    constructor (props) {
        super(props);
        this.delTab = this.delTab.bind(this);
    }

    delTab () {
        let {setComponentArea, dataSource, areaIndex} = this.props;
        let areaDataSource = dataSource[areaIndex].componentArea;
        let tabDataSource = areaDataSource[areaDataSource.length - 1];
        if (tabDataSource.type == 'Tab') {
            let haveObjectSummary = areaDataSource.some(function (item) {
                return item.type == 'ObjectSummary';
            });
            if (haveObjectSummary) {
                areaDataSource.splice(areaDataSource.length - 1, 1);
            } else {
                areaDataSource.splice(areaDataSource.length - 1, 1);
            }
            setComponentArea(dataSource);
        }
    }

    renderArea () {
        let {
            dataSource, detailLayout, fieldsConfigList, setLayoutField,
            OS_selectedArr, OS_setSelectedArr, delElement, setComponentArea,
            TAB_setTabList, TAB_setTabActiveKey, setFieldsConfigList, theme, areaIndex,
        } = this.props;
        //Element
        let _this = this;
        let areaDataSource = dataSource[areaIndex].componentArea;
        return areaDataSource && areaDataSource.map(function (item, i) {
                if (item.type == 'Tab') {
                    return <div style={{marginTop: '5px'}} key={i}>
                        <WebTab activeKey={~~item.activeKey + ''}
                                theme={theme}
                                defaultActiveKey={~~item.defaultActiveKey}
                                forMobile={true}
                                dataSource={dataSource}
                                areaIndex={areaIndex}
                                OS_selectedArr={OS_selectedArr}
                                OS_setSelectedArr={OS_setSelectedArr}
                                setComponentArea={setComponentArea}
                                detail={item}
                                temp={item.temp}
                                delTab={_this.delTab}
                                delElement={delElement}
                                setActiveKey={TAB_setTabActiveKey}
                                tabList={item.subComponent}
                                detailLayout={detailLayout}
                                setLayoutField={setLayoutField}
                                setFieldsConfigList={setFieldsConfigList}
                                setTabList={TAB_setTabList}
                                fieldsConfigList={fieldsConfigList}/>
                    </div>;
                } else {
                    return <div key={i}>
                        <WebElementMap type={item.type} coordinate={['mainArea', i]} detail={item}
                                       theme={theme}
                                       setComponentArea={setComponentArea}
                                       dataSource={dataSource}
                                       areaIndex={areaIndex}
                                       temp={item.temp}
                                       forMobile={true}
                                       delElement={() => {delElement(i);}}
                                       TAB_tabList={item.subComponent}
                            // TAB_setLayoutField={TAB_setLayoutField}
                                       TAB_setTabList={TAB_setTabList}
                                       OS_selectedArr={OS_selectedArr}
                                       OS_setSelectedArr={OS_setSelectedArr}
                                       detailLayout={detailLayout}
                                       fieldsConfigList={fieldsConfigList}
                                       setFieldsConfigList={setFieldsConfigList}
                                       setLayoutField={setLayoutField}/>
                    </div>;
                }
            });
    }

    render () {
        let {connectDropTarget} = this.props;
        return <div style={{height:'100%'}}>
            {connectDropTarget(
                <div style={{height:'100%'}}>
                    <div style={{overflow: 'auto', minHeight: '180px'}}>
                        {this.renderArea()}
                    </div>
                    {this.props.children}
                </div>)
            }
        </div>;
    }
}
export default DropTarget(dndSetting.type, dndSetting.spec, dndSetting.collect)(WebDropArea);
