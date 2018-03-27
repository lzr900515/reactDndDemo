import React, { Component } from 'react';
import { DropTarget, DragSource } from 'react-dnd';
import { findDOMNode } from 'react-dom';
import DropArea from './DropArea';
import GroupHeader from './GroupHeader';
const dragSetting = {
    type: 'Group',
    spec: {
        beginDrag(props) {
            return props;
        },
        endDrag(props, monitor){
        },
        canDrag(props, monitor){
            return props.coordinate[0] != 0;
        },
        //重写isDragging方法，用于判断当前拖拽的元素
        isDragging (props, monitor) {
            return props.config.uuid == monitor.getItem().config.uuid;
        }
    },
    collect(connect, monitor){
        return {
            connectDragSource: connect.dragSource(),
            isDragging: monitor.isDragging(),
        };
    },
};
const dndSetting = {
    type: ['DragItem', 'Card', 'Group'],
    spec: {
        drop(props, monitor, component) {
            let source = monitor.getItem();
            let target = props;
            let dropToLeft = true;//拖拽到左边droparea为true，右边为false，colNum=1 永远为true
            if (props.config.colNum == 2) {
                // Determine rectangle on screen
                const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
                // Get vertical middle
                const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
                // Determine mouse position
                const clientOffset = monitor.getClientOffset();
                // Get pixels to the right
                const hoverClientX = clientOffset.x - hoverBoundingRect.left;
                if (hoverClientX > hoverMiddleX) {//drop to the right DropArea
                    dropToLeft = false;
                } else if (hoverClientX < hoverMiddleX) {//drop to the left DropArea
                    dropToLeft = true;
                }
            }
            /**
             *   it is going to become the drop result and will be available to the drag source
             *   in its endDrag method as monitor.getDropResult()
             */
            return {
                coordinate: [target.coordinate[0], dropToLeft ? 0 : 1]
            };
        },
        canDrop(props, monitor){
            // return props.coordinate[0] != 0 ;
            return true;
        },
        hover(props, monitor, component) {
            let groupIndex = props.coordinate[0];//GroupBoard index
            let groupConfig = props.config;
            let dragItem = monitor.getItem();
            // Determine rectangle on screen
            const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
            // Get vertical middle
            const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
            // Determine mouse position
            const clientOffset = monitor.getClientOffset();
            // Get pixels to the right
            const hoverClientX = clientOffset.x - hoverBoundingRect.left;
            if (dragItem.type == 'Card') {//跨GroupBoard拖拽
                if (groupConfig.colNum == 1) {//目标GroupBoard为1列时
                    if (dragItem.coordinate[0] == groupIndex) {
                        return;
                    } else {
                        props.delCard(dragItem.detail.uuid, dragItem.coordinate);
                    }
                    let haveUsed = props.cardArray[0].some(function (field) {
                        // (field.id == dragItem.detail.id) &&
                        return (dragItem.detail.uuid == field.uuid);
                    });
                    if (!haveUsed) {
                        //group中增加card元素：元素id ，coordinate，临时性, uuid
                        props.addCard(dragItem.detail.id, [groupIndex, 0], false, dragItem.detail.uuid);
                        //为新加的card重新定义坐标位置。(important)
                        monitor.getItem().coordinate[0] = groupIndex;
                        monitor.getItem().coordinate[1] = 0;
                        monitor.getItem().coordinate[2] = props.cardArray[0].length;//默认新card添加到数组末尾
                    }
                } else if (groupConfig.colNum == 2) {//目标GroupBoard为2列时
                    if (dragItem.coordinate[0] == groupIndex && //首先在同一个 groupBoard下
                        ((hoverClientX > hoverMiddleX && dragItem.coordinate[1] == 1) || //其次在同一个 DropArea中。
                        (hoverClientX < hoverMiddleX && dragItem.coordinate[1] == 0))) {
                        return;
                    } else {
                        props.delCard(dragItem.detail.uuid, dragItem.coordinate);
                        if (hoverClientX > hoverMiddleX) {//拖动到右边时
                            let haveUsed = props.cardArray[1].some(function (field) {
                                // (field.id == dragItem.detail.id) &&
                                return (dragItem.detail.uuid == field.uuid);
                            });
                            if (!haveUsed) {
                                //group中增加card元素：元素id ，coordinate，临时性, uuid
                                props.addCard(dragItem.detail.id, [groupIndex, 1], false, dragItem.detail.uuid);
                                //为新加的card重新定义坐标位置。(important)
                                monitor.getItem().coordinate[0] = groupIndex;
                                monitor.getItem().coordinate[1] = 1;
                                monitor.getItem().coordinate[2] = props.cardArray[1].length;//默认新card添加到数组末尾
                            }
                        } else if (hoverClientX < hoverMiddleX) { //拖动到左边时
                            let haveUsed = props.cardArray[0].some(function (field) {
                                // (field.id == dragItem.detail.id) &&
                                return (dragItem.detail.uuid == field.uuid);
                            });
                            if (!haveUsed) {
                                //group中增加card元素：元素id ，coordinate，临时性, uuid
                                props.addCard(dragItem.detail.id, [groupIndex, 0], false, dragItem.detail.uuid);
                                //为新加的card重新定义坐标位置。(important)
                                monitor.getItem().coordinate[0] = groupIndex;
                                monitor.getItem().coordinate[1] = 0;
                                monitor.getItem().coordinate[2] = props.cardArray[0].length;//默认新card添加到数组末尾
                            }
                        }
                    }
                }
            } else if (dragItem.type == 'DragItem') {//新添加Card元素
                //添加分组
                if (dragItem.detail.id == 'split') {
                    let haveUsed = props.groupArray.some(function (field) {
                        return (dragItem.detail.uuid == field.uuid);
                    });
                    if (!haveUsed) {
                        let groupArrLength = props.groupArray.length;
                        props.addGroup(dragItem.detail.uuid);
                        dragItem.type = 'Group';
                        dragItem.coordinate = [groupArrLength];
                    }
                    return;
                }
                if (groupConfig.colNum == 1) {//目标GroupBoard为一列
                    let haveUsed = props.cardArray[0].some(function (field) {
                        // (field.id == dragItem.detail.id) &&
                        return (dragItem.detail.uuid == field.uuid);
                    });
                    if (!haveUsed) {
                        //group中增加card元素：元素id ，coordinate，临时性, uuid
                        props.addCard(dragItem.detail.id, [groupIndex, 0], true, dragItem.detail.uuid);
                    }
                } else if (groupConfig.colNum == 2) {//目标GroupBoard为两列
                    if (hoverClientX > hoverMiddleX) {//hover on the right DropArea
                        //悬浮在右侧时，查找左侧是否有该card，如果有则删除
                        props.cardArray[0].some(function (field) {
                            if (dragItem.detail.uuid == field.uuid) {
                                //删除coordinate位置的该uuid card
                                props.delCard(dragItem.detail.uuid, [groupIndex, 0]);
                            }
                            return (dragItem.detail.uuid == field.uuid);
                        });
                        let haveUsed = props.cardArray[1].some(function (field) {
                            // (field.id == dragItem.detail.id) &&
                            return (dragItem.detail.uuid == field.uuid);
                        });
                        if (!haveUsed) {
                            //group中增加card元素：元素id ，coordinate，临时性, uuid
                            props.addCard(dragItem.detail.id, [groupIndex, 1], true, dragItem.detail.uuid);
                        }

                    } else if (hoverClientX < hoverMiddleX) {//hover on the left DropArea
                        //悬浮在左侧时，查找右侧是否有该card，如果有则删除
                        props.cardArray[1].some(function (field) {
                            if (dragItem.detail.uuid == field.uuid) {
                                //删除coordinate位置的该uuid card
                                props.delCard(dragItem.detail.uuid, [groupIndex, 1]);
                            }
                            return (dragItem.detail.uuid == field.uuid);
                        });
                        let haveUsed = props.cardArray[0].some(function (field) {
                            // (field.id == dragItem.detail.id) &&
                            return (dragItem.detail.uuid == field.uuid);
                        });
                        if (!haveUsed) {
                            //group中增加card元素：元素id ，coordinate，临时性, uuid
                            props.addCard(dragItem.detail.id, [groupIndex, 0], true, dragItem.detail.uuid);
                        }
                    }
                }
            } else if (dragItem.type == 'Group') {//新添加分组或分组排序
                // Get vertical middle
                const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
                // Get pixels to the top
                const hoverClientY = clientOffset.y - hoverBoundingRect.top;
                const dragIndex = monitor.getItem().coordinate[0];
                const hoverIndex = props.coordinate[0];
                if (dragItem.config.uuid == props.config.uuid) {//hover自身不做处理
                    return;
                }else if (hoverIndex == 0){
                    return;
                }
                if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                    return;
                }

                // Dragging upwards
                if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                    return;
                }
                // Time to actually perform the action
                props.moveGroup(dragIndex, hoverIndex);

                // Note: we're mutating the monitor item here!
                // Generally it's better to avoid mutations,
                // but it's good here for the sake of performance
                // to avoid expensive index searches.
                monitor.getItem().coordinate = [...props.coordinate];
            }
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
class GroupBoard extends Component {
    constructor (props) {
        super(props);
    }

    // //当colNum=2时，将cardArray根据order（1:Z字,2:N字）进行拆分成2个数组
    // cardArraySplit (cardArray, order) {
    //   var twoColArray = {
    //     'first': [],
    //     'second': []
    //   };
    //   if (order == 1) {//Z字布局逻辑
    //     cardArray.forEach(function (item, index) {
    //       if (item) {//item可能为undefined，占位元素
    //         if (index % 2) {
    //           twoColArray.second.push(item);
    //         } else {
    //           twoColArray.first.push(item);
    //         }
    //       }
    //     });
    //   } else if (order == 2) {//N字布局逻辑
    //     cardArray.forEach(function (item, index) {
    //       if (item) {//item可能为undefined，占位元素
    //         if (index < cardArray.length / 2) {
    //           twoColArray.first.push(item);
    //         } else {
    //           twoColArray.second.push(item);
    //         }
    //       }
    //     });
    //   }
    //   return twoColArray;
    // }

    renderGroup () {
        let {config, coordinate, cardArray, isOver, delGroup, setGroupConfig, delCard, setCardConfig, connectDragSource} = this.props;
        if (config.colNum == 1) {
            return (
                <div>
                    {connectDragSource(<div><GroupHeader config={config} deletable={coordinate[0] != 0}
                                                         delGroup={delGroup}
                                                         setGroupConfig={setGroupConfig}/>
                    </div>)}
                    <div style={{backgroundColor: 'white', overflow: 'auto'}}>
                        <DropArea cardArray={cardArray[0]} key={coordinate + '_0'}
                                  delCard={delCard}
                                  setCardConfig={setCardConfig}
                                  isOverGroupBoard={isOver}
                                  coordinate={[...coordinate, 0]}
                                  cardHoverCard={this.props.cardHoverCard}/>
                    </div>
                </div>
            );
        } else if (config.colNum == 2) {
            // var twoColArray = this.cardArraySplit(cardArray, config.order);
            return (
                <div>
                    {connectDragSource(<div><GroupHeader config={config} deletable={coordinate[0] != 0}
                                                         delGroup={delGroup}
                                                         setGroupConfig={setGroupConfig}/>
                    </div>)}
                    <div style={{backgroundColor: 'white', overflow: 'auto'}}>
                        <DropArea cardArray={cardArray[0]} key={coordinate + '_0'}
                                  delCard={delCard}
                                  setCardConfig={setCardConfig}
                                  isOverGroupBoard={isOver}
                                  coordinate={[...coordinate, 0]}
                                  cardHoverCard={this.props.cardHoverCard}
                                  style={{width: '50%', display: 'inline-block', verticalAlign: 'top'}}/>
                        <DropArea cardArray={cardArray[1]} key={coordinate + '_1'}
                                  delCard={delCard}
                                  setCardConfig={setCardConfig}
                                  isOverGroupBoard={isOver}
                                  coordinate={[...coordinate, 1]}
                                  cardHoverCard={this.props.cardHoverCard}
                                  style={{width: '50%', display: 'inline-block', verticalAlign: 'top'}}/>
                    </div>
                </div>
            );
        }
    }

    render () {
        let {connectDropTarget} = this.props;
        return connectDropTarget(
            <div style={{marginTop: '10px'}}>
                {this.renderGroup()}
            </div>
        );
    }
}
GroupBoard = DragSource(dragSetting.type, dragSetting.spec, dragSetting.collect)(GroupBoard);
export default DropTarget(dndSetting.type, dndSetting.spec, dndSetting.collect)(GroupBoard);
