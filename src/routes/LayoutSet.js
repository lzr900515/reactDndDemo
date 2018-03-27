import React, { PropTypes, Component } from 'react';
import { Button, Radio, Row, Col, Modal, Input, Select, message } from 'antd';
import { connect } from 'dva';
import { browserHistory } from 'dva/router';
import DragSider from '../components/PageLayout/List/DragSider';
import ButtonBar from '../components/PageLayout/List/ButtonBar';
import MobileDropArea from '../components/DragAndDrop/PageLayout/MobileDropArea';
import WebContainer from '../components/PageLayout/List/WebContainer';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

moment.locale('zh-cn');

const ButtonGroup = Button.Group;
class LayoutSet extends Component {
    constructor (props) {
        super(props);
        // this.jumpTo = this.jumpTo.bind(this);
        // this.showModal = this.showModal.bind(this);
        // this.delConfirm = this.delConfirm.bind(this);
        // this.handleCancel = this.handleCancel.bind(this);
        // this.setNewLayoutName = this.setNewLayoutName.bind(this);
        // this.editLayout = this.editLayout.bind(this);
        // this.canDelete = this.canDelete.bind(this);
        this.setObjectSumSelected = this.setObjectSumSelected.bind(this);
        this.setLayoutField = this.setLayoutField.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.setLabel = this.setLabel.bind(this);
        this.setAPIName = this.setAPIName.bind(this);
        this.cancel = this.cancel.bind(this);
        this.confirm = this.confirm.bind(this);
        this.saveLayout = this.saveLayout.bind(this);
        this.formatFieldLayout = this.formatFieldLayout.bind(this);

        this.setTabList = this.setTabList.bind(this);
        this.setWebTabList = this.setWebTabList.bind(this);

        this.setTabActiveKey = this.setTabActiveKey.bind(this);
        this.setWebTabActiveKey = this.setWebTabActiveKey.bind(this);
        // this.addElement =

        this.delElement = this.delElement.bind(this);
        this.delWebElement = this.delWebElement.bind(this);

        this.changeTemp = this.changeTemp.bind(this);
        this.delTemp = this.delTemp.bind(this);

        this.setComponentArea = this.setComponentArea.bind(this);
        this.setLayoutWeb = this.setLayoutWeb.bind(this);

        this.setButtonArea = this.setButtonArea.bind(this);
        this.setFieldsConfigList = this.setFieldsConfigList.bind(this);
        this.changeLayoutType = this.changeLayoutType.bind(this);

        this.returnContainer = this.returnContainer.bind(this);

        this.state = {
            layoutType: 'web',

            label: '默认布局FE',
            name: 'api_key',
            labelCopy: '默认布局FE',
            nameCopy: 'api_key',
            editVisible: false,

            relativeList: [],
            componentList: [],
            buttonList: [],
            objectSumSelected: [],
            fieldsConfigList: [],
            layoutFields: [],
            componentArea: [], //移动端布局
            buttonArea: [],
            layoutWeb: props.layoutWeb || [],  //web端布局
        };
    }

    componentWillMount () {
        this.setState({
            label: '默认布局FE',
            name: 'api_key',
            labelCopy: '默认布局FE',
            nameCopy: 'api_key',
        });
    }

    componentDidMount () {
        this.props.dispatch({
            type: 'pageLayout/initData',
            payload: {
                metaId: 1234,
                id: 21323
            }
        });
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            relativeList: nextProps.relativeList,
            componentList: nextProps.componentList,
            buttonList: nextProps.buttonList,
            objectSumSelected: nextProps.objectSumSelected,
            fieldsConfigList: nextProps.fieldsConfigList,
            layoutFields: nextProps.layoutFields,
            // componentArea: nextProps.componentArea,
            buttonArea: nextProps.buttonArea,
        });
        if (!_.isEqual(this.props.componentArea, nextProps.componentArea)) {
            nextProps.componentArea.some(function (detail) {
                if (detail.type == 'Tab') {
                    detail.activeKey = ~~detail.defaultActiveKey;//转整形，如果null or undefined 转为 0
                }
            });
            this.setState({
                componentArea: nextProps.componentArea,
            });
        }

        if (!_.isEqual(this.props.layoutWeb, nextProps.layoutWeb)) {
            nextProps.layoutWeb.forEach(function (item) {
                item.componentArea && item.componentArea.some(function (detail) {
                    if (detail.type == 'Tab') {
                        detail.activeKey = ~~detail.defaultActiveKey;//转整形，如果null or undefined 转为 0
                    }
                });
            });
            this.setState({
                layoutWeb: nextProps.layoutWeb,
            });
        }
    }

    setFieldsConfigList (newVal) {
        this.setState({fieldsConfigList: newVal});
    }

    setButtonArea (newVal) {
        this.setState({buttonArea: newVal});
    }

    //mobile布局设置
    setComponentArea (newVal) {
        this.setState({componentArea: newVal});
    }

    //web布局设置
    setLayoutWeb (newVal) {
        // let {layoutWeb} = this.props;
        // layoutWeb[index].componentArea = newVal;
        this.setState({
            layoutWeb: [...newVal]
        });
    }

    //mobile元素删除
    delElement (index, inTab) {
        let {componentArea} = this.state;
        if (inTab) {
            let tabList = componentArea[componentArea.length - 1].subComponent;
            let subContent = tabList[index[0]].content;
            subContent.splice(index[1], 1);
        } else {
            componentArea.splice(index, 1);
        }
        this.setState({componentArea});
    }

    /**
     * web元素删除
     * @param containerIndex 网页端布局设置存在多个容器，containerIndex代表当前容器的index
     * @param index 容器内元素所在的index，如果inTab==true，则index代表在选项卡内的index
     * @param inTab 是否在容器的二级容器选项卡内，选项卡默认在容器末尾
     */
    delWebElement (containerIndex, index, inTab) {
        let {layoutWeb} = this.state;
        let componentArea = layoutWeb[containerIndex].componentArea;
        if (inTab) {
            let tabList = componentArea[componentArea.length - 1].subComponent;
            let subContent = tabList[index[0]].content;
            subContent.splice(index[1], 1);
        } else {
            componentArea.splice(index, 1);
        }
        this.setState({
            layoutWeb: [...layoutWeb]
        });
    }

    /**
     * hover时生成带有temp标签的临时element，当取消drop（即drop到非有效区域）
     * 后将temp标签的card从数组中去除
     */
    delTemp () {
        let {componentArea, layoutWeb, layoutType} = this.state;
        switch (layoutType) {
            case 'web':
                layoutWeb.forEach(function (item) {
                    let componentArea = item.componentArea;
                    let componentAreaLength = componentArea && componentArea.length;
                    for (let i = 0; i < componentAreaLength; i++) {
                        if (componentArea[i].temp) {
                            componentArea.splice(i, 1);
                            break;
                        }
                        if (componentArea[i].type == 'Tab') {
                            let tabList = componentArea[i].subComponent;
                            // console.log(tabList);
                            for (let item of tabList) {
                                let find = item.content.some(function (el, ii) {
                                    // console.log(item.content);
                                    if (el.temp) {
                                        item.content.splice(ii, 1);
                                        return true;
                                    } else {
                                        return false;
                                    }
                                });
                                if (find) {
                                    break;
                                }
                            }
                        }
                    }
                });
                this.setState({
                    layoutWeb: [...layoutWeb]
                });
                break;
            case 'mobile':
                let componentAreaLength = componentArea.length;
                for (let i = 0; i < componentAreaLength; i++) {
                    if (componentArea[i].temp) {
                        componentArea.splice(i, 1);
                        break;
                    }
                    if (componentArea[i].type == 'Tab') {
                        let tabList = componentArea[i].subComponent;
                        // console.log(tabList);
                        for (let item of tabList) {
                            let find = item.content.some(function (el, ii) {
                                // console.log(item.content);
                                if (el.temp) {
                                    item.content.splice(ii, 1);
                                    return true;
                                } else {
                                    return false;
                                }
                            });
                            if (find) {
                                break;
                            }
                        }
                    }
                }
                this.setState({
                    componentArea
                });
                break;
        }
    }

    /**
     * hover时生成带有temp标签的临时element，当确认drop后将temp标签去除
     */
    changeTemp (uuid, inTab) {
        let {componentArea, layoutWeb, layoutType} = this.state;
        switch (layoutType) {
            case 'web':
                layoutWeb.forEach(function (item) {
                    let componentArea = item.componentArea;
                    let componentAreaLength = componentArea && componentArea.length;
                    let hasTab = componentAreaLength && componentArea[componentAreaLength - 1].type == 'Tab';
                    if (inTab && hasTab) {
                        componentArea[componentAreaLength - 1].subComponent.forEach(function (item) {
                            item.content.forEach(function (el) {
                                if (el.uuid == uuid) {
                                    delete el.temp;
                                }
                            });
                        });
                    } else {
                        componentArea.forEach(function (item) {
                            if (item.uuid == uuid) {
                                delete item.temp;
                            }
                        });
                    }
                });
                this.setState({
                    layoutWeb: [...layoutWeb]
                });
                break;
            case 'mobile':
                let componentAreaLength = componentArea.length;
                let hasTab = componentAreaLength && componentArea[componentAreaLength - 1].type == 'Tab';
                if (inTab && hasTab) {
                    componentArea[componentAreaLength - 1].subComponent.forEach(function (item) {
                        item.content.forEach(function (el) {
                            if (el.uuid == uuid) {
                                delete el.temp;
                            }
                        });
                    });
                } else {
                    componentArea.forEach(function (item) {
                        if (item.uuid == uuid) {
                            delete item.temp;
                        }
                    });
                }
                this.setState({componentArea});
                break;
        }
    }

    cancel () {
        let {labelCopy, nameCopy} = this.state;
        this.setState({
            label: labelCopy,
            name: nameCopy,
        });
        this.closeModal();
    }

    confirm () {
        let {label, name} = this.state;
        if (label && name) {
            this.props.dispatch({
                type: 'pageLayout/hasExists',
                payload: {
                    metaId: 22222,
                    id: 1111,
                    label: label,
                    name: name,
                    callback: () => {
                        this.setState({
                            labelCopy: label,
                            nameCopy: name,
                        });
                        this.closeModal();
                    }
                }
            });
        } else {
            message.info('名称,API必填!');
        }
    }

    openModal () {
        this.setState({
            editVisible: true,
        });
    }

    closeModal () {
        this.setState({
            editVisible: false,
        });
    }

    setLabel (e) {
        const {value} = e.target;
        this.setState({
            label: value
        });
    }

    setAPIName (e) {
        const {value} = e.target;
        this.setState({
            name: value
        });
    }

    setLayoutField (newLayout) {
        this.setState({layoutFields: newLayout});
    }

    setObjectSumSelected (newArr) {
        let {fieldsConfigList} = this.state;
        fieldsConfigList.forEach(function (item, i) {
            if (newArr.indexOf(item.fieldId + '') != -1 || newArr.indexOf(parseInt(item.fieldId)) != -1) {
                item.keyField = 1;
            } else {
                item.keyField = 0;
            }
        });
        // console.log(fieldsConfigList,newArr);
        this.setState({
            objectSumSelected: newArr,
            fieldsConfigList: fieldsConfigList,
        });
    }

    formatFieldLayout () {
        let {layoutFields, fieldsConfigList, objectSumSelected} = this.state;
        let {layoutId} = this.props;
        let layoutDetail = [];
        let usedFields = [];
        layoutFields.forEach(function (item, i) {
            let groupDetail = {
                'group': item.group,
                'colNum': item.colNum,
                'order': item.order,
                'showInNewEditPage': !! item.showInNewEditPage, //名称显示在：新建、编辑页面
                'showInDetailPage': !! item.showInDetailPage, //名称显示在：详细资料页面
                'fields': []
            };
            if (item.colNum == '2') {
                if (item.order == '2') {//N字布局
                    if (item.firstArr.length >= item.secondArr.length) {
                        for (let i = 0; i < item.firstArr.length; i++) {
                            groupDetail.fields[i] = item.firstArr[i].id;
                            if (i < item.secondArr.length) {
                                groupDetail.fields[i + item.firstArr.length] = item.secondArr[i].id;
                            } else {
                                groupDetail.fields[i + item.firstArr.length] = '';
                            }
                        }
                    } else {
                        for (let i = 0; i < item.secondArr.length; i++) {
                            if (i < item.firstArr.length) {
                                groupDetail.fields[i] = item.firstArr[i].id;
                            } else {
                                groupDetail.fields[i] = '';
                            }
                            groupDetail.fields[i + item.secondArr.length] = item.secondArr[i].id;
                        }
                    }
                } else if (item.order == '1') {//Z字布局
                    if (item.firstArr.length >= item.secondArr.length) {
                        for (let i = 0; i < item.firstArr.length; i++) {
                            groupDetail.fields[i * 2] = item.firstArr[i].id;
                            groupDetail.fields[i * 2 + 1] = item.secondArr[i] ? item.secondArr[i].id : '';
                        }
                    } else {
                        for (let i = 0; i < item.secondArr.length; i++) {
                            groupDetail.fields[i * 2] = item.firstArr[i] ? item.firstArr[i].id : '';
                            groupDetail.fields[i * 2 + 1] = item.secondArr[i].id;
                        }
                    }
                }
            } else if (item.colNum == '1') {
                for (let i = 0; i < item.firstArr.length; i++) {
                    groupDetail.fields[i] = item.firstArr[i].id;
                }
            }
            layoutDetail.push(groupDetail);
            usedFields = usedFields.concat(groupDetail.fields);
        });
        // usedFields = usedFields.concat(objectSumSelected); //摘要字段不需要推算，该逻辑废除
        usedFields = usedFields.join().split(',');//确保id都为字符串
        usedFields = [... new Set(usedFields)];//id去重
        let fields = fieldsConfigList.map(function (detail) {
            if (usedFields.indexOf(detail.fieldId + '') != -1) {
                return {
                    commonUsed: detail.commonUsed,
                    fieldId: detail.fieldId,
                    keyField: detail.keyField,
                    required: detail.required,
                    status: detail.status,
                    id: detail.id,
                    layoutId: layoutId,
                };
            } else {
                return {
                    commonUsed: 0,
                    fieldId: detail.fieldId,
                    keyField: 0,
                    required: 0,
                    status: detail.status,
                    id: detail.id,
                    layoutId: '0',//编辑时，当提交layoutId为0，说明该字段已从摘要和详细信息中删除。
                };
            }
        });

        return {fields: fields, detail: layoutDetail};
    }

    //设置mobile选项卡
    setTabList (newTabList) {
        let {componentArea} = this.state;
        componentArea.some(function (detail) {
            if (detail.type == 'Tab') {
                detail.subComponent = newTabList;
            }
        });
        // console.log(newTabList);
        this.setState({componentArea});
    }

    //设置web选项卡
    setWebTabList (index, newTabList) {
        let {layoutWeb} = this.state;
        let componentArea = layoutWeb[index].componentArea;
        componentArea.some(function (detail) {
            if (detail.type == 'Tab') {
                detail.subComponent = newTabList;
            }
        });
        // console.log(newTabList);
        this.setState({
            layoutWeb: [...layoutWeb]
        });
    }

    //设置mobile选项卡当前选中tab页
    setTabActiveKey (activeKey) {
        let {componentArea} = this.state;
        componentArea.some(function (detail) {
            if (detail.type == 'Tab') {
                detail.activeKey = activeKey;
            }
        });
        // console.log(newTabList);
        this.setState({componentArea});
    }

    //设置web选项卡当前选中tab页
    setWebTabActiveKey (index, activeKey) {
        let {layoutWeb} = this.state;
        let componentArea = layoutWeb[index].componentArea;
        componentArea.some(function (detail) {
            if (detail.type == 'Tab') {
                detail.activeKey = activeKey;
            }
        });
        this.setState({
            layoutWeb: [...layoutWeb]
        });
    }

    saveLayout () {
        let {label, name, componentArea, objectSumSelected, buttonArea, layoutWeb} = this.state;
        let {fields, detail} = this.formatFieldLayout();

        let buttonAreaFomart = buttonArea.map(function (item) {
            let tempArr = item.split('@');
            if (tempArr.length == 2) {
                return {
                    appName: tempArr[0],
                    type: tempArr[1],
                };
            } else {
                return {
                    type: tempArr[0],
                };
            }
        });
        //删除临时变量
        let lastComponent = componentArea[componentArea.length - 1];
        if (lastComponent.type == 'Tab') {
            delete lastComponent.activeKey;
        }

        this.props.dispatch({
            type: 'pageLayout/saveLayout',
            payload: {
                metaId: 1222,
                id: 1111,
                label: label,
                name: name,
                layoutSummary: JSON.stringify(objectSumSelected),
                layoutFileds: JSON.stringify({fieldsLayout: detail}),
                layoutWeb: JSON.stringify(layoutWeb),
                layoutMobile: JSON.stringify({
                    buttonArea: buttonAreaFomart,
                    componentArea: componentArea,
                }),
                layoutButton: JSON.stringify(buttonAreaFomart),
                fields: fields,
                callBack: () => {//新建保存时，返回列表页
                    browserHistory.go(-1);
                },
            }
        });
    }

    changeLayoutType (e) {
        this.setState({
            layoutType: e.target.value,
        });
    }

    returnContainer () {
        let {
            relativeList, componentList, buttonList, objectSumSelected, fieldsConfigList, layoutFields,
            label, name, editVisible, buttonArea, componentArea, layoutType, layoutWeb,
        } = this.state;
        if(layoutType == 'web'){
            return <div style={{}}>
                <WebContainer dataSource={layoutWeb}//布局结构
                              detailLayout={layoutFields}//详细资料布局
                              setComponentArea={this.setLayoutWeb}
                    // addElement={this.addElement}
                              layoutType={0}
                              setLayoutField={this.setLayoutField}
                              delElement={this.delWebElement}
                              setFieldsConfigList={this.setFieldsConfigList}
                              fieldsConfigList={fieldsConfigList}
                              OS_selectedArr={objectSumSelected}
                              OS_setSelectedArr={this.setObjectSumSelected}
                              TAB_setTabList={this.setWebTabList}
                              TAB_setTabActiveKey={this.setWebTabActiveKey}
                />
            </div>;
        }else{
            return <div style={{margin: '0px 200px', width: '400px',}}>
                <MobileDropArea dataSource={componentArea}//布局结构
                                detailLayout={layoutFields}//详细资料布局
                                setComponentArea={this.setComponentArea}
                    // addElement={this.addElement}
                                setLayoutField={this.setLayoutField}
                                delElement={this.delElement}
                                setFieldsConfigList={this.setFieldsConfigList}
                                fieldsConfigList={fieldsConfigList}
                                OS_selectedArr={objectSumSelected}
                                OS_setSelectedArr={this.setObjectSumSelected}
                                TAB_setTabList={this.setTabList}
                                TAB_setTabActiveKey={this.setTabActiveKey}
                >
                    <ButtonBar selectedArr={buttonArea} allArr={buttonList}
                               setSelectedArr={this.setButtonArea}/>
                </MobileDropArea>
            </div>;
        }
    }

    render () {
        // let {addVisible} = this.state;
        let {
            relativeList, componentList, buttonList, objectSumSelected, fieldsConfigList, layoutFields,
            label, name, editVisible, buttonArea, componentArea, layoutType, layoutWeb,
        } = this.state;
        return (
            <div className="g-form-view" style={{height: '100%', backgroundColor: '#f2f3f5',}}>
                <div className="g-form-view-header clearfix" style={{backgroundColor: 'white',  paddingBottom:'20px'}}>
                    <div className="">
                        <Radio.Group value={layoutType} style={{marginLeft: '100px'}}
                                     onChange={this.changeLayoutType}>
                            <Radio.Button value="web">网页端</Radio.Button>
                            <Radio.Button value="mobile">移动端</Radio.Button>
                        </Radio.Group>
                    </div>
                </div>
                <DragSider componentList={componentList} relativeList={relativeList}
                           changeTemp={this.changeTemp} delTemp={this.delTemp}/>
                <div className="mainContent" style={{padding: '0px 20px 0px 200px', width: '100%'}}>
                    {
                        this.returnContainer()
                    }
                </div>

                <Modal title={'编辑页面页布局'} visible={editVisible} okText="保存" cancelText="取消"
                       onOk={this.confirm} onCancel={this.cancel}>
                    <Row>
                        <Col span={6}>
                            名称<span style={{color: 'red'}}>*</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Input maxLength="20" placeholder="此处填写名称，最多20个字" value={label}
                                   onChange={this.setLabel}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            API<span style={{color: 'red'}}>*</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Input placeholder="请填写英文和数字" value={name} onChange={this.setAPIName} disabled={true}/>
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }
}
const mapStateToProps = state => {
    let {
        relativeList, componentList, buttonList, digest, fieldsConfigList, layoutFields, usedFields,
        layoutMobile, layoutId, usedButton, layoutWeb
    } = state.pageLayout;
    return {
        layoutId,
        objectSumSelected: digest,
        relativeList,
        componentList,
        buttonList,
        fieldsConfigList,
        layoutFields,
        usedFields,
        componentArea: layoutMobile.componentArea,
        layoutWeb: layoutWeb,
        buttonArea: usedButton,
    };
};

export default DragDropContext(HTML5Backend)(connect(mapStateToProps)(LayoutSet));
