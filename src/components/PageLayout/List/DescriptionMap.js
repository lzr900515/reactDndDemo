import moment from 'moment';
import 'moment/locale/zh-cn';

export default function descriptionMap (type, subType, extendInfo) {
    let text = null;
    if (subType == 'Org' || subType == 'User' || subType == 'Short' || subType == 'Long' || type == 'Select' ||
        type == 'MultiSelect' || type == 'DynamicLookup' || type == 'AutoCode' || type == 'BizType' || type == 'Lookup'
        || type == 'Aggregation'  || type == 'MainDetail') {
        text = `示例${extendInfo}`;
    } else if (subType == 'Phone') {
        text = '18800000000';
    } else if (subType == 'Email') {
        text = 'demo@hecom.cn';
    } else if (type == 'Integer') {
        text = '99';
    } else if (type == 'Real') {
        text = '0.99';
    } else if (type == 'Percent') {
        text = '99.99%';
    } else if (type == 'Currency') {
        text = '999,999.99元';
    } else if (type == 'Date') {
        text = moment(Date.parse(new Date())).format('YYYY-MM-DD');
    } else if (type == 'Time') {
        text = moment(Date.parse(new Date())).format('YYYY-MM-DD HH:MM');
    } else if (type == 'District') {
        text = '北京市，海淀区';
    } else if (type == 'Location') {
        text = '北京西城区新街口外大街甲14号十月大厦';
    } else if (subType == 'URL'){
        text = 'http://www.demo.cn';
    } else if (type == 'Image'){
        text = '示例图片';
    } else if (type == 'Boolean'){
        text = '是';
    } else {
        text = `${type} ${subType}`;
    }
    return text;
};
