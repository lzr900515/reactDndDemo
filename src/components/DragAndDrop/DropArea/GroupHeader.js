import React, { Component, PropTypes } from 'react';
import { Modal, Input, Icon, Row, Col, Radio, Checkbox } from 'antd';
const RadioGroup = Radio.Group;
// const CheckboxGroup = Checkbox.Group;
const headerStyle = {
    body: {
        position: 'relative',
        borderBottom: '2px solid #53688e',
        paddingBottom: '5px',
        marginBottom: '10px',
    },
    modalDiv: {
        lineHeight: '28px'
    },
    modalRow: {
        marginBottom: '10px'
    }
};
const options = [
    {label: '新建/编辑页面', value: 'showInNewEditPage'},
    {label: '详细资料页面', value: 'showInDetailPage'},
];
class GroupBoard extends Component {
    constructor (props) {
        super(props);
        this.setGroupConfig = this.setGroupConfig.bind(this);
        // this.setOrder = this.setOrder.bind(this);
        // this.setColNum = this.setColNum.bind(this);
        this.showModal = this.showModal.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        // this.setGroupName = this.setGroupName.bind(this);
        this.state = {
            visible: false,
            groupConfig: {
                group: '分组名称',
                showInNewEditPage: true, //名称显示在：新建、编辑页面
                showInDetailPage: true, //名称显示在：详细资料页面
                colNum: '1',//布局列数
                order: '1',//1:Z字,2:N字
            }
        };
    }

    setGroupConfig (e, itemName) {
        let {groupConfig} = this.state;
        groupConfig[itemName] = e.target ? e.target.value : e;
        this.setState(groupConfig);
    }

    // setColNum (e) {
    //   let {groupConfig} = this.state;
    //   groupConfig.colNum = e.target.value;
    //   this.setState(groupConfig);
    // }
    //
    // setOrder (e) {
    //   let {groupConfig} = this.state;
    //   groupConfig.order = e.target.value;
    //   this.setState(groupConfig);
    // }
    //
    // setGroupName (e) {
    //   let {groupConfig} = this.state;
    //   groupConfig.group = e.target.value;
    //   this.setState(groupConfig);
    // }

    showModal () {
        let {groupConfig} = this.state;
        let {config} = this.props;
        groupConfig = {
            group: config.group ? config.group : '分组名称',
            // nameDisplayIn: [],//['1']:新建/编辑页面 ['2']:详细资料页面 ['1','2']:新建/编辑页面&&详细资料页面
            showInNewEditPage: !!config.showInNewEditPage, //名称显示在：新建、编辑页面
            showInDetailPage: !!config.showInDetailPage, //名称显示在：详细资料页面
            colNum: config.colNum ? config.colNum : '1',//布局列数
            order: config.order ? config.order : '1',//1:Z字,2:N字
        };
        this.setState({
            visible: true,
            groupConfig: groupConfig,
        });
    }

    handleOk (e) {
        this.props.setGroupConfig(this.state.groupConfig);
        this.setState({
            visible: false,
        });
    }

    handleCancel (e) {
        this.setState({
            visible: false,
        });
    }

    render () {
        let {config, deletable, delGroup} = this.props;
        let {groupConfig} = this.state;
        return (
            <div style={headerStyle.body}>
                <Modal title={config.group} visible={this.state.visible}
                       onOk={this.handleOk} onCancel={this.handleCancel}>
                    <Row style={headerStyle.modalRow}>
                        <Col span={6}>
                            <div style={headerStyle.modalDiv}>分组名称</div>
                        </Col>
                        <Col span={12}>
                            <Input placeholder="Basic usage" value={groupConfig.group}
                                   onChange={(e) => {this.setGroupConfig(e, 'group');}}/>
                        </Col>
                    </Row>
                    <Row style={headerStyle.modalRow}>
                        <Col span={6}>
                            <div style={headerStyle.modalDiv}>名称显示在</div>
                        </Col>
                        <Col span={12}>
                            <Checkbox checked={groupConfig.showInNewEditPage} disabled={this.state.disabled}
                                      onChange={(e)=>{this.setGroupConfig(e.target.checked, 'showInNewEditPage')}}>
                                新建/编辑页面
                            </Checkbox>
                            <Checkbox checked={groupConfig.showInDetailPage} disabled={this.state.disabled}
                                      onChange={(e)=>{this.setGroupConfig(e.target.checked, 'showInDetailPage')}}>
                                详细资料页面
                            </Checkbox>
                            {/*<CheckboxGroup options={options} value={groupConfig.nameDisplayIn}*/}
                                           {/*onChange={(e) => {this.setGroupConfig(e, 'nameDisplayIn');}}/>*/}
                        </Col>
                    </Row>
                    <Row style={headerStyle.modalRow}>
                        <Col span={6}>
                            <div style={headerStyle.modalDiv}>布局列数</div>
                        </Col>
                        <Col span={12}>
                            <RadioGroup disabled={true} onChange={(e) => {this.setGroupConfig(e, 'colNum');}}
                                        value={groupConfig.colNum}>
                                <Radio value={'1'}>1列</Radio>
                                <Radio value={'2'}>2列</Radio>
                            </RadioGroup>
                        </Col>
                    </Row>
                    <Row style={headerStyle.modalRow}>
                        <Col span={6}>
                            <div style={headerStyle.modalDiv}>字段顺序</div>
                        </Col>
                        <Col span={12}>
                            <RadioGroup disabled={true} onChange={(e) => {this.setGroupConfig(e, 'order');}}
                                        value={groupConfig.order}>
                                <Radio value={'1'}>Z字</Radio>
                                <Radio value={'2'}>N字</Radio>
                            </RadioGroup>
                        </Col>
                    </Row>
                </Modal>

                <Icon type="bars"/>
                {config.group}
                <span style={{position: 'absolute', right: '20px'}}>
          <span onClick={delGroup}>
            <Icon type="minus-circle-o" style={{visibility: deletable ? '' : 'hidden', paddingRight: '10px'}}/>
          </span>
          <span onClick={this.showModal}>
            <Icon type="info-circle"/>
          </span>
        </span>
            </div>
        );
    }
}
export default GroupBoard;
