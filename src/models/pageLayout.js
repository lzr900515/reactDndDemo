import * as form from '../services/form';
import { message } from 'antd';
import _ from 'lodash';
import generateUUID from '../utils/generateUUID';

message.config({
    top: 100,
    duration: 3,
});
export default {
    namespace: 'pageLayout',

    state: {
        layoutId: '0',
        layoutList: [],
        relativeList: [],
        componentList: [],
        buttonList: [],
        fields: [], //全量字段列表，包含字段具体信息，但没有require，keyField等信息
        layoutMobile: {},
        layoutWeb: [
            {
                componentArea: [],
            },
            {
                componentArea: [],
            },
            {
                componentArea: [],
            },
        ],
        usedFields: [],//字段布局或摘要中 使用的字段。有require，keyField等信息
        //format数据
        usedButton: [],
        layoutFields: [],
        digest: [],
        fieldsConfigList: [],//全量字段列表，由fields和usedFields(layoutDetail.data.fields)合并而来，包含字段所有的信息。
        fieldsListForRelativeObj: [],//关联对象所包含的所有字段信息
    },

    effects: {
        *initData({payload}, {call, put}){
            const [layoutDetail, componentList, relativeList, buttonList, fieldList] = yield [
                call(form.getPageLayout, JSON.stringify({id: payload.id, metaId: payload.metaId})),
                call(form.getComponentList, JSON.stringify({metaId: payload.metaId})),
                call(form.getRelativeList, JSON.stringify({metaId: payload.metaId})),
                call(form.buttonList, JSON.stringify({metaId: payload.metaId})),
                call(form.fieldList, JSON.stringify({id: payload.metaId})),
            ];
            yield put({type: 'setComponentList', payload: componentList.data.uiComponents});
            yield put({type: 'setRelativeList', payload: relativeList.data.relatedList});
            yield put({type: 'setButtonList', payload: buttonList.data.metaActions});
            yield put({type: 'setFields', payload: fieldList.data.fields});
            yield put({type: 'setLayout', payload: layoutDetail ? layoutDetail.data.layout : {}});
            //格式化数据
            yield put({type: 'formatData', payload: layoutDetail ? layoutDetail.data : {}});
        },
        *getLayoutList({payload}, {call, put}){
            const {data} = yield call(form.getPageLayoutList, JSON.stringify({metaId: payload.metaId}));
            yield put({type: 'setLayoutList', payload: data.layouts});
        },
        *saveLayout({payload}, {call}){
            let url = form.newPageLayout;//默认为新建接口
            let paraData = {
                metaId: payload.metaId,
                name: payload.name,
                label: payload.label,
                layoutSummary: payload.layoutSummary,
                layoutFileds: payload.layoutFileds,
                layoutButton: payload.layoutButton,
                // layoutWeb: {},
                layoutMobile: payload.layoutMobile,
                layoutWeb: payload.layoutWeb,
                fields: payload.fields,
                // disabled: 0,
            };
            if (payload.id) {//如果存在id，改为编辑接口
                url = form.editPageLayout;
                paraData.id = payload.id;
            }
            const {data} = yield call(url, JSON.stringify(paraData));
            if (data && payload.id) {
                message.success('编辑页面布局成功。');
                payload.callBack();
            } else if (data && !payload.id) {
                message.success('新建页面布局成功。');
                payload.callBack();
            }
        },
        *hasExists({payload}, {call}){
            const {data, result} = yield call(form.hasExists, JSON.stringify({
                metaId: payload.metaId,
                id: payload.id,
                label: payload.label,
                name: payload.name,
            }));
            if (data && result == '0') {
                payload.callback();
            }
        },
        *getFieldsListByRelativeObj({payload}, {call, put}){
            const {data, result} = yield call(form.fieldList, JSON.stringify({id: payload.metaId}));
            yield put({type: 'setFieldsListByRelativeObj', payload: data.fields});
            if (data && result == '0') {
                payload.callback();
            }
        },
    },

    reducers: {
        setLayout(state, {payload}){
            let buttonList = state.buttonList;
            if (!payload.layoutFields) {
                return {...state};
            } else {
                //手机端布局数据格式化
                let layoutMobile = JSON.parse(payload.layoutMobile);
                layoutMobile.componentArea.forEach(function (item) {
                    item.uuid = generateUUID();
                    if (item.type == 'Tab') {
                        item.subComponent.forEach(function (el) {
                            el.uuid = generateUUID();
                            el.content.forEach(function (element) {
                                element.uuid = generateUUID();
                            });
                        });
                    }
                });
                // //数据容错处理，当按钮组件已被删除时或查不到详细信息时，将该按钮从列表中删除
                let usedButton = [];
                layoutMobile.buttonArea.forEach(function (item) {
                    let findBtn = buttonList.some(function(btn){
                        return (btn.appName + '@' + btn.name) == (item.appName + '@' + item.type);
                    })
                    if(findBtn){
                        usedButton.push(item.appName + '@' + item.type);
                    };
                });
                //web端布局数据格式化
                let layoutWeb = payload.layoutWeb ? JSON.parse(payload.layoutWeb) : [
                    {
                        componentArea: [],
                    },
                    {
                        componentArea: [],
                    },
                    {
                        componentArea: [],
                    },
                ];
                layoutWeb.forEach(function (container) {
                    container.componentArea && container.componentArea.forEach(function (item) {
                        item.uuid = generateUUID();
                        if (item.type == 'Tab') {
                            item.subComponent.forEach(function (el) {
                                el.uuid = generateUUID();
                                el.content.forEach(function (element) {
                                    element.uuid = generateUUID();
                                });
                            });
                        }
                    });
                });
                return {
                    ...state,
                    // layoutFields: JSON.parse(payload.layoutFields).fieldsLayout,
                    layoutId: payload.id,
                    layoutMobile: layoutMobile,
                    layoutWeb: layoutWeb,
                    usedButton,
                };
            }
        },
        setLayoutList(state, {payload}){
            return {
                ...state,
                layoutList: payload,
            };
        },
        setComponentList(state, {payload}){
            return {
                ...state,
                componentList: payload,
            };
        },
        setRelativeList(state, {payload}){
            return {
                ...state,
                relativeList: payload,
            };
        },
        setButtonList(state, {payload}){
            payload.some(function (item, i, arr) {
                if (item.name == 'create') {
                    arr.splice(i, 1);//详情页面布局，不存在新建按钮，过滤掉。
                    return true;
                } else {
                    return false;
                }
            });
            return {
                ...state,
                buttonList: payload,
            };
        },
        setFields(state, {payload}) {
            return {...state, fields: payload};
        },
        formatData(state, {payload}){
            let fieldsExtendInfo = payload.fields ? payload.fields : [];
            let layoutFields = JSON.parse(payload.layout.layoutFields).fieldsLayout;
            let {fields} = state;
            let fieldsConfigFormated = formatFieldsConfig(fields, fieldsExtendInfo);
            // let usedFields = formatFieldsConfig(fieldsExtendInfo, fields);
            if (layoutFields.length) {
                layoutFields = formatDetail({
                    fields: fieldsConfigFormated,
                    detail: computeBaseGroup(layoutFields, fieldsExtendInfo)
                });
            } else {
                layoutFields = initDetail(fieldsConfigFormated);
            }
            return {
                ...state,
                usedFields: fieldsExtendInfo,
                fieldsConfigList: fieldsConfigFormated,
                digest: payload.layout.layoutSummary ? JSON.parse(payload.layout.layoutSummary) : [],
                // digest: formatDigest(fieldsConfigFormated), 该逻辑已废弃，不用自己推算摘要字段了
                layoutFields,
            };
        },
        setFieldsListByRelativeObj(state, {payload}) {
            let newListSource = payload.map(function (item) {
                if (item.name == 'name') {//主标题默认不可修改
                    return {...item, disabled: true};
                } else {
                    return item;
                }
            });
            return {...state, fieldsListForRelativeObj: newListSource};
        },
    }
};
/**
 * 基础信息分组中的布局需要通过usedField中出现的 非摘要字段 减去其他分组中出现的字段。加上基础信息中的现有字段组成。
 * @param layoutFields 待完善布局，
 * @param usedFields 布局中出现或摘要字段中使用的所有字段
 */
function computeBaseGroup (layoutFields, usedFields) {
    let baseFields = layoutFields[0].fields;//布局的第一个分组为基础信息分组
    if (baseFields[baseFields.length - 1] == '') {//如果最后一位为补充占位，先去除。
        baseFields.pop();
    }
    usedFields.forEach(function (el) {
        let usedAlready = layoutFields.some(function (group) {
            if (group.fields.indexOf(el.fieldId + '') != -1 || group.fields.indexOf(parseInt(el.fieldId)) != -1) {
                return true;
            } else {
                return false;
            }
        });
        if (!usedAlready && el.keyField != 1) {
            baseFields.push(el.fieldId + '');
        }
    });
    if (baseFields.length % 2) {
        baseFields.push('');
    }
    return layoutFields;
}
/**
 * 合并两个list的数据，如果allList中的元素在mergeList中出现，则返回两个元素的合并信息。否则补充默认值。
 * @param allList
 * @param mergeList 补充信息
 */
function formatFieldsConfig (allList, mergeList) {
    return allList.map(function (item) {
        let mergedItem = {};
        let hasCovered = mergeList.some(function (el) {
            if (el.fieldId == item.id) {
                mergedItem = {
                    // 'type': item.type,
                    // 'subType': item.subType,
                    // 'label': item.label,
                    ...item,
                    id: null,
                    ...el,
                };
                return true;
            } else {
                return false;
            }
        });
        if (!hasCovered) {
            mergedItem = {
                ...item,
                'fieldId': item.id,
                'id': null,
                'keyField': 0,
                'commonUsed': 0,
                'required': 0,
            };
        }
        return mergedItem;
    });
}

function formatDigest (fieldsConfigList) {
    let digestIdArr = [];
    fieldsConfigList.forEach(function (item) {
        if (item.keyField == '1') {
            digestIdArr.push(item.fieldId);
        }
    });
    return digestIdArr;
}

/**
 * 新建布局时，根据fields初始化detail, 默认填充非系统字段最多8项。
 * @param fields 全部字段信息
 */
function initDetail (fields) {
    let detail = [
        {
            group: '基础信息',//分组名称
            colNum: '2',//布局列数
            order: '2',//1:Z字,2:N字
            showInNewEditPage: true, //名称显示在：新建、编辑页面
            showInDetailPage: true, //名称显示在：详细资料页面
            fields: [],
        },
        {
            group: '系统字段',//分组名称
            colNum: '2',//布局列数
            order: '2',//1:Z字,2:N字
            showInNewEditPage: true, //名称显示在：新建、编辑页面
            showInDetailPage: true, //名称显示在：详细资料页面
            fields: [],
        }
    ];
    fields.forEach(function (item) {
        if (item.isSys == '0') {//自定义字段
            detail[0].fields.push(item.fieldId + '');
        } else {//系统字段
            detail[1].fields.push(item.fieldId + '');
        }
    });
    //保证两列排布的fields素组为偶数个元素
    if (detail[0].fields.length % 2) {
        detail[0].fields.push('');
    }
    if (detail[1].fields.length % 2) {
        detail[1].fields.push('');
    }
    return formatDetail({fields, detail});
}

/**
 * 格式化 detail数据
 * @param fields 所有使用到的字段的详细信息
 * @param layout 布局字段
 */
function formatDetail ({fields: fieldsDetail, detail}) {
    fieldsDetail = fieldsDetail || [];
    detail.forEach(function (item) {
        item.firstArr = [];
        item.secondArr = [];
        item.uuid = generateUUID();
        if (item.colNum == '1') {
            item.fields.forEach(function (el) {
                let defaultConfig = {
                    required: 0,
                    commonUsed: 0,
                };
                let findItem = fieldsDetail.some(function (info) {
                    if (info.fieldId == el) {
                        defaultConfig.required = info.required;
                        defaultConfig.commonUsed = info.commonUsed;
                        return true;
                    } else {
                        return false;
                    }
                });
                if (el == 'space') {
                    item.firstArr.push({
                        id: 'space',
                        uuid: generateUUID(),
                    });
                } else if (el != '' && findItem) {
                    item.firstArr.push({
                        id: el,
                        uuid: generateUUID(),
                        ...defaultConfig
                    });
                }
            });
        } else if (item.colNum == '2') {
            if (item.order == '1') {//Z字排列
                item.fields.forEach(function (el, index) {
                    let defaultConfig = {
                        required: 0,
                        commonUsed: 0,
                    };
                    let findItem = fieldsDetail.some(function (info) {
                        if (info.fieldId == el) {
                            defaultConfig.required = info.required;
                            defaultConfig.commonUsed = info.commonUsed;
                            return true;
                        } else {
                            return false;
                        }
                    });
                    if (index % 2 == 0) {
                        if (el == 'space') {
                            item.firstArr.push({
                                id: 'space',
                                uuid: generateUUID(),
                            });
                        } else if (el != '' && findItem) {
                            item.firstArr.push({
                                id: el,
                                uuid: generateUUID(),
                                ...defaultConfig
                            });
                        }
                    } else {
                        if (el == 'space') {
                            item.secondArr.push({
                                id: 'space',
                                uuid: generateUUID(),
                            });
                        } else if (el != '') {
                            item.secondArr.push({
                                id: el,
                                uuid: generateUUID(),
                                ...defaultConfig
                            });
                        }
                    }
                });
            } else if (item.order == '2') {//N字排列
                let arr = 'firstArr';
                item.fields.forEach(function (el, index, arr) {
                    let defaultConfig = {
                        required: 0,
                        commonUsed: 0,
                    };
                    let findItem = fieldsDetail.some(function (info) {
                        if (info.fieldId == el) {
                            defaultConfig.required = info.required;
                            defaultConfig.commonUsed = info.commonUsed;
                            return true;
                        } else {
                            return false;
                        }
                    });
                    if (index < (arr.length / 2)) {
                        arr = 'firstArr';
                    } else {
                        arr = 'secondArr';
                    }
                    if (el == 'space') {
                        item[arr].push({
                            id: 'space',
                            uuid: generateUUID(),
                        });
                    } else if (el != '' && findItem) {
                        item[arr].push({
                            id: el,
                            uuid: generateUUID(),
                            ...defaultConfig
                        });
                    }
                });
            }
        }
    });
    return detail;
}
