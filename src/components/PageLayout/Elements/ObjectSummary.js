import React, { Component, PropTypes } from 'react';
import { Menu, Input, Row, Col, Modal, Transfer, Icon } from 'antd';
import { connect } from 'dva';
import SmartHover from '../List/SmartHover';
import descriptionMap from '../List/DescriptionMap';
import _ from 'lodash';

class ObjectSummary extends Component {

    constructor (props) {
        super(props);
        this.state = {
            visible: false,
            digestTargetKeys: [],
            digestListSource: []
        };
        this.confirm = this.confirm.bind(this);
        this.cancel = this.cancel.bind(this);
        this.mobileDigestRender = this.mobileDigestRender.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.filterOption = this.filterOption.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount () {
        //容错处理，当字段已被删除后，清除该字段在摘要布局中的位置。
        let {selectedArr, allArr} = this.props;
        let findBug = false;
        for (var i = 0; i < selectedArr.length; i++) {
            let findDetail = allArr.some(function (item) {
                if (item.fieldId == selectedArr[i]) {
                    return true;
                } else {
                    return false;
                }
            });
            if (!findDetail) {
                findBug = true;
                selectedArr.splice(i, 1);
                i = i - 1;
            }
        }
        if (findBug) {
            this.props.setSelectedArr(selectedArr);
        }

        let newListSource = allArr.map(function (item) {
            if (item.name == 'name') {//主标题默认不可修改
                return {...item, disabled: true};
            } else {
                return item;
            }
        });
        this.setState({
            digestListSource: newListSource,
            digestTargetKeys: selectedArr,
        });
    }

    componentWillReceiveProps (nextProps) {
        //容错处理，当字段已被删除后，清除该字段在摘要布局中的位置。
        let {selectedArr, allArr} = nextProps;
        let findBug = false;
        for (var i = 0; i < selectedArr.length; i++) {
            let findDetail = allArr.some(function (item) {
                if (item.fieldId == selectedArr[i]) {
                    return true;
                } else {
                    return false;
                }
            });
            if (!findDetail) {
                findBug = true;
                selectedArr.splice(i, 1);
                i = i - 1;
            }
        }
        if (findBug) {
            this.props.setSelectedArr(selectedArr);
        }

        if (!_.isEqual(this.props, nextProps)) {
            let newListSource = nextProps.allArr.map(function (item) {
                if (item.name == 'name') {//主标题默认不可修改
                    return {...item, disabled: true};
                } else {
                    return item;
                }
            });
            this.setState({
                digestListSource: newListSource,
                digestTargetKeys: nextProps.selectedArr,
            });
        }
    }

    confirm () {
        this.props.setSelectedArr(this.state.digestTargetKeys);
        this.closeModal();
    }

    cancel () {
        this.setState({
            digestTargetKeys: _.cloneDeep(this.props.selectedArr),
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
            this.setState({digestTargetKeys: oldArr.slice(0, 8)});
        } else {
            this.setState({digestTargetKeys: targetKeys});
        }
    };

    mobileDigestRender () {
        let jsxDOM = [];
        let {selectedArr, allArr, metaInfo} = this.props;
        let mainTitle = null;
        let textContent = [];
        selectedArr.forEach(function (item) {
            for (let detail of allArr) {
                if (detail.fieldId == item) {
                    if (detail.name == 'name') {
                        mainTitle = (<div style={{fontSize: '20px'}} key={'title'}>{detail.label}</div>);
                    } else {
                        textContent.push(descriptionMap(detail.type, detail.subType, detail.label));
                    }
                }
            }
        });
        let body = (<div style={{margin: '0 auto', overflow: 'auto'}} key={'icon'}>
            <div style={{
                float: 'left',
                width: '40px',
                height: '40px',
                backgroundColor: 'rgba(244, 165, 35, 1)',
                borderRadius: '3px',
                verticalAlign: 'top',
            }}></div>
            <div style={{marginLeft: '50px'}}>
                {mainTitle}
                <div style={{fontSize: '12px'}}>
                    {textContent.join(' · ')}
                </div>
            </div>
        </div>);
        return <div style={{padding: '10px'}}>
            {body}
        </div>;
    }

    render () {
        let {visible, digestTargetKeys, digestListSource} = this.state;
        return (
            <div style={{margin: '5px 0px'}}>
                <SmartHover edit={this.openModal}>
                    {this.mobileDigestRender()}
                    {/*删除页面布局*/}
                    {visible ? <Modal title={'组件-摘要'} visible={visible} onOk={this.confirm} onCancel={this.cancel}>
                        {/*footer={null}*/}
                        <Transfer dataSource={digestListSource} showSearch filterOption={this.filterOption}
                                  targetKeys={digestTargetKeys} onChange={this.handleChange} render={item => item.label}
                                  titles={['可选', '已选']} rowKey={record => record.fieldId + ''}
                        />
                    </Modal> : null}
                </SmartHover>
            </div>
        );
    }
}

const mapStateToProps = state => {
    // let {info} = state.form;
    return {
        // metaInfo: info,
    };
};

export default connect(mapStateToProps)(ObjectSummary);
