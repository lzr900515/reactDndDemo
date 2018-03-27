import React, { Component, PropTypes } from 'react';
import descriptionMap from '../List/DescriptionMap';
import SmartHover from '../List/SmartHover';
import FieldsLayout from '../List/FieldsLayout';
import { Row, Col, Modal, Select } from 'antd';

const Option = Select.Option;
class Group extends Component {

    constructor (props) {
        super(props);
        this.state = {};
    }

    fieldsRender () {
        let {fields} = this.props;
        let jsxDom = [];
        fields.forEach(function (item, i) {
            if (item && item.label) {
                jsxDom.push(
                    <div style={{borderBottom: '1px #d7dde5 solid', margin: '10px'}} key={i}>
                        <div style={{color: '#6d6d8d'}}>{item.label}</div>
                        <div>{descriptionMap(item.type, item.subType, item.label)}</div>
                    </div>
                );
            }
        });
        return jsxDom;
    }

    render () {
        return (
            <div>
                <div style={{backgroundColor: '#f4f6f9'}}>{this.props.label}</div>
                {this.fieldsRender()}
            </div>
        );
    }
}

class WebGroup extends Component {

    constructor (props) {
        super(props);
        this.state = {};
    }

    fieldsRender () {
        let {firstArr, secondArr, colNum} = this.props;
        let firstWithNoDel = firstArr.filter(function (item) {
            return item && item.label;
        });
        let secondWithNoDel = secondArr.filter(function (item) {
            return item && item.label;
        });
        let jsxDom = [];
        if (colNum == 2) {//双列
            let firstColumn = firstWithNoDel.map((item, i) => {
                return (
                    <div style={{padding: '0 5px'}} key={i}>
                        <div style={{borderBottom: '1px #d7dde5 solid', margin: '10px'}}>
                            <div style={{color: '#6d6d8d'}}>{item.label}</div>
                            <div>{descriptionMap(item.type, item.subType, item.label)}</div>
                        </div>
                    </div>
                );
            });
            let secondColumn = secondWithNoDel.map((item, i) => {
                return (
                    <div style={{padding: '0 5px'}} key={i}>
                        <div style={{borderBottom: '1px #d7dde5 solid', margin: '10px'}}>
                            <div style={{color: '#6d6d8d'}}>{item.label}</div>
                            <div>{descriptionMap(item.type, item.subType, item.label)}</div>
                        </div>
                    </div>
                );
            });
            jsxDom = <div style={{display:'flex'}}>
                <div style={{flexBasis: '50%'}}>
                    {firstColumn}
                </div>
                <div style={{flexBasis: '50%'}}>
                    {secondColumn}
                </div>
            </div>;
        } else {//单列
            firstWithNoDel.forEach(function (item, i) {
                if (item && item.label) {
                    jsxDom.push(
                        <div style={{borderBottom: '1px #d7dde5 solid', margin: '10px'}} key={i}>
                            <div style={{color: '#6d6d8d'}}>{item.label}</div>
                            <div>{descriptionMap(item.type, item.subType, item.label)}</div>
                        </div>
                    );
                }
            });
        }
        return jsxDom;
    }

    render () {
        return (
            <div>
                <div style={{backgroundColor: '#f4f6f9'}}>{this.props.label}</div>
                {this.fieldsRender()}
            </div>
        );
    }
}

class GroupDetail extends Component {

    constructor (props) {
        super(props);
        this.confirm = this.confirm.bind(this);
        this.cancel = this.cancel.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.getFieldsDetail = this.getFieldsDetail.bind(this);
        // this.setDetail = this.setDetail.bind(this);
        this.changeGroupIndex = this.changeGroupIndex.bind(this);
        this.webDetailRender = this.webDetailRender.bind(this);
        this.mobileDetailRender = this.mobileDetailRender.bind(this);
        this.getFieldsDetailForWeb = this.getFieldsDetailForWeb.bind(this);

        this.state = {
            visible: false,
            groupIndex: 0,
        };
    }

    componentWillMount () {
        this.setState({
            groupIndex: ~~ this.props.detail.groupIndex,
        });
    }

    componentWillReceiveProps (nextProps) {
        if (!_.isEqual(this.props.detail.groupIndex, nextProps.detail.groupIndex)) {
            this.setState({
                groupIndex: ~~ nextProps.detail.groupIndex,
            });
        }
    }

    confirm () {
        // this.props.setLayoutField(this.state.detailLayout);
        // this.props.setFieldsConfigList(this.state.fieldsConfigList);
        this.props.setConfig({
            groupIndex: this.state.groupIndex,
        });
        this.closeModal();
    }

    cancel () {
        this.setState({
            groupIndex: ~~ this.props.detail.groupIndex,
        });
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

    getFieldsDetail (item) {
        let {fieldsConfigList} = this.props;
        let fieldsDetail = [];
        if (item.colNum == '2') {
            if (item.order == '2') {//N字布局
                if (item.firstArr.length >= item.secondArr.length) {
                    for (let i = 0; i < item.firstArr.length; i++) {
                        fieldsDetail[i] = item.firstArr[i].id;
                        if (i < item.secondArr.length) {
                            fieldsDetail[i + item.firstArr.length] = item.secondArr[i].id;
                        } else {
                            fieldsDetail[i + item.firstArr.length] = '';
                        }
                    }
                } else {
                    for (let i = 0; i < item.secondArr.length; i++) {
                        if (i < item.firstArr.length) {
                            fieldsDetail[i] = item.firstArr[i].id;
                        } else {
                            fieldsDetail[i] = '';
                        }
                        fieldsDetail[i + item.secondArr.length] = item.secondArr[i].id;
                    }
                }
            } else if (item.order == '1') {//Z字布局
                if (item.firstArr.length >= item.secondArr.length) {
                    for (let i = 0; i < item.firstArr.length; i++) {
                        fieldsDetail[i * 2] = item.firstArr[i].id;
                        fieldsDetail[i * 2 + 1] = item.secondArr[i] ? item.secondArr[i].id : '';
                    }
                } else {
                    for (let i = 0; i < item.secondArr.length; i++) {
                        fieldsDetail[i * 2] = item.firstArr[i] ? item.firstArr[i].id : '';
                        fieldsDetail[i * 2 + 1] = item.secondArr[i].id;
                    }
                }
            }
        } else if (item.colNum == '1') {
            for (let i = 0; i < item.firstArr.length; i++) {
                fieldsDetail[i] = item.firstArr[i].id;
            }
        }
        return fieldsDetail.map(function (id) {
            for (let detail of fieldsConfigList) {
                if (id == detail.fieldId) {
                    return detail;
                }
            }
        });
    }

    mobileDetailRender () {
        let {detailLayout,detail} = this.props;
        let _this = this;
        if(detailLayout.length){
            //当详细信息组件中没有对应index数据时，默认用第一组
            let item = detailLayout[detail.groupIndex] ? detailLayout[detail.groupIndex] : detailLayout[0];
            let fieldsDetail = _this.getFieldsDetail(item);
            return <Group label={item.group} fields={fieldsDetail}/>;
        }else{
            return null;
        }
    }

    getFieldsDetailForWeb (arr) {
        let {fieldsConfigList} = this.props;
        return arr.map(function (item) {
            for (let detail of fieldsConfigList) {
                if (item.id == detail.fieldId) {
                    return detail;
                }
            }
        });
    }

    webDetailRender () {
        let {detailLayout, detail} = this.props;
        let _this = this;
        if(detailLayout.length){
            //当详细信息组件中没有对应index数据时，默认用第一组
            let item = detailLayout[detail.groupIndex] ? detailLayout[detail.groupIndex] : detailLayout[0];
            return <WebGroup colNum={item.colNum} label={item.group} firstArr={_this.getFieldsDetailForWeb(item.firstArr)}
                             secondArr={_this.getFieldsDetailForWeb(item.secondArr)}/>;
        }else{
            return null;
        }
    }

    changeGroupIndex (value) {
        this.setState({
            groupIndex: value,
        });
    }

    render () {
        let {forMobile, delDetail, detailLayout} = this.props;
        let {visible, groupIndex} = this.state;
        let selectVal = (detailLayout.length > groupIndex) ? groupIndex + '' : '0';
        return (
            <div style={{margin: '5px 0px'}}>
                <SmartHover edit={this.openModal} close={delDetail}>
                    {forMobile ? this.mobileDetailRender() : this.webDetailRender()}
                </SmartHover>
                {visible ? <Modal width={400} title={'组件-分组资料'} visible={visible} onOk={this.confirm}
                                  onCancel={this.cancel}>
                    <div>设置显示的分组</div>
                    <Select value={selectVal+''} style={{ width: '120px' }} onChange={this.changeGroupIndex}>
                        {
                            detailLayout.map((group,index)=>{
                                return <Option value={index+''} key={index+''}>{group.group}</Option>;
                            })
                        }
                    </Select>
                </Modal> : null}
            </div>
        );
    }
}

export default GroupDetail;
