import React, { Component, PropTypes } from 'react';
import { Menu, Input, Row, Col, Modal, Transfer, Icon } from 'antd';
import SmartHover from './SmartHover';
import _ from 'lodash';

const style = {
    buttonIcon: {
        width: '29px',
        height: '29px',
        backgroundColor: 'rgba(102, 102, 102, 1)',
        borderRadius: '150px',
        margin: '0 auto',
    },
};
class ButtonBar extends Component {

    constructor (props) {
        super(props);
        this.state = {
            visible: false,
            btnTargetKeys: props.selectedArr ? _.cloneDeep(props.selectedArr) : [],
            btnListSource: props.allArr ? _.cloneDeep(props.allArr) : [],
        };
        this.confirm = this.confirm.bind(this);
        this.cancel = this.cancel.bind(this);
        this.buttonBarRender = this.buttonBarRender.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.filterOption = this.filterOption.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount () {
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            btnListSource: nextProps.allArr ? _.cloneDeep(nextProps.allArr) : [],
            btnTargetKeys: nextProps.selectedArr ? _.cloneDeep(nextProps.selectedArr) : [],
        });
    }

    confirm () {
        this.props.setSelectedArr(this.state.btnTargetKeys);
        this.closeModal();
    }

    cancel () {
        this.setState({
            btnTargetKeys: _.cloneDeep(this.props.selectedArr),
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

    filterOption (inputValue, option) {
        return option.label.indexOf(inputValue) > -1;
    };

    handleChange (targetKeys, direction, moveKeys) {
        if (direction == 'right') {
            let oldArr = [];
            targetKeys.map(function (item) {
                if (moveKeys.indexOf(item) == -1) {
                    oldArr.push(item);
                }
            });
            oldArr = oldArr.concat(moveKeys);
            this.setState({btnTargetKeys: oldArr});
        } else {
            this.setState({btnTargetKeys: targetKeys});
        }
    };

    buttonBarRender () {
        let jsxDOM = [];
        let {selectedArr, allArr} = this.props;
        if (selectedArr) {
            let span = (selectedArr.length > 4 || selectedArr.length == 0) ? 6 : (24 / selectedArr.length);
            // btnTargetKeys = btnListSource;
            for (let i = 0; i < selectedArr.length; i++) {
                if (i > 3) {
                    break;
                }
                let btnDetail = {};
                allArr.some(function (item) {
                    if ((item.appName + '@' + item.name) == selectedArr[i]) {
                        btnDetail = item;
                        return true;
                    } else {
                        return false;
                    }
                });
                if (i < 3) {
                    jsxDOM.push(
                        <Col span={span} key={i}>
                            <div style={{textAlign: 'center'}}>
                                <div style={style.buttonIcon}></div>
                                <span>{btnDetail.label}</span>
                            </div>
                        </Col>
                    );
                } else if (i == 3) {
                    if (selectedArr.length > 4) {
                        jsxDOM.push(
                            <Col span={span} key={i}>
                                <div style={{textAlign: 'center'}}>
                                    <div style={style.buttonIcon}></div>
                                    <span style={{margin: '0 auto'}}>更多</span>
                                </div>
                            </Col>
                        );
                    } else {
                        jsxDOM.push(
                            <Col span={span} key={i}>
                                <div style={{textAlign: 'center'}}>
                                    <div style={style.buttonIcon}></div>
                                    <span style={{margin: '0 auto'}}>{btnDetail.label}</span>
                                </div>
                            </Col>
                        );
                    }
                }
            }
        }
        return jsxDOM;
    }

    render () {
        let {visible, btnTargetKeys, btnListSource} = this.state;
        return (
            <SmartHover edit={this.openModal} style={{width: '400px', minHeight: '28px', overflow: 'auto'}}>
                <Row>
                    {this.buttonBarRender()}
                </Row>
                {/*删除页面布局*/}
                {visible ? <Modal title={'组件-按钮工具栏'} visible={visible} onOk={this.confirm} onCancel={this.cancel}>
                    {/*footer={null}*/}
                    <Transfer dataSource={btnListSource} showSearch filterOption={this.filterOption}
                              targetKeys={btnTargetKeys} onChange={this.handleChange} render={item => item.label}
                              titles={['可选', '已选']} notFoundContent={'暂无数据'} searchPlaceholder={'搜索'}
                              rowKey={record => record.appName + '@' + record.name}
                    />
                </Modal> : null}
            </SmartHover>
        );
    }
}

export default ButtonBar;
