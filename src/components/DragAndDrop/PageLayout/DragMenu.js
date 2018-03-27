import React, { Component, PropTypes } from 'react';
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
    type: 'DragMenu',
    spec: {
        beginDrag(props) {
            return {
                ...props,
                dragType: 'DragMenu',
                detail: {...props.detail, uuid: generateUUID()}
            };
        },
        endDrag(props, monitor){
            let source = monitor.getItem();
            const dropResult = monitor.getDropResult();
            // console.log(dropResult);
            if (dropResult) {
                // console.log(dropResult);
                props.changeTemp(source.detail.uuid, dropResult.dropType=='Tab');
            }else{
                props.delTemp();
            }
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

    componentDidMount() {
    }

    renderDragItem () {
        let {isDragging, label} = this.props;
        let opacity = isDragging ? 0 : 1;//拖拽时为透明，不拖拽时完全不透明
        return <div style={{...itemStyle.dynamicItem, opacity}}>{label}</div>;
    }

    render () {
        let {connectDragSource} = this.props;
        return connectDragSource(
            <div>
                {this.renderDragItem()}
            </div>
        );
    }
}

export default DragSource(dndSetting.type, dndSetting.spec, dndSetting.collect)(DragMenu);
