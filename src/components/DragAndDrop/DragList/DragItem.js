import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
const itemStyle = {
    staticItem: {
        fontWeight: '200',
        fontStyle: 'normal',
        fontSize: '12px',
        color: '#999999',
        lineHeight: '28px',
    },
    dynamicItem: {
        fontWeight: '200',
        fontStyle: 'normal',
        fontSize: '12px',
        color: '#333333',
        lineHeight: '28px',
    },
    breakLine: {
        border: '1px solid #e4e4e4',
        margin: '5px 0px',
    }
};
const dndSetting = {
    type: 'DragItem',
    spec: {
        beginDrag(props) {
            let uuid = props.generateUUID();
            return {
                ...props,
                detail: {...props.detail, uuid },
                config: {uuid}, //设计缺陷，为分组排序提供。
            };
        },
        endDrag(props, monitor){
            let source = monitor.getItem();
            const dropResult = monitor.getDropResult();
            // console.log(monitor.didDrop());
            // console.log(dropResult);
            if (dropResult) {
                props.changeTempCard(source.detail.uuid, dropResult.coordinate);
            }
            props.delTempCard();
        },
        //重写isDragging方法，用于判断当前拖拽的元素
        isDragging (props, monitor) {
            return props.detail.id == monitor.getItem().detail.id;
        }
    },
    collect(connect, monitor){
        return {
            connectDragSource: connect.dragSource(),
            isDragging: monitor.isDragging(),
        };
    },
};
class DragItem extends Component {

    constructor (props) {
        super(props);
    }

    renderDragItem () {
        let {detail, isDragging, addGroup} = this.props;
        let opacity = isDragging ? 0 : 1;//拖拽时为透明，不拖拽时完全不透明
        //TODO temp 临时添加分组方法
        if (detail.id == 'split') {
            return <div style={{...itemStyle.staticItem, opacity}} onClick={() => {addGroup();}}>{detail.label}</div>;
        } else if (detail.id == 'split' || detail.id == 'space') {
            return <div style={{...itemStyle.staticItem, opacity}}>{detail.label}</div>;
        } else if (detail.id == 'breakLine') {
            return <div style={itemStyle.breakLine}></div>;
        } else {
            return <div style={{...itemStyle.dynamicItem, opacity}}>{detail.label}</div>;
        }
    }

    render () {
        let {connectDragSource} = this.props;
        return connectDragSource(
            <div>{this.renderDragItem()}</div>
        );
    }
}

export default DragSource(dndSetting.type, dndSetting.spec, dndSetting.collect)(DragItem);
