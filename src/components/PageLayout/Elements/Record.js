import React, { Component, PropTypes } from 'react';
import { Timeline, Icon, Modal, InputNumber, Checkbox,  } from 'antd';
import SmartHover from '../List/SmartHover';

const styleForModal = {
    title: {
        color: '#53688E',
    },
    group: {
        margin: '0 10px 10px',
    }
};

class RecordModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            displayNum: 0,
            quickFollowRecord: false,
            // displayInWeb: false,
            // displayInMobile: false,
        };
        this.changeDisplayNum = this.changeDisplayNum.bind(this);
        this.changeQuickFR = this.changeQuickFR.bind(this);
        this.onOk = this.onOk.bind(this);
    }

    onOk () {
        let {displayNum, quickFollowRecord} = this.state;
        this.props.confirm({
            displayNum,
            quickFollowRecord,
        });
    }

    componentWillReceiveProps (nextProps) {
        // if (!_.isEqual(this.props.detail, nextProps.detail)) {
        this.setState({
            displayNum: ~~_.cloneDeep(nextProps.detail.displayNum),
            quickFollowRecord: !!_.cloneDeep(nextProps.detail.quickFollowRecord),
            // displayInMobile: !!_.cloneDeep(nextProps.detail.displayInMobile),
        });
        // }
    }

    changeQuickFR (e) {
        this.setState({
            quickFollowRecord: e.target.checked,
        });
    }

    changeDisplayNum (value) {
        this.setState({
            displayNum: value,
        });
    }

    render () {
        let {visible, cancel} = this.props;
        let {displayNum, quickFollowRecord} = this.state;
        return (
            visible?<Modal title={'组件-动态'} visible={visible} onOk={this.onOk}
                           onCancel={cancel}>
                <div style={styleForModal.group}>
                    <label style={styleForModal.title}>显示数量（最多30条）</label>
                    <div>
                        <InputNumber min={0} max={30} value={displayNum} onChange={this.changeDisplayNum}
                                     style={{width: '150px'}}/>
                    </div>
                </div>
                <div  style={styleForModal.group}>
                    <label style={styleForModal.title}>可快速创建跟进记录</label>
                    <div>
                        <Checkbox checked={quickFollowRecord}
                                  onChange={this.changeQuickFR}></Checkbox>
                    </div>
                </div>
            </Modal>:null
        );
    }
}

const style={
    imgDiv:{
        width: '24px',
        height: '24px',
        backgroundColor: 'rgba(244, 165, 35, 1)',
        borderRadius: '3px',
    },
    header:{
        borderBottom: '1px #f2f2f2 solid',
        overflow: 'auto',
        margin: '0 0 20px',
        padding: '0 30px 0 20px',
    },
    body:{
        title:{
            fontSize: '14px',
            color: '#000000'
        },
        content:{
            fontSize: '12px',
            color: '#666666',
        },
        footer:{
            fontSize: '12px',
            color: '#000000',
        }
    },
    footer:{
        borderTop: '1px #f2f2f2 solid',
        textAlign: 'center',
        lineHeight: '40px',
        fontSize: '14px',
        color: 'darkgray',
    }
};

class Record extends Component {

    constructor (props) {
        super(props);
        this.state = {
            visible: false,
        };
        this.confirm = this.confirm.bind(this);
        this.cancel = this.cancel.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    confirm (newConfig) {
        this.props.setConfig(newConfig);
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

    recordRender () {
        // let {fields} = this.props;
        let header=<div  style={style.header}>
            <div style={{float:'left'}}>动态</div>
            <div style={{float:'right'}}><Icon type="filter" />全部动态</div>
        </div>;

        let body =<Timeline key="recordBody" style={{padding:'0 20px'}}>
            <Timeline.Item dot={<div style={{...style.imgDiv,margin: '0 auto'}}></div>}>
                <div style={style.body.title}>示例电话记录</div>
                <div style={style.header.content}>
                    <p>跟进记录</p>
                    <p>示例电话记录内容</p>
                </div>
                <div style={style.body.footer}>用户名<span style={{marginLeft:'10px'}}>5月6日 18:00</span></div>
            </Timeline.Item>
            <Timeline.Item dot={<div style={{...style.imgDiv,margin: '0 auto',backgroundColor:'#3799ff'}}></div>}>
                <div style={style.body.title}>示例日程名称</div>
                <div style={style.body.content}>
                    <p>任务</p>
                    <p>执行人：用户名、用户名、用户名等5人</p>
                    <p>开始：2017年5月6日 9:00</p>
                    <p>地点：北京市西城区新街口外大街甲14号十月大厦</p>
                </div>
                <div style={style.body.footer}>用户名<span style={{marginLeft:'10px'}}>5月6日 18:00</span></div>
            </Timeline.Item>
            <Timeline.Item dot={<div style={{...style.imgDiv,margin: '0 auto',backgroundColor:'#f66703'}}></div>}>
                <div style={style.body.title}>编辑了资料</div>
                <div style={style.body.content}>
                    <p>资料记录</p>
                    <p>字段名称：旧值 →  新值</p>
                    <p>字段名称：旧值 →  新值</p>
                    <p>字段名称：旧值 →  新值</p>
                </div>
                <div style={style.body.footer}>用户名<span style={{marginLeft:'10px'}}>5月6日 18:00</span></div>
            </Timeline.Item>
        </Timeline>;

        let footer=<div style={style.footer}>
            <span>查看更多</span>
        </div>;

        return <div>
            {header} {body} {footer}
        </div>;
    }

    render () {
        let { delRecord, detail } = this.props;
        let {visible} = this.state;
        return (
            <div style={{margin: '5px 0px'}}>
                <SmartHover edit={this.openModal} close={delRecord}>
                    {this.recordRender()}
                </SmartHover>
                <RecordModal visible={visible} detail={detail} confirm={this.confirm} cancel={this.cancel}/>
            </div>
        );
    }
}

export default Record;
