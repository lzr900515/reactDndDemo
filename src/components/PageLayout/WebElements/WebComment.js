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

class CommentModal extends Component {
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
        let {displayNum, displayInMobile, displayInWeb} = this.state;
        return (
            visible ? <Modal title={'组件-评论'} visible={visible} onOk={this.onOk}
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
        margin: '0 0 0px',
        padding: '0 0px 0 20px',
    },
    body: {
        circleImg: {
            backgroundColor: 'gray',
            width: '32px',
            height: '32px',
            borderRadius: '30px',
            color: 'white',
            fontSize: '14px',
            textAlign: 'center',
            lineHeight: '32px',
        },
        rectangleImg: {
            backgroundColor: 'gray',
            width: '60px',
            height: '40px',
            lineHeight: '40px',
            color: 'white',
            fontSize: '14px',
            textAlign: 'center',
            margin: '0px 10px 10px 0px',
            display: 'inline-block',
        },
        title: {
            fontSize: '14px',
            color: '#000000'
        },
        content: {
            margin: '0 20px',
            overflow: 'auto',
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

class WebComment extends Component {

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

    commentRender () {
        // let {fields} = this.props;
        let {theme} = this.props;
        let header = <div style={{...style.header, marginBottom:'10px'}}>
            <div style={{
                ...style.imgDiv,
                margin: '0 auto',
                verticalAlign: 'middle',
                backgroundColor: '#3399cc',
                display: 'inline-block',
                margin: '0 10px 0px 0px',
            }}></div>
            <div style={{display: 'inline-block', verticalAlign: 'middle'}}>评论（12）</div>
        </div>;
        let body = null;
        if (theme == 'small') {
            body = <div style={style.body.content}>
                <div style={{
                    border: '1px #f2f2f2 solid',
                    height: '45px',
                    // margin: '0px 0px 10px 0px',
                    color: '#999999',
                    lineHeight: '45px',
                    paddingLeft: '10px',
                }}>
                    <Icon type="edit"/>发表评论...
                </div>
                <div style={{margin: '10px 0px'}}>
                    <div style={{borderBottom: '1px #f2f2f2 solid',}}>
                        <div style={{overflow: 'auto'}}>
                            <span style={{float: 'left'}}>用户名</span>
                            <span style={{float: 'right'}}>18:20</span>
                        </div>
                        <div>示例评论内容</div>
                    </div>
                </div>

                <div style={{margin: '10px 0px'}}>
                    <div style={{borderBottom: '1px #f2f2f2 solid',}}>
                        <div style={{overflow: 'auto'}}>
                            <span style={{float: 'left'}}>用户名</span>
                            <span style={{float: 'right'}}>昨天，18:20</span>
                        </div>
                        <div>示例评论内容</div>
                        <div style={{marginBottom: '10px'}}>
                            <div style={style.body.rectangleImg}>图片</div>
                            <div style={style.body.rectangleImg}>图片</div>
                            <div style={style.body.rectangleImg}>图片</div>
                            <div style={style.body.rectangleImg}>图片</div>
                            <div style={style.body.rectangleImg}>图片</div>
                            <div style={style.body.rectangleImg}>图片</div>
                            <div style={style.body.rectangleImg}>图片</div>
                            <div style={style.body.rectangleImg}>图片</div>
                            <div style={style.body.rectangleImg}>图片</div>
                        </div>
                    </div>
                </div>

                <div style={{margin: '10px 0px'}}>
                    <div style={{borderBottom: '1px #f2f2f2 solid',}}>
                        <div style={{overflow: 'auto'}}>
                            <span style={{float: 'left'}}>用户名</span>
                            <span style={{float: 'right'}}>18:20</span>
                        </div>
                        <div>示例评论内容</div>
                    </div>
                </div>
            </div>;
        } else {
            body = <div style={style.body.content}>
                <div style={{
                    border: '1px #f2f2f2 solid',
                    height: '45px',
                    // margin: '0px 0px 10px 0px',
                    color: '#999999',
                    lineHeight: '45px',
                    paddingLeft: '10px',
                }}>
                    <Icon type="edit"/>发表评论...
                </div>
                <div style={{margin: '10px 0px'}}>
                    <div style={{float: 'left'}}>
                        <div style={style.body.circleImg}>头</div>
                    </div>
                    <div style={{borderBottom: '1px #f2f2f2 solid', marginLeft:'40px'}}>
                        <div style={{overflow: 'auto'}}>
                            <span style={{float: 'left'}}>用户名</span>
                            <span style={{float: 'right'}}>18:20</span>
                        </div>
                        <div>示例评论内容</div>
                    </div>
                </div>

                <div style={{margin: '10px 0px'}}>
                    <div style={{float: 'left'}}>
                        <div style={style.body.circleImg}>头</div>
                    </div>
                    <div style={{borderBottom: '1px #f2f2f2 solid', marginLeft:'40px'}}>
                        <div style={{overflow: 'auto'}}>
                            <span style={{float: 'left'}}>用户名</span>
                            <span style={{float: 'right'}}>昨天，18:20</span>
                        </div>
                        <div>示例评论内容</div>
                        <div style={{marginBottom: '10px'}}>
                            <div style={style.body.rectangleImg}>图片</div>
                            <div style={style.body.rectangleImg}>图片</div>
                            <div style={style.body.rectangleImg}>图片</div>
                            <div style={style.body.rectangleImg}>图片</div>
                            <div style={style.body.rectangleImg}>图片</div>
                            <div style={style.body.rectangleImg}>图片</div>
                            <div style={style.body.rectangleImg}>图片</div>
                            <div style={style.body.rectangleImg}>图片</div>
                            <div style={style.body.rectangleImg}>图片</div>
                        </div>
                    </div>
                </div>

                <div style={{margin: '10px 0px'}}>
                    <div style={{float: 'left'}}>
                        <div style={style.body.circleImg}>头</div>
                    </div>
                    <div style={{borderBottom: '1px #f2f2f2 solid', marginLeft:'40px'}}>
                        <div style={{overflow: 'auto'}}>
                            <span style={{float: 'left'}}>用户名</span>
                            <span style={{float: 'right'}}>18:20</span>
                        </div>
                        <div>示例评论内容</div>
                    </div>
                </div>
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
        let {delComment, detail} = this.props;
        let {visible} = this.state;
        return (
            <div style={{margin: '5px 0px'}}>
                <SmartHover edit={this.openModal} close={delComment}>
                    {this.commentRender()}
                </SmartHover>
                <CommentModal visible={visible} detail={detail} confirm={this.confirm} cancel={this.cancel}/>
            </div>
        );
    }
}

export default WebComment;
