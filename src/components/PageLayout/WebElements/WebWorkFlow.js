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

class WorkFlowModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            displayNum: 0,
            displayInWeb: false,
            displayInMobile: false,
        };
        this.changeDisplayNum = this.changeDisplayNum.bind(this);
        this.changeDisplayIn = this.changeDisplayIn.bind(this);
        this.onOk = this.onOk.bind(this);
    }

    onOk () {
        let {displayNum, displayInWeb, displayInMobile,} = this.state;
        this.props.confirm({
            displayNum,
            displayInWeb,
            displayInMobile,
        });
    }

    componentWillReceiveProps (nextProps) {
        // if (!_.isEqual(this.props.detail, nextProps.detail)) {
        this.setState({
            displayNum: ~~_.cloneDeep(nextProps.detail.displayNum),
            displayInWeb: !!_.cloneDeep(nextProps.detail.displayInWeb),
            displayInMobile: !!_.cloneDeep(nextProps.detail.displayInMobile),
        });
        // }
    }

    changeDisplayIn (e, type) {
        if (type == 'web') {
            this.setState({
                displayInWeb: e.target.checked,
            });
        } else {
            this.setState({
                displayInMobile: e.target.checked,
            });
        }
    }

    changeDisplayNum (value) {
        this.setState({
            displayNum: value,
        });
    }

    render () {
        let {visible, cancel} = this.props;
        let {displayNum,displayInMobile, displayInWeb} = this.state;
        return (
            visible?<Modal title={'组件-工作流'} visible={visible} onOk={this.onOk}
                           onCancel={cancel}>
                <div style={styleForModal.group}>
                    <label style={styleForModal.title}>显示数量（最多10条）</label>
                    <div>
                        <InputNumber min={0} max={10} value={displayNum} onChange={this.changeDisplayNum}
                                     style={{width: '150px'}}/>
                    </div>
                    {/*<div>*/}
                        {/*<Checkbox checked={displayInWeb}*/}
                                  {/*onChange={(e) => {this.changeDisplayIn(e, 'web');}}>网页端</Checkbox>*/}
                        {/*<Checkbox checked={displayInMobile}*/}
                                  {/*onChange={(e) => {this.changeDisplayIn(e, 'mobile');}}>移动端</Checkbox>*/}
                    {/*</div>*/}
                </div>
            </Modal>:null
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
        margin: '0 0 0px',
        padding: '0 30px 0 20px',
    },
    body: {
        flowItem: {
            padding: '5px',
            borderBottom: '1px #f2f2f2 solid',
        },
        content: {
            margin: '0 10px',
            overflow: 'auto',
        },
        footer: {
            fontSize: '12px',
            color: '#333333',
        }
    },
    footer: {
        // borderTop: '1px #f2f2f2 solid',
        textAlign: 'center',
        lineHeight: '40px',
        fontSize: '14px',
        color: 'darkgray',
    }
};

class WebWorkFlow extends Component {

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

    workFlowRender () {
        // let {fields} = this.props;
        let {theme} = this.props;
        let header = <div style={style.header}>
            <div style={{float: 'left'}}>
                <div style={{
                    ...style.imgDiv,
                    margin: '0 auto',
                    backgroundColor: '#f66703',
                    display: 'inline-block',
                    margin: '0 10px 0px 0px',
                }}></div>
            </div>
            <span>工作流</span>
        </div>;

        let body = null;
        if (theme == 'small') {
            body = <div style={style.body.content}>
                <div style={style.body.flowItem}>
                    <Row>
                        <Col span={16}>
                            <div style={{...style.body.footer, color: '#000000'}}>示例流程名称</div>
                        </Col>
                        <Col span={8}>
                            <div style={{...style.body.footer, 'textAlign': 'right'}}>2分钟前</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={16}>
                            <div style={style.body.footer}>流程节点</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={16}>
                            <div style={{...style.body.footer, color: '#000000'}}>用户名</div>
                        </Col>
                    </Row>
                </div>

                <div style={style.body.flowItem}>
                    <Row>
                        <Col span={16}>
                            <div style={{...style.body.footer, color: '#000000'}}>示例流程名称</div>
                        </Col>
                        <Col span={8}>
                            <div style={{...style.body.footer, 'textAlign': 'right'}}>15：24</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={16}>
                            <div style={style.body.footer}>流程节点</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={16}>
                            <div style={{...style.body.footer, color: '#000000'}}>用户名</div>
                        </Col>
                    </Row>
                </div>

                <div style={style.body.flowItem}>
                    <Row>
                        <Col span={16}>
                            <div style={{...style.body.footer, color: '#000000'}}>示例流程名称</div>
                        </Col>
                        <Col span={8}>
                            <div style={{...style.body.footer, 'textAlign': 'right'}}>昨天 15：24</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={16}>
                            <div style={style.body.footer}>流程节点</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={16}>
                            <div style={{...style.body.footer, color: '#000000'}}>用户名</div>
                        </Col>
                    </Row>
                </div>
            </div>;
        }else{
            body = <div style={style.body.content}>
                <Row style={{lineHeight: '31px', borderTop: '0px rgb(187, 187, 187) solid',}}>
                    <Col span={6}>
                        <div style={{...style.body.footer, color: '#6591be'}}>流程</div>
                    </Col>
                    <Col span={6}>
                        <div style={{...style.body.footer, color: '#6591be'}}>进度</div>
                    </Col>
                    <Col span={6}>
                        <div style={{...style.body.footer, color: '#6591be'}}>发起人</div>
                    </Col>
                    <Col span={6}>
                        <div style={{...style.body.footer, color: '#6591be'}}>发起时间</div>
                    </Col>
                </Row>
                <Row  style={{lineHeight: '31px', borderTop: '1px rgb(187, 187, 187) solid',}}>
                    <Col span={6}>
                        <div style={{...style.body.footer, color: '#286cd5'}}>示例流程名称</div>
                    </Col>
                    <Col span={6}>
                        <div style={{...style.body.footer, }}>已结束</div>
                    </Col>
                    <Col span={6}>
                        <div style={{...style.body.footer, }}>用户名</div>
                    </Col>
                    <Col span={6}>
                        <div style={{...style.body.footer, }}>2017.01.23 12:00</div>
                    </Col>
                </Row>
                <Row  style={{lineHeight: '31px', borderTop: '1px rgb(187, 187, 187) solid',}}>
                    <Col span={6}>
                        <div style={{...style.body.footer, color: '#286cd5'}}>示例流程名称</div>
                    </Col>
                    <Col span={6}>
                        <div style={{...style.body.footer, }}>直属主管审批</div>
                    </Col>
                    <Col span={6}>
                        <div style={{...style.body.footer, }}>用户名</div>
                    </Col>
                    <Col span={6}>
                        <div style={{...style.body.footer, }}>2017.01.23 09:00</div>
                    </Col>
                </Row>
                <Row  style={{lineHeight: '31px', borderTop: '1px rgb(187, 187, 187) solid',}}>
                    <Col span={6}>
                        <div style={{...style.body.footer, color: '#286cd5'}}>示例流程名称</div>
                    </Col>
                    <Col span={6}>
                        <div style={{...style.body.footer, }}>二级主管审批</div>
                    </Col>
                    <Col span={6}>
                        <div style={{...style.body.footer, }}>用户名</div>
                    </Col>
                    <Col span={6}>
                        <div style={{...style.body.footer, }}>2017.01.23 12:00</div>
                    </Col>
                </Row>
                <Row  style={{lineHeight: '31px', borderTop: '1px rgb(187, 187, 187) solid',}}>
                    <Col span={6}>
                        <div style={{...style.body.footer, color: '#286cd5'}}>示例流程名称</div>
                    </Col>
                    <Col span={6}>
                        <div style={{...style.body.footer, }}>财务确认</div>
                    </Col>
                    <Col span={6}>
                        <div style={{...style.body.footer, }}>用户名</div>
                    </Col>
                    <Col span={6}>
                        <div style={{...style.body.footer, }}>2017.01.23 12:00</div>
                    </Col>
                </Row>
                <Row  style={{lineHeight: '31px', borderTop: '1px rgb(187, 187, 187) solid',}}>
                    <Col span={6}>
                        <div style={{...style.body.footer, color: '#286cd5'}}>示例流程名称</div>
                    </Col>
                    <Col span={6}>
                        <div style={{...style.body.footer, }}>等待至结束日期</div>
                    </Col>
                    <Col span={6}>
                        <div style={{...style.body.footer, }}>用户名</div>
                    </Col>
                    <Col span={6}>
                        <div style={{...style.body.footer, }}>2017.01.23 12:00</div>
                    </Col>
                </Row>
            </div>;
        }

        let footer = <div style={style.footer}>
            <span>查看更多</span>
        </div>;

        return <div>
            {header} {body} {null}
        </div>;
    }

    render () {
        let { delWorkFlow, detail } = this.props;
        let {visible} = this.state;
        return (
            <div style={{margin: '5px 0px'}}>
                <SmartHover edit={this.openModal} close={delWorkFlow}>
                    {this.workFlowRender()}
                </SmartHover>
                <WorkFlowModal visible={visible} detail={detail} confirm={this.confirm} cancel={this.cancel}/>
            </div>
        );
    }
}

export default WebWorkFlow;
