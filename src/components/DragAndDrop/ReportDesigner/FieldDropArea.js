import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';
import generateUUID from '../../../utils/generateUUID';
const dndSetting = {
    type: ['Element', 'DragItem'],
    spec: {
        drop(props, monitor, component) {
            let source = monitor.getItem();
            let target = props;
            /**
             *   it is going to become the drop result and will be available to the drag source
             *   in its endDrag method as monitor.getDropResult()
             */
            if (monitor.getDropResult()) {
                return {
                    dropType: monitor.getDropResult().dropType,
                };
            } else {
                return {
                    dropType: 'FieldDropArea',
                };
            }
        },
        canDrop(props, monitor){
            return true;
        },
        hover(props, monitor, component) {
            props.hover(props, monitor, component);
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
class FieldDropArea extends Component {
    constructor (props) {
        super(props);
    }

    render () {
        let {connectDropTarget, style} = this.props;
        return connectDropTarget(
            <div style={{minHeight: '500px',backgroundColor:'#f9f9f9', padding:'20px',...style}}>
                {this.props.children}
            </div>
        );
    }
}
export default DropTarget(dndSetting.type, dndSetting.spec, dndSetting.collect)(FieldDropArea);
