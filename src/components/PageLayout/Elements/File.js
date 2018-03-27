import React, { Component, PropTypes } from 'react';
import { Row, Col, Timeline, Icon, Modal, InputNumber, Checkbox,} from 'antd';
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
        let {displayNum,displayInMobile, displayInWeb} = this.state;
        return (
            visible?<Modal title={'组件-文件'} visible={visible} onOk={this.onOk}
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
        margin: '0 0 20px',
        padding: '0 30px 0 20px',
    },
    body: {
        logImg: {
            backgroundColor: 'gray',
            width: '40px',
            height: '40px',
            borderRadius: '3px',
            color: 'white',
            fontSize: '16px',
            textAlign: 'center',
            lineHeight: '40px',
        },
        title: {
            fontSize: '14px',
            color: '#000000'
        },
        content: {
            margin: '0 10px',
        },
        footer: {
            fontSize: '12px',
            color: 'darkgray',
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

class File extends Component {

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

    fileRender () {
        // let {fields} = this.props;
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
            <span>文件（99）</span>
            <div style={{float: 'right'}}><Icon type="plus" style={{color:'red'}}/></div>
        </div>;

        let body = <div style={style.body.content}>
            <Row>
                <Col span={2}>
                    <div style={{...style.body.logImg,backgroundColor: '#ea6450'}}>P</div>
                </Col>
                <Col style={{borderBottom: '1px #f2f2f2 solid', padding: '0 20px'}} span={22}>
                    <div style={{overflow: 'auto'}}>
                        <span style={{float: 'left'}}>PPT文件名称.ppt</span>
                        <span style={{float: 'right'}}>9:00</span>
                    </div>
                    <div style={style.body.footer}>0.2MB 来自 用户名</div>
                </Col>
            </Row>

            <Row>
                <Col span={2}>
                    <div style={{...style.body.logImg,backgroundColor: '#3397db'}}>W</div>
                </Col>
                <Col style={{borderBottom: '1px #f2f2f2 solid', padding: '0 20px'}} span={22}>
                    <div style={{overflow: 'auto'}}>
                        <span style={{float: 'left'}}>Word文件名称.doc</span>
                        <span style={{float: 'right'}}>9:00</span>
                    </div>
                    <div style={style.body.footer}>0.2MB 来自 用户名</div>
                </Col>
            </Row>

            <Row>
                <Col span={2}>
                    <div style={{...style.body.logImg,backgroundColor: '#29932f'}}>X</div>
                </Col>
                <Col style={{borderBottom: '1px #f2f2f2 solid', padding: '0 20px'}} span={22}>
                    <div style={{overflow: 'auto'}}>
                        <span style={{float: 'left'}}>Excel文件名称.xls</span>
                        <span style={{float: 'right'}}>9:00</span>
                    </div>
                    <div style={style.body.footer}>0.2MB 来自 用户名</div>
                </Col>
            </Row>
        </div>;

        let footer = <div style={style.footer}>
            <span>查看更多</span>
        </div>;

        return <div>
            {header} {body} {footer}
        </div>;
    }

    render () {
        let { delFile, detail } = this.props;
        let {visible} = this.state;
        return (
            <div style={{margin: '5px 0px'}}>
                <SmartHover edit={this.openModal} close={delFile}>
                    {this.fileRender()}
                </SmartHover>
                <FileModal visible={visible} detail={detail} confirm={this.confirm} cancel={this.cancel}/>
            </div>
        );
    }
}

export default File;
