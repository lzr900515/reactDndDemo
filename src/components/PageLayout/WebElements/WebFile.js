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

class FileModal extends Component {
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

    filterOption (inputValue, option) {
        return option.description.indexOf(inputValue) > -1;
    };

    render () {
        let {visible, cancel} = this.props;
        let {displayNum, displayInMobile, displayInWeb} = this.state;
        return (
            visible ? <Modal title={'组件-文件'} visible={visible} onOk={this.onOk}
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
        // borderBottom: '1px #f2f2f2 solid',
        overflow: 'auto',
        margin: '0 0 10px',
        padding: '0 30px 0 20px',
    },
    body: {
        redTag: {
            backgroundColor: '#e15251',
            color: 'white',
            display: 'inline-block',
            verticalAlign: 'top',
        },
        blueTag: {
            backgroundColor: '#3799ff',
            color: 'white',
            display: 'inline-block',
            verticalAlign: 'top',
        },
        grayTag: {
            backgroundColor: '#ccccd5',
            color: 'white',
            display: 'inline-block',
            verticalAlign: 'top',
        },
        content: {
            margin: '0 20px',
            overflow: 'auto',
        },
        footer: {
            fontSize: '12px',
            color: '#333333',
        }
    },
    footer: {
        borderTop: '1px #f2f2f2 solid',
        textAlign: 'center',
        lineHeight: '40px',
        fontSize: '14px',
        color: 'darkgray',
    },
    buttonStyle: {
        border: '1px solid darkgray',
        padding: '3px',
        margin: '3px',
        borderRadius: '5px',
        boxShadow: '0px 0px 1px #afaaaa',
    },
};

class WebFile extends Component {

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

    webFileRender () {
        // let {fields} = this.props;
        let {theme} = this.props;
        let header = <div style={style.header}>
            <div style={{float: 'left'}}>
                <div style={{
                    ...style.imgDiv,
                    margin: '0 auto',
                    backgroundColor: '#f5a524',
                    display: 'inline-block',
                    margin: '0 10px 0px 0px',
                }}></div>
            </div>
            <span>文件</span>
            <div style={{
                float: 'right',
                border: '1px #d1d1d1 solid',
                borderRadius: '4px',
                padding: '3px 15px',
                fontSize: '12px',
                color: '#333333',
            }}>
                <Icon type="plus"/>上传
            </div>
        </div>;
        let body = null;
        if (theme !== 'small') {
            body = <div style={style.body.content}>
                <Row style={{lineHeight: '24px', borderBottom: '2px rgb(187, 187, 187) solid',}}>
                    <Col span={5}>
                        <div style={{...style.body.footer}}>文件名</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>类型</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>文件大小</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>上传人</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>上传时间</div>
                    </Col>
                </Row>
                <Row style={{lineHeight: '31px', borderTop: '1px #f2f2f2 solid',}}>
                    <Col span={5}>
                        <div style={style.body.footer}>Word文件名称.doc</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>word</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>1.2MB</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>用户名</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>2017-12-25 09:00</div>
                    </Col>
                    <Col span={3}>
                        <div style={{textAlign: 'right'}}>
                            <Icon type="caret-down" style={style.buttonStyle}/>
                        </div>
                    </Col>
                </Row>
                <Row style={{lineHeight: '31px', borderTop: '1px #f2f2f2 solid',}}>
                    <Col span={5}>
                        <div style={style.body.footer}>Excel文件名称.xls</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>excel</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>1.2MB</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>用户名</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>2017-12-25 09:00</div>
                    </Col>
                    <Col span={3}>
                        <div style={{textAlign: 'right'}}>
                            <Icon type="caret-down" style={style.buttonStyle}/>
                        </div>
                    </Col>
                </Row>
                <Row style={{lineHeight: '31px', borderTop: '1px #f2f2f2 solid',}}>
                    <Col span={5}>
                        <div style={style.body.footer}>PDF文件名称.pdf</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>pdf</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>1.2MB</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>用户名</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>2017-12-25 09:00</div>
                    </Col>
                    <Col span={3}>
                        <div style={{textAlign: 'right'}}>
                            <Icon type="caret-down" style={style.buttonStyle}/>
                        </div>
                    </Col>
                </Row>
                <Row style={{lineHeight: '31px', borderTop: '1px #f2f2f2 solid',}}>
                    <Col span={5}>
                        <div style={style.body.footer}>PPT文件名称.pdf</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>ppt</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>1.2MB</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>用户名</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>2017-12-25 09:00</div>
                    </Col>
                    <Col span={3}>
                        <div style={{textAlign: 'right'}}>
                            <Icon type="caret-down" style={style.buttonStyle}/>
                        </div>
                    </Col>
                </Row>
                <Row style={{lineHeight: '31px', borderTop: '1px #f2f2f2 solid',}}>
                    <Col span={5}>
                        <div style={style.body.footer}>示例文件名称</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>其它</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>1.2MB</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>用户名</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>2017-12-25 09:00</div>
                    </Col>
                    <Col span={3}>
                        <div style={{textAlign: 'right'}}>
                            <Icon type="caret-down" style={style.buttonStyle}/>
                        </div>
                    </Col>
                </Row>
            </div>;
        } else {
            body = <div style={style.body.content}>
                <Row style={{lineHeight: '24px', borderBottom: '2px rgb(187, 187, 187) solid',}}>
                    <Col span={10}>
                        <div style={{...style.body.footer}}>文件名</div>
                    </Col>
                    <Col span={6}>
                        <div style={{...style.body.footer}}>文件大小</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>上传人</div>
                    </Col>
                </Row>
                <Row style={{lineHeight: '31px', borderTop: '1px #f2f2f2 solid',}}>
                    <Col span={10}>
                        <div style={style.body.footer}>Word文件名称.doc</div>
                    </Col>
                    <Col span={6}>
                        <div style={{...style.body.footer}}>1.2MB</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>用户名</div>
                    </Col>
                    <Col span={4}>
                        <div style={{textAlign: 'right'}}>
                            <Icon type="caret-down" style={style.buttonStyle}/>
                        </div>
                    </Col>
                </Row>
                <Row style={{lineHeight: '31px', borderTop: '1px #f2f2f2 solid',}}>
                    <Col span={10}>
                        <div style={style.body.footer}>Excel文件名称.xls</div>
                    </Col>
                    <Col span={6}>
                        <div style={{...style.body.footer}}>1.2MB</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>用户名</div>
                    </Col>
                    <Col span={4}>
                        <div style={{textAlign: 'right'}}>
                            <Icon type="caret-down" style={style.buttonStyle}/>
                        </div>
                    </Col>
                </Row>
                <Row style={{lineHeight: '31px', borderTop: '1px #f2f2f2 solid',}}>
                    <Col span={10}>
                        <div style={style.body.footer}>PDF文件名称.pdf</div>
                    </Col>
                    <Col span={6}>
                        <div style={{...style.body.footer}}>1.2MB</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>用户名</div>
                    </Col>
                    <Col span={4}>
                        <div style={{textAlign: 'right'}}>
                            <Icon type="caret-down" style={style.buttonStyle}/>
                        </div>
                    </Col>
                </Row>
                <Row style={{lineHeight: '31px', borderTop: '1px #f2f2f2 solid',}}>
                    <Col span={10}>
                        <div style={style.body.footer}>PPT文件名称.pdf</div>
                    </Col>
                    <Col span={6}>
                        <div style={{...style.body.footer}}>1.2MB</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>用户名</div>
                    </Col>
                    <Col span={4}>
                        <div style={{textAlign: 'right'}}>
                            <Icon type="caret-down" style={style.buttonStyle}/>
                        </div>
                    </Col>
                </Row>
                <Row style={{lineHeight: '31px', borderTop: '1px #f2f2f2 solid',}}>
                    <Col span={10}>
                        <div style={style.body.footer}>示例文件名称</div>
                    </Col>
                    <Col span={6}>
                        <div style={{...style.body.footer}}>1.2MB</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>用户名</div>
                    </Col>
                    <Col span={4}>
                        <div style={{textAlign: 'right'}}>
                            <Icon type="caret-down" style={style.buttonStyle}/>
                        </div>
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
        let {delFile, detail} = this.props;
        let {visible} = this.state;
        return (
            <div style={{margin: '5px 0px'}}>
                <SmartHover edit={this.openModal} close={delFile}>
                    {this.webFileRender()}
                </SmartHover>
                <FileModal visible={visible} detail={detail} confirm={this.confirm} cancel={this.cancel}/>
            </div>
        );
    }
}

export default WebFile;
