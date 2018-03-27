import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import generateUUID from '../../../utils/generateUUID';

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
            return {
                ...props,
                dragType: 'DragItem',
                uuid: generateUUID(),
                detail: {...props.detail}
            };
        },
        endDrag(props, monitor){
            let source = monitor.getItem();
            const dropResult = monitor.getDropResult();
            // console.log(dropResult);
            // // if(dropResult){
            // props.endDragEvent();
            // }
        },
    },
    collect(connect, monitor){
        return {
            connectDragSource: connect.dragSource(),
            connectDragPreview: connect.dragPreview(),
            isDragging: monitor.isDragging(),
        };
    },
};
class DragMenu extends Component {

    constructor (props) {
        super(props);
    }

    render () {
        let {connectDragSource, isDragging} = this.props;
        let opacity = isDragging ? 0 : 1;//拖拽时为透明，不拖拽时完全不透明
        return connectDragSource(
            <div style={{...itemStyle.dynamicItem, opacity}}>
                {this.props.children}
            </div>
        );
    }
}

export default DragSource(dndSetting.type, dndSetting.spec, dndSetting.collect)(DragMenu);
