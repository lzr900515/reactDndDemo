import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';
// import Element from '../../DragAndDrop/PageLayout/Element';
import Tab from '../../PageLayout/Elements/Tab';
import ElementMap from '../../PageLayout/Elements/ElementMap';
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
            let {dataSource} = props;
            let haveTab = dataSource[props.dataSource.length - 1].type == 'Tab';
            if (dragItem.detail.name == 'Tab') {
                if (!haveTab) {
                    dataSource.splice(props.dataSource.length, 0, {
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
                    props.setComponentArea(dataSource);
                }
                return;
            }
            if (dragItem.dragType == 'DragMenu') {
                //如果要添加的元素为摘要字段，则不做添加。（摘要字段默认已经添加进容器，且只能出现一次，所以不需要添加）
                if (dragItem.detail.name == 'ObjectSummary') {
                    return;
                }
                //添加元素
                let length = props.dataSource.length;
                let addItem = {
                    type: dragItem.detail.name,
                    uuid: dragItem.detail.uuid,
                    appName: dragItem.detail.appName,
                    temp: true,
                };
                if (dragItem.detail.name == 'Relative') {
                    addItem.id = dragItem.detail.id;
                    //默认配置数据
                    addItem.displayFields = ['name','createdOn','owner'];
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
                    dataSource.splice(length - 1, 0, addItem);
                    dragItem.dragType = 'Element';
                    dragItem.coordinate = ['mainArea', length - 1];
                } else {
                    dataSource.splice(length, 0, addItem);
                    dragItem.dragType = 'Element';
                    dragItem.coordinate = ['mainArea', length];
                }
            } else if (dragItem.dragType == 'Element') {
                if (dragItem.coordinate[0] == 'mainArea') {
                    return;
                } else {
                    let tabData = props.dataSource[props.dataSource.length - 1];
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
                    let insertIndex = props.dataSource.length - 1;//插入数组的index
                    dataSource.splice(insertIndex, 0, addItem);
                    dragItem.coordinate = ['mainArea', insertIndex];
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
class MobileDropArea extends Component {
    constructor (props) {
        super(props);
        this.delTab = this.delTab.bind(this);
    }

    delTab () {
        let {setComponentArea, dataSource} = this.props;
        let tabDataSource = dataSource[dataSource.length - 1];
        if (tabDataSource.type == 'Tab') {
            let haveObjectSummary = dataSource.some(function (item) {
                return item.type == 'ObjectSummary';
            });
            if (haveObjectSummary) {
                dataSource.splice(dataSource.length - 1, 1);
            } else {
                dataSource[dataSource.length - 1] = {type: 'ObjectSummary', uuid: generateUUID()};
            }
            setComponentArea(dataSource);
        }
    }

    renderArea () {
        let {
            dataSource, detailLayout, fieldsConfigList, setLayoutField,
            OS_selectedArr, OS_setSelectedArr, delElement, setComponentArea,
            TAB_setTabList, TAB_setTabActiveKey, setFieldsConfigList
        } = this.props;
        //Element
        let _this = this;
        console.log(this.props);
        return dataSource && dataSource.map(function (item, i) {
                if (item.type == 'Tab') {
                    return <div style={{marginTop: '5px'}} key={i}>
                        <Tab activeKey={~~item.activeKey+''}
                             defaultActiveKey={~~item.defaultActiveKey}
                             forMobile={true}
                             dataSource={dataSource}
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
                        <ElementMap type={item.type} coordinate={['mainArea', i]} detail={item}
                                    setComponentArea={setComponentArea}
                                    dataSource={dataSource}
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

    // renderTab () {
    //     let {
    //         dataSource, detailLayout, fieldsConfigList, TAB_setLayoutField, TAB_setTabList, delElement
    //     } = this.props;
    //     let lastItem = dataSource && dataSource[dataSource.length - 1];
    //     if (lastItem && lastItem.type=='Tab'){
    //         return <Tab defaultActiveKey={'0'}
    //                     temp = {lastItem.temp}
    //                     delTab={()=>{delElement(dataSource.length - 1)}}
    //                     delElement={delElement}
    //                     tabList={lastItem.subComponent}
    //                     detailLayout={detailLayout}
    //                     setLayoutField={TAB_setLayoutField}
    //                     setTabList={TAB_setTabList}
    //                     fieldsConfigList={fieldsConfigList}/>;
    //     }else{
    //         return null;
    //     }
    // }

    render () {
        let {connectDropTarget} = this.props;
        return <div>
            {connectDropTarget(
                <div>
                    <div style={{overflowY: 'auto', height: '600px'}}>
                        {this.renderArea()}
                    </div>
                    {this.props.children}
                </div>)
            }
        </div>;
    }
}
export default DropTarget(dndSetting.type, dndSetting.spec, dndSetting.collect)(MobileDropArea);
