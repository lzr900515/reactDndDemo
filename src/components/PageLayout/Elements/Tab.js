import React, { Component, PropTypes } from 'react';
import { Row, Col, Modal, Icon, Tabs } from 'antd';
import { DropTarget } from 'react-dnd';
import SmartHover from '../List/SmartHover';
import _ from 'lodash';
// import ButtonBar from '../List/ButtonBar';
// import Element from '../../DragAndDrop/PageLayout/Element';
// import Detail from './Detail';
import TabsSetModal from './TabsSetModal';
// import Record from './Record';
// import Comment from './Comment';
import ElementMap from './ElementMap';
import WebElementMap from '../WebElements/WebElementMap';
const TabPane = Tabs.TabPane;
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
            // console.log(source);
            if (source.detail.name == 'Tab') {
                return {
                    dropType: 'mainArea',
                };
            } else {
                return {
                    dropType: 'Tab',
                };
            }
        },
        canDrop(props, monitor){
            return true;
        },
        hover(props, monitor, component) {
            let isOverCurrent = monitor.isOver({shallow: true});
            if (!isOverCurrent) {
                return;
            }
            let dragItem = monitor.getItem();
            let {dataSource} = props;
            let tabDataSource = props.dataSource[props.dataSource.length - 1];
            let activeKey = isNaN(tabDataSource.activeKey) ? 0 : tabDataSource.activeKey;
            let tabList = tabDataSource.subComponent[activeKey].content;
            if(dragItem.detail.name == 'Tab'){
                return;
            }
            if (dragItem.dragType == 'DragMenu') {
                //如果要添加的元素为摘要字段，则不做添加。（再要字段默认已经添加进容器，且只能出现一次，所以不需要添加）
                if(dragItem.detail.name == 'ObjectSummary'){
                    return;
                }

                let addItem = {
                    type: dragItem.detail.name,
                    uuid: dragItem.detail.uuid,
                    appName: dragItem.detail.appName,
                    temp: true,
                };
                if(dragItem.detail.name == 'Relative'){
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
                tabList.push(addItem);
                dragItem.dragType = 'Element';
                dragItem.coordinate=['Tab',activeKey,tabList.length-1];
            } else if (dragItem.dragType == 'Element') {
                if (dragItem.coordinate[0] == 'mainArea') {
                    let addItem = {};
                    dataSource.some(function (item, i) {
                        if (item.uuid == dragItem.detail.uuid) {
                            addItem = dataSource.splice(i, 1)[0];
                            return true;
                        } else {
                            return false;
                        }
                    });
                    tabList.push(addItem);
                    dragItem.coordinate = ['Tab', activeKey, tabList.length-1];
                } else if (dragItem.coordinate[0] == 'Tab') {
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
class Tab extends Component {

    constructor (props) {
        super(props);
        this.state = {
            visible: false,
        };
        this.confirm = this.confirm.bind(this);
        this.cancel = this.cancel.bind(this);
        this.TabRender = this.TabRender.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.changeActiveKey = this.changeActiveKey.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        // this.setState({
        //     defaultActiveKey: nextProps.defaultActiveKey,
        //     tabList: nextProps.tabList,
        // });
    }

    changeActiveKey (activeKey) {
        this.props.setActiveKey(activeKey);
    }

    confirm (newItem, defaultActiveKey) {
        let {dataSource, setComponentArea} = this.props;
        dataSource.some(function(item){
            if(item.type == 'Tab'){
                item.subComponent = newItem;
                item.activeKey = defaultActiveKey+'';
                item.defaultActiveKey = defaultActiveKey;
                return true;
            }else{
                return false;
            }
        });
        setComponentArea(dataSource);
        // this.props.setTabList(newItem);
        this.closeModal();
    }

    cancel () {
        this.closeModal();
    }

    openModal () {
        this.setState({
            visible: true,
        });
    }

    closeModal () {
        this.setState({
            visible: false,
        });
    }

    handleChange (targetKeys) {
        // this.setState({btnTargetKeys:targetKeys});
    };

    TabRender () {
        let jsxDOM = [];
        let {
            activeKey, tabList, detailLayout, fieldsConfigList, setLayoutField, delElement, dataSource,
            setComponentArea, forMobile, OS_selectedArr, OS_setSelectedArr, setFieldsConfigList, theme,
        } = this.props;
        tabList.forEach(function (item, index) {
            let innerContent = <div style={{paddingTop: '100px', margin: 'auto', width: '160px', color: 'darkgray'}}>
                可拖拽多个组件在此处</div>;
            if (item.content.length > 0) {
                innerContent = item.content.map(function (el, i) {
                    return <ElementMap type={el.type} key={i} coordinate={['Tab', index, i]}
                                       temp={el.temp}
                                       setComponentArea={setComponentArea}
                                       detail={el}
                                       dataSource={dataSource}
                                       OS_selectedArr={OS_selectedArr}
                                       OS_setSelectedArr={OS_setSelectedArr}
                                       delElement={
                                           () => {
                                               let indexArr = [index, i];
                                               delElement(indexArr, true);
                                           }
                                       }
                                       forMobile={forMobile}
                                       detailLayout={detailLayout}
                                       fieldsConfigList={fieldsConfigList}
                                       setFieldsConfigList={setFieldsConfigList}
                                       setLayoutField={setLayoutField}/>;
                });
            }
            jsxDOM.push(
                <TabPane tab={item.title} key={index} forceRender={true}>
                    {/*<div style={{overflowY: 'scroll', height: '500px'}}>*/}
                    <div style={{minHeight: '600px'}}>
                        {innerContent}
                    </div>
                </TabPane>
            );
        });
        return <Tabs activeKey={activeKey} onChange={this.changeActiveKey}>{jsxDOM}</Tabs>;
    }

    render () {
        let {visible} = this.state;
        let {connectDropTarget, tabList, delTab, temp, defaultActiveKey} = this.props;
        let opacity = temp ? 0.5 : 1;//temp card 半透明
        return connectDropTarget(<div style={{opacity}}>
            <SmartHover edit={this.openModal} close={delTab}>
                <Row>
                    {this.TabRender()}
                </Row>
                {/*删除页面布局*/}
                <TabsSetModal visible={visible} onOk={this.confirm} onCancel={this.cancel}
                              tabList={tabList} defaultActiveKey={defaultActiveKey}
                />
            </SmartHover>
        </div>);
    }
}

export default DropTarget(dndSetting.type, dndSetting.spec, dndSetting.collect)(Tab);
