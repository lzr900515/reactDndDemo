import React, { Component, PropTypes } from 'react';
import { Row, Col, Timeline, Icon, Modal, InputNumber, Checkbox, } from 'antd';
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
            visible ? <Modal title={'组件-动态'} visible={visible} onOk={this.onOk}
                             onCancel={cancel}>
                <div style={styleForModal.group}>
                    <label style={styleForModal.title}>显示数量（最多30条）</label>
                    <div>
                        <InputNumber min={0} max={30} value={displayNum} onChange={this.changeDisplayNum}
                                     style={{width: '150px'}}/>
                    </div>
                </div>
                <div style={styleForModal.group}>
                    <label style={styleForModal.title}>可快速创建跟进记录</label>
                    <div>
                        <Checkbox checked={quickFollowRecord}
                                  onChange={this.changeQuickFR}></Checkbox>
                    </div>
                </div>
            </Modal> : null
        );
    }
}

const style = {
    imgDiv: {
        width: '24px',
        height: '24px',
        backgroundColor: 'rgba(244, 165, 35, 1)',
        borderRadius: '3px',
    },
    header: {
        borderBottom: '1px #f2f2f2 solid',
        overflow: 'auto',
        margin: '0 0 10px',
        padding: '0 30px 10px 20px',
    },
    body: {
        title: {
            fontSize: '14px',
            color: '#000000'
        },
        content: {
            fontSize: '12px',
            color: '#666666',
        },
        footer: {
            fontSize: '12px',
            color: '#000000',
        }
    },
    footer: {
        borderTop: '1px #f2f2f2 solid',
        textAlign: 'center',
        lineHeight: '40px',
        fontSize: '14px',
        color: 'darkgray',
    }
};

class WebRecord extends Component {

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
        let {theme} = this.props;
        let header = <div style={style.header}>
            <div style={{float: 'left'}}>动态</div>
            <div style={{
                float: 'right',
                border: '1px #d1d1d1 solid',
                borderRadius: '4px',
                padding: '3px 15px',
                fontSize: '12px',
                color: '#333333',
            }}>
                <Icon type="plus"/>筛选
            </div>
        </div>;

        let body = null;
        if (theme !== 'small') {
            body = <Timeline key="recordBody" style={{padding: '10px 20px 0px', overflow: 'auto'}}>
                <Timeline.Item dot={<div style={{...style.imgDiv, margin: '0 auto'}}></div>}>
                    <Row>
                        <Col span={12}>
                            <div style={style.body.title}>示例电话记录</div>
                        </Col>
                        <Col span={12}>
                            <div style={{...style.body.footer, textAlign: 'right'}}>
                                5月6日 18:00<span style={{marginLeft: '10px', color: '#3799ff'}}>用户名</span>
                            </div>
                        </Col>
                    </Row>
                    <div style={style.header.content}>
                        <p>跟进记录</p>
                        <p>示例电话记录内容</p>
                    </div>
                </Timeline.Item>
                <Timeline.Item
                    dot={<div style={{...style.imgDiv, margin: '0 auto', backgroundColor: '#3799ff'}}></div>}>
                    <Row>
                        <Col span={12}>
                            <div style={style.body.title}>示例日程名称</div>
                        </Col>
                        <Col span={12}>
                            <div style={{...style.body.footer, textAlign: 'right'}}>
                                5月6日 18:00<span style={{marginLeft: '10px', color: '#3799ff'}}>用户名</span>
                            </div>
                        </Col>
                    </Row>
                    <div style={style.body.content}>
                        <p>任务</p>
                        <p>执行人：用户名、用户名、用户名等5人</p>
                        <p>开始：2017年5月6日 9:00</p>
                        <p>地点：北京市西城区新街口外大街甲14号十月大厦</p>
                    </div>
                </Timeline.Item>
                <Timeline.Item
                    dot={<div style={{...style.imgDiv, margin: '0 auto', backgroundColor: '#f66703'}}></div>}>
                    <Row>
                        <Col span={12}>
                            <div style={style.body.title}>编辑了资料</div>
                        </Col>
                        <Col span={12}>
                            <div style={{...style.body.footer, textAlign: 'right'}}>
                                5月6日 18:00<span style={{marginLeft: '10px', color: '#3799ff'}}>用户名</span>
                            </div>
                        </Col>
                    </Row>
                    <div style={style.body.content}>
                        <p>资料记录</p>
                        <p>字段名称：旧值 → 新值</p>
                        <p>字段名称：旧值 → 新值</p>
                        <p>字段名称：旧值 → 新值</p>
                    </div>
                </Timeline.Item>
            </Timeline>;
        } else {
            body = <Timeline key="recordBody" style={{padding: '10px 20px 0px', overflow: 'auto'}}>
                <Timeline.Item dot={<div style={{...style.imgDiv, margin: '0 auto'}}></div>}>
                    <div style={style.body.title}>示例电话记录</div>
                    <div style={style.header.content}>
                        <p>跟进记录</p>
                    </div>
                    <Row>
                        <Col span={12}>
                            <div style={{...style.body.footer, color: '#3799ff'}}>用户名</div>
                        </Col>
                        <Col span={12}>
                            <div style={{...style.body.footer, textAlign: 'right'}}>
                                5月6日 18:00
                            </div>
                        </Col>
                    </Row>
                </Timeline.Item>
                <Timeline.Item
                    dot={<div style={{...style.imgDiv, margin: '0 auto', backgroundColor: '#3799ff'}}></div>}>
                    <div style={style.body.title}>示例日程名称</div>
                    <div style={style.body.content}>
                        <p>任务</p>
                    </div>
                    <Row>
                        <Col span={12}>
                            <div style={{...style.body.footer, color: '#3799ff'}}>用户名</div>
                        </Col>
                        <Col span={12}>
                            <div style={{...style.body.footer, textAlign: 'right'}}>
                                5月6日 18:00
                            </div>
                        </Col>
                    </Row>
                </Timeline.Item>
                <Timeline.Item
                    dot={<div style={{...style.imgDiv, margin: '0 auto', backgroundColor: '#f66703'}}></div>}>
                    <div style={style.body.title}>编辑了资料</div>
                    <div style={style.body.content}>
                        <p>资料记录</p>
                    </div>
                    <Row>
                        <Col span={12}>
                            <div style={{...style.body.footer, color: '#3799ff'}}>用户名</div>
                        </Col>
                        <Col span={12}>
                            <div style={{...style.body.footer, textAlign: 'right'}}>
                                5月6日 18:00
                            </div>
                        </Col>
                    </Row>
                </Timeline.Item>
                <Timeline.Item
                    dot={<div style={{...style.imgDiv, margin: '0 auto', backgroundColor: '#f66703'}}></div>}>
                    <div style={style.body.title}>新建了资料</div>
                    <div style={style.body.content}>
                        <p>资料记录</p>
                    </div>
                    <Row>
                        <Col span={12}>
                            <div style={{...style.body.footer, color: '#3799ff'}}>用户名</div>
                        </Col>
                        <Col span={12}>
                            <div style={{...style.body.footer, textAlign: 'right'}}>
                                5月6日 18:00
                            </div>
                        </Col>
                    </Row>
                </Timeline.Item>
            </Timeline>;
        }

        let footer = <div style={style.footer}>
            <span>查看更多</span>
        </div>;

        let addWorkFlow = <div style={{
            ...style.body.content,
            height: '38px',
            margin: '0px 20px',
            border: '1px solid lightgray',
            paddingLeft: '10px',
            lineHeight: '38px',
            borderRadius: '4px',
            color: 'lightgray',
        }}>
            添加跟进记录
        </div>;

        return <div>
            {header} {addWorkFlow} {body} {null}
        </div>;
    }

    render () {
        let {delRecord, detail} = this.props;
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

export default WebRecord;
