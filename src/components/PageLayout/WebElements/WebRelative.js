import React, { Component, PropTypes } from 'react';
import { Row, Col, Transfer, Icon, Modal, InputNumber, Checkbox, Radio, Select } from 'antd';
import { connect } from 'dva';
import SmartHover from '../List/SmartHover';
const RadioGroup = Radio.Group;
const Option = Select.Option;

const styleForModal = {
    title: {
        color: '#53688E',
    },
    group: {
        margin: '0 10px 10px',
    }
};

// const displayOrderDefaultList = [
//     {
//         name: 'createdOn',
//         label: '创建时间',
//     }, {
//         name: 'updatedOn',
//         label: '修改时间',
//     }
// ];
class RelativeModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            selectedFields: [],
            displayNum: 0,
            displayInWeb: false,
            displayInMobile: false,
            sortBy: 'createdOn',
            sortOrder: 'desc',//acs 正序 desc 倒序
        };
        this.selectFields = this.selectFields.bind(this);
        this.filterOption = this.filterOption.bind(this);
        this.changeDisplayNum = this.changeDisplayNum.bind(this);
        this.changeDisplayIn = this.changeDisplayIn.bind(this);
        this.changeSortOrder = this.changeSortOrder.bind(this);
        this.onOk = this.onOk.bind(this);
        this.changeSortBy = this.changeSortBy.bind(this);
    }

    onOk () {
        let {selectedFields, displayNum, displayInWeb, displayInMobile, sortBy, sortOrder} = this.state;
        this.props.confirm({
            displayFields:selectedFields,
            displayNum,
            displayInWeb,
            displayInMobile,
            sortBy,
            sortOrder,
        });
    }

    componentWillReceiveProps (nextProps) {
        // if (!_.isEqual(this.props.detail, nextProps.detail)) {
        let selectedFields = _.cloneDeep(nextProps.detail.displayFields);
        // if(!selectedFields){
        //     selectedFields = ["name","createdOn","owner"];
        // }
        this.setState({
            selectedFields: selectedFields,
            displayNum: ~~_.cloneDeep(nextProps.detail.displayNum),
            displayInWeb: !!_.cloneDeep(nextProps.detail.displayInWeb),
            displayInMobile: !!_.cloneDeep(nextProps.detail.displayInMobile),
            sortBy: _.cloneDeep(nextProps.detail.sortBy) || 'createdOn',
            sortOrder: _.cloneDeep(nextProps.detail.sortOrder) || 'desc',
        });
        // }
    }

    changeSortBy (value) {
        this.setState({
            sortBy: value,
        });
    }

    changeSortOrder (e) {
        this.setState({
            sortOrder: e.target.value,
        });
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
        // console.log(option);
        return option.label.indexOf(inputValue) > -1;
    };

    selectFields (targetKeys, direction, moveKeys) {
        if (direction == 'right') {
            let oldArr = [];
            targetKeys.map(function (item) {
                if (moveKeys.indexOf(item) == -1) {
                    oldArr.push(item);
                }
            });
            oldArr = oldArr.concat(moveKeys);
            this.setState({selectedFields: oldArr.slice(0, 8)});
        } else {
            this.setState({selectedFields: targetKeys});
        }
    };

    render () {
        let {allFields, visible, cancel} = this.props;
        let {selectedFields, displayNum, sortOrder, sortBy, displayInMobile, displayInWeb} = this.state;
        // let orderList = displayOrderDefaultList.concat(
        //     allFields.filter(function (item) {
        //         return selectedFields && selectedFields.some(function (name) {
        //                 if (item.name == name) {
        //                     return true;
        //                 } else {
        //                     return false;
        //                 }
        //             });
        //     })
        // );
        return (
            visible?<Modal title={'组件-相关业务'} visible={visible} onOk={this.onOk}
                           onCancel={cancel}>
                <div style={styleForModal.group}>
                    <label style={styleForModal.title}>显示字段</label>
                    <Transfer dataSource={allFields} showSearch filterOption={this.filterOption}
                              targetKeys={selectedFields} onChange={this.selectFields} render={item => item.label}
                              titles={['可选', '已选']} rowKey={record => record.name}
                    />
                </div>

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

                <div style={styleForModal.group}>
                    <label style={styleForModal.title}>显示顺序</label>
                    <div>
                        <Select value={sortBy} style={{width: '150px'}} onChange={this.changeSortBy}>
                            {
                                allFields.map(function (item) {
                                    return <Option key={item.name} value={item.name}>{item.label}</Option>;
                                })
                            }
                            {/*<Option value="jack">Jack</Option>*/}
                        </Select>
                        <RadioGroup onChange={this.changeSortOrder} value={sortOrder} style={{marginLeft: '20px'}}>
                            <Radio value={'acs'}>升序</Radio>
                            <Radio value={'desc'}>降序</Radio>
                        </RadioGroup>
                    </div>
                </div>
                {/*TODO 本期暂不开发*/}
                {/*<div style={styleForModal.group}>*/}
                {/*<label style={styleForModal.title}>累计汇总值</label>*/}
                {/*<p style={{color: '#999999'}}>可以对字段进行数据条数记录计数，最大值，最小值，平均值和总和的统计。</p>*/}
                {/*<div>*/}
                {/*</div>*/}
                {/*</div>*/}
            </Modal>:null
        );
    }
}

//=========//

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
        // margin: '0 0 20px',
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
        content: {
            margin: '0 10px',
            overflow: 'auto',
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
    },
    buttonStyle: {
        border: '1px solid darkgray',
        padding: '3px',
        margin: '3px',
        borderRadius: '5px',
        boxShadow: '0px 0px 1px #afaaaa',
    },
};

class WebRelative extends Component {

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
        let {delRelative, detail, allFields} = this.props;
        this.props.dispatch({
            type: 'pageLayout/getFieldsListByRelativeObj',
            payload: {
                // metaId: this.props.metaInfo.id,
                metaId: detail.metaId,
                callback: () => {
                    this.setState({
                        visible: true,
                    });
                },
            }
        });
    }

    closeModal () {
        this.setState({
            visible: false,
        });
    }

    relativeRender () {
        let {label, theme} = this.props;
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
            <div style={{display: 'inline-block',}}>
                <div>{label}</div>
                <div style={{fontSize: '10px'}}>
                    <span>目标 ￥999,999,999,999,999</span>
                </div>
            </div>
            <div style={{
                float: 'right',
                border: '1px #d1d1d1 solid',
                borderRadius: '4px',
                padding: '3px 15px',
                fontSize: '12px',
                color: '#333333',
            }}>
                <Icon type="plus"/>新建
            </div>
        </div>;

        let body = null;
        if (theme !== 'small---') {
            body = <div style={style.body.content}>
                <Row style={{lineHeight: '24px', borderBottom: '2px rgb(187, 187, 187) solid',}}>
                    <Col span={5}>
                        <div style={{...style.body.footer, color:''}}>主标题</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer, color:''}}>字段标题</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer, color:''}}>字段标题</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer, color:''}}>字段标题</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer, color:''}}>字段标题</div>
                    </Col>
                </Row>
                <Row style={{lineHeight: '31px', borderTop: '1px #f2f2f2 solid',}}>
                    <Col span={5}>
                        <div style={style.body.footer}>字段内容</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>字段内容</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>字段内容</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>字段内容</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>字段内容</div>
                    </Col>
                    <Col span={3}>
                        <div style={{textAlign: 'right'}}>
                            <Icon type="caret-down" style={style.buttonStyle}/>
                        </div>
                    </Col>
                </Row>
                <Row style={{lineHeight: '31px', borderTop: '1px #f2f2f2 solid',}}>
                    <Col span={5}>
                        <div style={style.body.footer}>字段内容</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>字段内容</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>字段内容</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>字段内容</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>字段内容</div>
                    </Col>
                    <Col span={3}>
                        <div style={{textAlign: 'right'}}>
                            <Icon type="caret-down" style={style.buttonStyle}/>
                        </div>
                    </Col>
                </Row>
                <Row style={{lineHeight: '31px', borderTop: '1px #f2f2f2 solid',}}>
                    <Col span={5}>
                        <div style={style.body.footer}>字段内容</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>字段内容</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>字段内容</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>字段内容</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>字段内容</div>
                    </Col>
                    <Col span={3}>
                        <div style={{textAlign: 'right'}}>
                            <Icon type="caret-down" style={style.buttonStyle}/>
                        </div>
                    </Col>
                </Row>
                <Row style={{lineHeight: '31px', borderTop: '1px #f2f2f2 solid',}}>
                    <Col span={5}>
                        <div style={style.body.footer}>字段内容</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>字段内容</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>字段内容</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>字段内容</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>字段内容</div>
                    </Col>
                    <Col span={3}>
                        <div style={{textAlign: 'right'}}>
                            <Icon type="caret-down" style={style.buttonStyle}/>
                        </div>
                    </Col>
                </Row>
                <Row style={{lineHeight: '31px', borderTop: '1px #f2f2f2 solid',}}>
                    <Col span={5}>
                        <div style={style.body.footer}>字段内容</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>字段内容</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>字段内容</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>字段内容</div>
                    </Col>
                    <Col span={4}>
                        <div style={{...style.body.footer}}>字段内容</div>
                    </Col>
                    <Col span={3}>
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
        let {delRelative, detail, allFields} = this.props;
        let {visible} = this.state;
        return (
            <div style={{margin: '5px 0px'}}>
                <SmartHover edit={this.openModal} close={delRelative}>
                    {this.relativeRender()}
                </SmartHover>
                <RelativeModal visible={visible} detail={detail} confirm={this.confirm} cancel={this.cancel}
                               allFields={allFields}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    let {fieldsListForRelativeObj} = state.pageLayout;
    // let {info} = state.form;
    return {
        // metaInfo: info,
        allFields: fieldsListForRelativeObj,
    };
};

export default connect(mapStateToProps)(WebRelative);
