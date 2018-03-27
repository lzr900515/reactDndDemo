import React, { Component, PropTypes } from 'react';
import { Row, Col, Modal, Icon, Tabs } from 'antd';
import { connect } from 'dva';
import SmartHover from '../List/SmartHover';
import _ from 'lodash';
import Element from '../../DragAndDrop/PageLayout/Element';
import Detail from './Detail';
import GroupDetail from './GroupDetail';
import Record from './Record';
import Comment from './Comment';
import ObjectSummary from './ObjectSummary';
import File from './File';
import Schedule from './Schedule';
import WorkFlow from './WorkFlow';
import Tab from './Tab';
import Relative from './Relative';
import FollowUp from './FollowUp';

const TabPane = Tabs.TabPane;
class ElementMap extends Component {

    constructor (props) {
        super(props);
        this.setConfig = this.setConfig.bind(this);
    }

    componentWillMount () {
        //数据容错处理，当关联对象组件已被删除时或查不到详细信息时，将该对象从布局列表中删除
        if(this.props.type == 'Relative'){
            let {relativeList, delElement, detail} = this.props;
            let relativeDetail = {};
            let findDetail = relativeList.some(function(item){
                if(item.id == detail.id){
                    relativeDetail = _.cloneDeep(item);
                    relativeDetail = {...relativeDetail, ...detail};
                    return true;
                }else{
                    return false;
                }
            });
            if( !findDetail ){
                delElement();
            }
        }
    }

    setConfig (newConfig) {
        let {coordinate, dataSource ,setComponentArea} = this.props;
        if(coordinate[0] == 'mainArea'){
            dataSource[coordinate[1]] = {
                ...dataSource[coordinate[1]],
                ...newConfig,
            };
        }else{
            let tabList = dataSource[dataSource.length-1];
            let tabDetail = tabList.subComponent[coordinate[1]];
            tabDetail.content[coordinate[2]] = {
                ...tabDetail.content[coordinate[2]],
                ...newConfig,
            };
        }
        setComponentArea(dataSource);
    }

    elementRender () {
        let {
            type, detailLayout, fieldsConfigList, setLayoutField, coordinate, forMobile,
            OS_selectedArr, OS_setSelectedArr, delElement, temp, detail, dataSource, setComponentArea,
            TAB_tabList, TAB_setTabList, TAB_setTabActiveKey, delSubElement, activeKey, setFieldsConfigList
        } = this.props;
        switch (type) {
            case 'Detail':
                return (<Element coordinate={coordinate} temp={temp} detail={detail}
                                 setComponentArea={setComponentArea} dataSource={dataSource}>
                    <Detail forMobile={forMobile}
                            delDetail={delElement}
                            detailLayout={detailLayout}
                            setFieldsConfigList={setFieldsConfigList}
                            fieldsConfigList={fieldsConfigList}
                            setLayoutField={setLayoutField}/>
                </Element>);
            case 'GroupDetail':
                return (<Element coordinate={coordinate} temp={temp} detail={detail}
                                 setComponentArea={setComponentArea} dataSource={dataSource}>
                    <GroupDetail forMobile={forMobile}
                                 delDetail={delElement}
                                 detail={detail} //GroupDetail组件详细信息，包括配置信息。
                                 detailLayout={detailLayout} //GroupDetail展示所需要的详细资料信息。
                                 setConfig={this.setConfig}
                                 fieldsConfigList={fieldsConfigList}/>
                </Element>);
            case 'ObjectSummary':
                return (<Element coordinate={coordinate} temp={temp} detail={detail}
                                 setComponentArea={setComponentArea} dataSource={dataSource}>
                    <ObjectSummary selectedArr={OS_selectedArr} allArr={fieldsConfigList}
                                   setSelectedArr={OS_setSelectedArr}/>
                </Element>);
            case 'Comment':
                return (<Element coordinate={coordinate} temp={temp} detail={detail}
                                 setComponentArea={setComponentArea} dataSource={dataSource}>
                    <Comment delComment={delElement}  detail={detail} setConfig={this.setConfig}/>
                </Element>);
            case 'Record':
                return (<Element coordinate={coordinate} temp={temp} detail={detail}
                                 setComponentArea={setComponentArea} dataSource={dataSource}>
                    <Record delRecord={delElement}  detail={detail} setConfig={this.setConfig}/>
                </Element>);
            case 'File':
                return (<Element coordinate={coordinate} temp={temp} detail={detail}
                                 setComponentArea={setComponentArea} dataSource={dataSource}>
                    <File delFile={delElement} detail={detail} setConfig={this.setConfig}/>
                </Element>);
            case 'Schedule':
                return (<Element coordinate={coordinate} temp={temp} detail={detail}
                                 setComponentArea={setComponentArea} dataSource={dataSource}>
                    <Schedule delSchedule={delElement} detail={detail} setConfig={this.setConfig}/>
                </Element>);
            case 'WorkFlow':
                return (<Element coordinate={coordinate} temp={temp} detail={detail}
                                 setComponentArea={setComponentArea} dataSource={dataSource}>
                    <WorkFlow delWorkFlow={delElement} detail={detail} setConfig={this.setConfig}/>
                </Element>);
            case 'Relative':
                let {relativeList} = this.props;
                let relativeDetail = {};
                relativeList.some(function(item){
                    if(item.id == detail.id){
                        relativeDetail = _.cloneDeep(item);
                        relativeDetail = {...relativeDetail, ...detail};
                        return true;
                    }else{
                        return false;
                    }
                });
                return  (<Element coordinate={coordinate} temp={temp} detail={detail}
                                  setComponentArea={setComponentArea} dataSource={dataSource}>
                    <Relative delRelative={delElement} detail={relativeDetail}
                              label={relativeDetail.revertRefName} setConfig={this.setConfig}
                    />
                </Element>);
            case 'FollowUp':
                return  (<Element coordinate={coordinate} temp={temp} detail={detail}
                                  setComponentArea={setComponentArea} dataSource={dataSource}>
                    <FollowUp delFollowUp={delElement} detail={detail} setConfig={this.setConfig}/>
                </Element>);
            // case 'Tab':
            //     return <Tab activeKey={activeKey}
            //                 forMobile={forMobile}
            //                 dataSource={dataSource}
            //                 OS_selectedArr={OS_selectedArr}
            //                 OS_setSelectedArr={OS_setSelectedArr}
            //                 setComponentArea={setComponentArea}
            //                 detail={detail}
            //                 temp = {temp}
            //                 delTab={delElement}
            //                 delElement={delSubElement}
            //                 setActiveKey={TAB_setTabActiveKey}
            //                 tabList={TAB_tabList}
            //                 detailLayout={detailLayout}
            //                 setLayoutField={setLayoutField}
            //                 setFieldsConfigList={setFieldsConfigList}
            //                 setTabList={TAB_setTabList}
            //                 fieldsConfigList={fieldsConfigList}/>;
            default:
                return (<Element coordinate={coordinate} temp={temp}  detail={detail}
                                 setComponentArea={setComponentArea} dataSource={dataSource}>
                    {type}
                </Element>);
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
const mapStateToProps = state => {
    let {relativeList,} = state.pageLayout;
    return {
        relativeList,
    };
};
export default connect(mapStateToProps)(ElementMap);
