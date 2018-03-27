import React, { Component, PropTypes } from 'react';
import { DropTarget, DragSource } from 'react-dnd';

const dropSetting = {
    type: ['Element', 'DragItem'],
    spec: {
        canDrop(props, monitor){
        },
        hover(props, monitor, component) {
            props.hover(props, monitor, component);
        },
        drop(props, monitor, component) {
            return {
                ...props,
                dropType: 'Element',
            };
        }
    },
    collect(connect, monitor){
        return {
            // Call this function inside render()
            // to let React DnD handle the drag events:
            connectDropTarget: connect.dropTarget(),
            // You can ask the monitor about the current drag state:
            isOver: monitor.isOver(),
            isOverCurrent: monitor.isOver({shallow: true}),
            canDrop: monitor.canDrop(),
            itemType: monitor.getItemType()
        };
    },
};
const dragSetting = {
    type: 'Element',
    spec: {
        beginDrag(props) {
            return {
                ...props,
                dragType: 'Element',
            };
        },
        endDrag(props, monitor){
            const dropResult = monitor.getDropResult();
            // console.log(dropResult);
            if(dropResult && props.endDragEvent){
                // props.endDragEvent();
            }
        },
        // 重写isDragging方法，用于判断当前拖拽的元素
        isDragging (props, monitor) {
            return props.uuid == monitor.getItem().uuid;
        }
    },
    collect(connect, monitor){
        return {
            connectDragSource: connect.dragSource(),
            isDragging: monitor.isDragging(),
        };
    },
};
class Element extends Component {

    constructor (props) {
        super(props);
        this.state = {};
        this.renderElement = this.renderElement.bind(this);
    }

    renderElement () {
        let {isDragging, temp} = this.props;
        let opacity = isDragging ? 0.2 : 1;//拖拽时为透明，不拖拽时完全不透明
        opacity = temp ? 0.5 : opacity;//temp card 半透明
        return (
            <div style={{opacity}}>
                {this.props.children}
            </div>
        );
    }

    render () {
        let {connectDragSource, connectDropTarget} = this.props;
        return connectDragSource(connectDropTarget(
            <div>
                {this.renderElement()}
            </div>
        ));
    }
}

Element = DropTarget(dropSetting.type, dropSetting.spec, dropSetting.collect)(Element);
export default DragSource(dragSetting.type, dragSetting.spec, dragSetting.collect)(Element);
