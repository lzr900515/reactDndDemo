import React, { Component, PropTypes } from 'react';
import { Row, Col, Modal, Icon, Tabs } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import WebElement from '../../DragAndDrop/PageLayout/WebElement';
import Detail from '../Elements/Detail';
import GroupDetail from '../Elements/GroupDetail';
import WebRecord from './WebRecord';
import WebComment from './WebComment';
import WebObjectSummary from './WebObjectSummary';
import WebFile from './WebFile';
import WebSchedule from './WebSchedule';
import WebWorkFlow from './WebWorkFlow';
import WebRelative from './WebRelative';
import WebFollowUp from './WebFollowUp';

class WebElementMap extends Component {

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
        let {areaIndex, coordinate, dataSource ,setComponentArea} = this.props;
        let areaDataSource = dataSource[areaIndex].componentArea;
        if(coordinate[0] == 'mainArea'){
            areaDataSource[coordinate[1]] = {
                ...areaDataSource[coordinate[1]],
                ...newConfig,
            };
        }else{
            let tabList = areaDataSource[areaDataSource.length-1];
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
            type, detailLayout, fieldsConfigList, setLayoutField, coordinate, forMobile, theme, areaIndex,
            OS_selectedArr, OS_setSelectedArr, delElement, temp, detail, dataSource, setComponentArea,
            TAB_tabList, TAB_setTabList, TAB_setTabActiveKey, delSubElement, activeKey, setFieldsConfigList
        } = this.props;
        switch (type) {
            case 'Detail':
                return (<WebElement coordinate={coordinate} temp={temp} detail={detail} areaIndex={areaIndex}
                                 setComponentArea={setComponentArea} dataSource={dataSource}>
                    <Detail forMobile={theme=='small'}
                            delDetail={delElement}
                            detailLayout={detailLayout}
                            setFieldsConfigList={setFieldsConfigList}
                            fieldsConfigList={fieldsConfigList}
                            setLayoutField={setLayoutField}/>
                </WebElement>);
            case 'GroupDetail':
                return (<WebElement coordinate={coordinate} temp={temp} detail={detail}  areaIndex={areaIndex}
                                 setComponentArea={setComponentArea} dataSource={dataSource}>
                    <GroupDetail forMobile={theme=='small'}
                                 delDetail={delElement}
                                 detail={detail} //GroupDetail组件详细信息，包括配置信息。
                                 detailLayout={detailLayout} //GroupDetail展示所需要的详细资料信息。
                                 setConfig={this.setConfig}
                                 fieldsConfigList={fieldsConfigList}/>
                </WebElement>);
            case 'ObjectSummary':
                return (<WebElement coordinate={coordinate} temp={temp} detail={detail} areaIndex={areaIndex}
                                 setComponentArea={setComponentArea} dataSource={dataSource}>
                    <WebObjectSummary selectedArr={OS_selectedArr} allArr={fieldsConfigList}
                                   setSelectedArr={OS_setSelectedArr} theme={theme}/>
                </WebElement>);
            case 'Comment':
                return (<WebElement coordinate={coordinate} temp={temp} detail={detail} areaIndex={areaIndex}
                                 setComponentArea={setComponentArea} dataSource={dataSource}>
                    <WebComment delComment={delElement}  detail={detail} setConfig={this.setConfig} theme={theme}/>
                </WebElement>);
            case 'Record':
                return (<WebElement coordinate={coordinate} temp={temp} detail={detail} areaIndex={areaIndex}
                                 setComponentArea={setComponentArea} dataSource={dataSource}>
                    <WebRecord delRecord={delElement}  detail={detail} setConfig={this.setConfig} theme={theme}/>
                </WebElement>);
            case 'File':
                return (<WebElement coordinate={coordinate} temp={temp} detail={detail} areaIndex={areaIndex}
                                 setComponentArea={setComponentArea} dataSource={dataSource}>
                    <WebFile delFile={delElement} detail={detail} setConfig={this.setConfig} theme={theme}/>
                </WebElement>);
            case 'Schedule':
                return (<WebElement coordinate={coordinate} temp={temp} detail={detail} areaIndex={areaIndex}
                                 setComponentArea={setComponentArea} dataSource={dataSource}>
                    <WebSchedule delSchedule={delElement} detail={detail} setConfig={this.setConfig} theme={theme}/>
                </WebElement>);
            case 'WorkFlow':
                return (<WebElement coordinate={coordinate} temp={temp} detail={detail} areaIndex={areaIndex}
                                 setComponentArea={setComponentArea} dataSource={dataSource}>
                    <WebWorkFlow delWorkFlow={delElement} detail={detail} setConfig={this.setConfig} theme={theme}/>
                </WebElement>);
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
                return  (<WebElement coordinate={coordinate} temp={temp} detail={detail} areaIndex={areaIndex}
                                  setComponentArea={setComponentArea} dataSource={dataSource}>
                    <WebRelative delRelative={delElement} detail={relativeDetail} theme={theme}
                              label={relativeDetail.revertRefName} setConfig={this.setConfig}
                    />
                </WebElement>);
            case 'FollowUp':
                return  (<WebElement coordinate={coordinate} temp={temp} detail={detail} areaIndex={areaIndex}
                                  setComponentArea={setComponentArea} dataSource={dataSource}>
                    <WebFollowUp delFollowUp={delElement} detail={detail} setConfig={this.setConfig} theme={theme}/>
                </WebElement>);
            default:
                return (<WebElement coordinate={coordinate} temp={temp}  detail={detail} areaIndex={areaIndex}
                                 setComponentArea={setComponentArea} dataSource={dataSource}>
                    {type}
                </WebElement>);
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
export default connect(mapStateToProps)(WebElementMap);
