import React, { Component } from 'react';
import { Menu, Button, Icon, Modal, Row, Col, Input, message } from 'antd';
import { connect } from 'dva';
import { Link } from 'react-router';
import { browserHistory } from 'dva/router';
import generateUUID from '../../../utils/generateUUID';
import { DragDropContext } from 'react-dnd';
import DragList from '../../../components/DragAndDrop/DragList/DragList';
import DigestArea from '../../../components/DragAndDrop/DigestArea/DigestArea';
import GroupBoard from '../../../components/DragAndDrop/DropArea/GroupBoard';
import HTML5Backend from 'react-dnd-html5-backend';
const confirm = Modal.confirm;
const defaultConfig = {
    required: 0,
    commonUsed: 0,
};

class FieldsLayout extends Component {
    constructor (props) {
        super(props);
        this.cardHoverCard = this.cardHoverCard.bind(this);
        this.addCard = this.addCard.bind(this);
        this.changeTempCard = this.changeTempCard.bind(this);
        this.delTempCard = this.delTempCard.bind(this);
        this.delCard = this.delCard.bind(this);
        this.delGroup = this.delGroup.bind(this);
        this.addGroup = this.addGroup.bind(this);
        this.moveGroup = this.moveGroup.bind(this);
        this.setCardConfig = this.setCardConfig.bind(this);
        this.findMainTitleId = this.findMainTitleId.bind(this);
        this.findMainDetailId = this.findMainDetailId.bind(this);
        this.state = {
            // formId: this.props.params.formId,
            // submitFlag: '',
            visible: false,
            // detail: props.detail ? props.detail : [],
        };
    }

    componentWillMount () {
        // this.setState({
        //     detail: this.props.detail ? this.props.detail : []
        // });
    }

    componentWillReceiveProps (nextProps) {
        // console.log('receive');
        // this.setState({detail: nextProps.detail});
    }

    componentDidMount () {
    }

    /**
     * 获取主标题id
     */
    findMainTitleId () {
        let {fieldsConfigList} = this.props;
        let mainTitleId = null;
        fieldsConfigList.some(function (item) {
            if (item.name == 'name') {
                mainTitleId = item.fieldId;
                return true;
            } else {
                return false;
            }
        });
        return mainTitleId + '';
    }

    /**
     * 获取主子明细ID
     */
    findMainDetailId () {
        let {fieldsConfigList} = this.props;
        let mainDetailId = null;
        fieldsConfigList.some(function (item) {
            if (item.type == 'MainDetail') {
                mainDetailId = item.fieldId;
                return true;
            } else {
                return false;
            }
        });
        return mainDetailId + '';
    }

    /**
     * 修改group的配置信息，包括一列或两列，N或Z字排列 等
     * @param index groupBoard 详细信息所对应detail中数组的index
     * @param config 需要更新的信息包括：{group,order,colNum, showInNewEditPage, showInDetailPage}
     */
    setGroupConfig (index, config) {
        let {detail, setDetail} = this.props;
        detail[index] = {...detail[index], ...config};
        setDetail(detail);
    }

    /**
     * 删除对应index的groupBoard对应的数据。
     * @param index groupBoard对应的数据index
     */
    delGroup (index) {
        let {detail, setDetail} = this.props;
        let mainTitleId = this.findMainTitleId();
        let mainDetailId = this.findMainDetailId();
        confirm({
            title: '你确定要删除该分组吗?',
            // content: '',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                //获取该组所有包含的字段。
                let allArr = detail[index].firstArr.concat(detail[index].secondArr);
                allArr.forEach(function (item) {
                    if (item.id == mainTitleId || item.id == mainDetailId) {
                        detail[0].firstArr.push(item);
                    }
                });
                detail.splice(index, 1);
                setDetail(detail);
            },
            onCancel() {
                // console.log('Cancel');
            },
        });
    }

    /**
     * 排序移动分组
     * @param dragIndex 拖拽分组index
     * @param hoverIndex 移动到分组index
     */

    moveGroup (dragIndex, hoverIndex) {
        let {detail, setDetail} = this.props;
        let dragGroup = {...detail[dragIndex]};
        let hoverGroup = {...detail[hoverIndex]};
        detail[dragIndex] = hoverGroup;
        detail[hoverIndex] = dragGroup;
        setDetail(detail);
    }

    /**
     * 添加分组到指定的index位置
     * @param uuid groupBoard的唯一标识
     */
    addGroup (uuid) {
        let {detail, setDetail} = this.props;
        detail.push({
            uuid: uuid,
            group: '分组' + detail.length,//分组名称
            colNum: '2',//布局列数
            order: '2',//1:Z字,2:N字
            showInNewEditPage: true, //名称显示在：新建、编辑页面
            showInDetailPage: true, //名称显示在：详细资料页面
            firstArr: [],
            secondArr: [],
        });
        setDetail(detail);
    }

    /**
     * 删除Groupboard中对应的coordinate位置的uuid的card
     * required：uuid card唯一标识
     * optional：coordinate 无坐标则全局遍历
     */
    delCard (uuid, coordinate) {
        let {detail, setDetail} = this.props;
        let groupDetail = detail[coordinate[0]];
        let fieldArr = groupDetail[coordinate[1] == 0 ? 'firstArr' : 'secondArr'];
        fieldArr.some(function (item, index) {
            if (item.uuid == uuid) {
                fieldArr.splice(index, 1);
                return true;
            }
        });
        setDetail(detail);
    }

    /**
     * hover时生成带有temp标签的临时card，当取消drop（即drop到非有效区域）
     * 后将temp标签的card从数组中去除
     */
    delTempCard () {
        let {detail, setDetail} = this.props;
        for (let item of detail) {
            // for (let field of item.firstArr) {
            for (let i = 0; i < item.firstArr.length; i++) {
                if (item.firstArr[i].temp) {
                    item.firstArr.splice(i, 1);
                    i--;
                }
            }
            if (item.colNum == 2) {
                for (let i = 0; i < item.secondArr.length; i++) {
                    if (item.secondArr[i].temp) {
                        item.secondArr.splice(i, 1);
                        i--;
                    }
                }
            }
        }
        setDetail(detail);
    }

    /**
     * hover时生成带有temp标签的临时card，当确认drop后将temp标签去除
     * required: tempCard的uuid， coordinate：坐标，所在groupBoard 及 droparea
     */
    changeTempCard (uuid, coordinate) {
        let {detail, setDetail} = this.props;
        let groupDetail = detail[coordinate[0]];
        let fieldArr = groupDetail[coordinate[1] == 0 ? 'firstArr' : 'secondArr'];
        fieldArr.some(function (item, index) {
            if (item.uuid == uuid && item.temp) {
                delete fieldArr[index].temp;
                return true;
            }
        });
        setDetail(detail);
    }

    /**
     * card组件hover事件逻辑函数
     * required: dragItem：拖拽元素，hoverItem：被hover的元素
     * optional:
     */
    cardHoverCard (dragItem, hoverItem) {
        let {detail, setDetail} = this.props;
        let dragCoord = dragItem.coordinate;
        let hoverCoord = hoverItem.coordinate;
        //第一位判断是否在同一个Group中，第二位判断是否在同一个DropArea中
        if (dragCoord[0] == hoverCoord[0] && dragCoord[1] == hoverCoord[1]) {
            let groupDetail = detail[dragCoord[0]];
            let colNum = groupDetail.colNum;
            let temp = [];
            if (colNum == 1 || dragCoord[1] == 0) {
                temp = groupDetail.firstArr[dragCoord[2]];
                groupDetail.firstArr[dragCoord[2]] = groupDetail.firstArr[hoverCoord[2]];
                groupDetail.firstArr[hoverCoord[2]] = temp;
            } else if (colNum == 2 && dragCoord[1] == 1) {
                temp = groupDetail.secondArr[dragCoord[2]];
                groupDetail.secondArr[dragCoord[2]] = groupDetail.secondArr[hoverCoord[2]];
                groupDetail.secondArr[hoverCoord[2]] = temp;
            }
        }
        setDetail(detail);
    }

    /**
     * 向fields中添加新的field id 信息
     * required:id：field唯一表示, coordinate: 数组，对应GroupBoard 和 arrayIndex:0->firstArr 1->secondArr
     * temporary：临时性，true代表添加临时temp字段标记。如果不触发drop事件，则移除。
     * uuid: 如果是特殊可复用元素，添加uuid作为唯一标识
     */
    addCard (id, coordinate, temporary, uuid) {
        let {detail, setDetail} = this.props;
        if (coordinate[1] == 0) {
            let tempObj = {
                id: id + '',
                temp: temporary,
                uuid: uuid,
                ...defaultConfig
            };
            detail[coordinate[0]].firstArr.push(tempObj);
        }
        if (coordinate[1] == 1) {
            let tempObj = {
                id: id + '',
                temp: temporary,
                uuid: uuid,
                ...defaultConfig
            };
            detail[coordinate[0]].secondArr.push(tempObj);
        }
        setDetail(detail);
    }

    setCardConfig (fieldId, config) {
        let {fieldsConfigList} = this.props;
        fieldsConfigList.some(function (item, i, arr) {
            if (item.fieldId == fieldId) {
                arr[i] = {...item, ...config};
                return true;
            } else {
                return false;
            }
        });
        this.props.setFieldsConfigList(fieldsConfigList);
    }

    renderMainContent () {
        return (
            <div style={{margin: '0px 100px 50px 250px', overflow: 'auto', height: '600px'}}>
                {/*<div style={{fontWeight: '700', fontStyle: 'normal', fontSize: '16px'}}>详细资料</div>*/}
                {this.renderGroupBoard()}
            </div>
        );
    }

    renderGroupBoard () {
        let {fieldsConfigList} = this.props;
        let {detail} = this.props;
        let renderJSX = detail.map(function (item, index) {
            //遍历fields数组并根据id找到对应的field详细信息
            let firstArr = item.firstArr.map(function (field) {
                let matched = _.cloneDeep(fieldsConfigList.filter(function (detail) {
                    return detail.fieldId == field.id;
                })[0]);
                matched = {...field, ...matched, id: field.id};
                return matched;
            }, this);
            let secondArr = item.secondArr && item.secondArr.map(function (field) {
                    let matched = _.cloneDeep(fieldsConfigList.filter(function (detail) {
                        return detail.fieldId == field.id;
                    })[0]);
                    matched = {...field, ...matched, id: field.id};
                    return matched;
                }, this);
            // console.log(JSON.stringify(item));
            // console.log(JSON.stringify(firstArr));
            // console.log(JSON.stringify(secondArr));
            return (<GroupBoard config={item} key={index} coordinate={[index]} cardArray={[firstArr, secondArr]}
                                type={'Group'}
                                groupArray={detail}
                                setGroupConfig={(config) => {this.setGroupConfig(index, config);}}
                                delCard={this.delCard}
                                addCard={this.addCard}
                                setCardConfig={this.setCardConfig}
                                delGroup={() => {this.delGroup(index);}}
                                addGroup={this.addGroup}
                                moveGroup={this.moveGroup}
                                cardHoverCard={this.cardHoverCard}/>);
        }, this);
        return renderJSX;
    }

    renderDragList () {
        let {listArray} = this.props;
        let {detail} = this.props;
        let listCanUsed = listArray.filter(function (item) {
            //特殊id元素，可使用多次，无需过滤。
            if (item.id == 'space' || item.id == 'split' || item.id == 'breakLine') {
                return true;
            } else {//标准id元素，仅可使用一次，使用过后，过滤掉。
                let notUsed = true;
                for (let i = 0; i < detail.length; i++) {
                    let fields = detail[i].colNum == 2 ? detail[i].firstArr.concat(detail[i].secondArr) : detail[i].firstArr;
                    notUsed = !fields.some(function (field) {
                        return field.id == item.id;
                    });
                    //如果使用过，跳出循环
                    if (!notUsed) {
                        break;
                    }
                }
                return notUsed;
            }
        });
        return <DragList listArray={listCanUsed}
                         generateUUID={generateUUID}
                         changeTempCard={this.changeTempCard}
                         delTempCard={this.delTempCard}
                         addGroup={this.addGroup}//TODO 临时待删除
        />;
    }

    render () {
        // let {detail} = this.state;
        return (
            <div style={{overflow: 'auto', height: '100%'}}>
                {this.renderDragList()}
                {this.renderMainContent()}
            </div>
        );
    }
}

function mapStateToProps (state) {
    // let {info} = state.form;
    let {fields, fieldsConfigList} = state.pageLayout;
    return {
        listArray: [{
            'id': 'space',
            'label': '空行',
        }, {
            'id': 'split',
            'label': '分组',
        }, {
            'id': 'breakLine',
        }, ...fields],
        fields: fields,
        // fieldsConfigList: fieldsConfigList,
        // ...state.formLayout,
        // metaInfo: info,
    };
}

export default connect(mapStateToProps)(FieldsLayout);
