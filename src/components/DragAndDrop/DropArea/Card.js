import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { Modal, Icon, Row, Col, Checkbox } from 'antd';
import { DropTarget, DragSource } from 'react-dnd';
import Description from './Description';
const cardStyle = {
    nomarl: {
        height: '60px',
        padding: '10px',
        color: '#333333',
        fontWeight: '200',
        fontStyle: 'normal',
        fontSize: '10px',
        borderBottom: '1px #f2f2f2 solid'
    },
    space: {
        height: '60px',
        padding: '10px',
        fontWeight: '200',
        fontStyle: 'normal',
        fontSize: '14px',
        color: '#CCCCCC',
        backgroundColor: '#f7f9fb',
        textAlign: 'center',
        lineHeight: '40px',
    },
};
const dropSetting = {
    type: ['Card', 'DragItem'],
    spec: {
        canDrop(props, monitor){

        },
        hover(props, monitor, component) {
            const dragDetail = monitor.getItem().detail;
            const hoverDetail = props.detail;
            if (dragDetail.uuid == hoverDetail.uuid) {//hover自身不做处理
                return;
            }
            if (monitor.getItem().type == 'Card') {//拖拽元素为Card, Card元素拥有coordinate属性
                const dragIndex = monitor.getItem().coordinate[2];
                const hoverIndex = props.coordinate[2];
                // Determine rectangle on screen
                const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
                // Get vertical middle
                const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
                // Determine mouse position
                const clientOffset = monitor.getClientOffset();
                // Get pixels to the top
                const hoverClientY = clientOffset.y - hoverBoundingRect.top;
                // Only perform the move when the mouse has crossed half of the items height
                // When dragging downwards, only move when the cursor is below 50%
                // When dragging upwards, only move when the cursor is above 50%
                // Dragging downwards
                if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                    return;
                }
                // Dragging upwards
                if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                    return;
                }
                // console.log(monitor.getItem())
                props.cardHoverCard(monitor.getItem(), props);
                if (monitor.getItem().coordinate[0] == props.coordinate[0] && monitor.getItem().coordinate[1] == props.coordinate[1]) {
                    // Note: we're mutating the monitor item here!
                    // Generally it's better to avoid mutations,
                    // but it's good here for the sake of performance
                    // to avoid expensive index searches.
                    monitor.getItem().coordinate[2] = hoverIndex;
                }
            } else if (monitor.getItem().type == 'DragItem') {//拖拽元素为DragItem, DragItem元素无coordinate属性,只有id和name属性
                //TODO:dragItem的拖拽动态效果
            }
        },
        drop(props, monitor, component) {

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
    type: 'Card',
    spec: {
        beginDrag(props) {
            return props;
        },
        endDrag(props, monitor){
        },
        //重写isDragging方法，用于判断当前拖拽的元素
        isDragging (props, monitor) {
            return props.detail.uuid == monitor.getItem().detail.uuid;
        }
    },
    collect(connect, monitor){
        return {
            connectDragSource: connect.dragSource(),
            isDragging: monitor.isDragging(),
        };
    },
};
class Card extends Component {

    constructor (props) {
        super(props);
        this.state = {
            showBar: false,
            modalVisible: false,
            required: 0,
        };
        this.overLeaveHandler = this.overLeaveHandler.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.onChange = this.onChange.bind(this);
        this.showModal = this.showModal.bind(this);
    }

    componentWillMount(){
        let {detail, coordinate, delCard} = this.props;
        //容错处理，当字段被删除后，fieldId找不到字段的详细信息时，默认删除该元素。
        if(detail.name == undefined && detail.id !== 'space'){
            delCard(detail.uuid, coordinate);
        }
        this.setState({
            required: detail.required ? 1 : 0,
        })
    }

    componentWillReceiveProps (nextProps) {
        if (!_.isEqual(this.props.detail,nextProps.detail)) {
            this.setState({
                required: nextProps.detail.required ? 1 : 0,
            });
        }
    }

    onChange (e) {
        this.setState({
            required: e.target.checked ? 1 : 0,
        });
    }

    showModal () {
        this.setState({
            modalVisible: true,
        });
    }

    handleOk (e) {
        let {setCardConfig} = this.props;
        let {required} = this.state;
        let config = {};
        config.required = required;
        setCardConfig(config);
        this.setState({
            modalVisible: false,
        });
    }

    handleCancel (e) {
        this.setState({
            required: this.props.detail.required,
            modalVisible: false,
        });
    }

    overLeaveHandler (event) {
        let {showBar} = this.state;
        showBar = event == 'enter' ? true : false;
        this.setState({showBar});
    }

    renderCard () {
        let {isDragging, detail, coordinate, delCard} = this.props;
        let opacity = isDragging ? 0.2 : 1;//拖拽时为透明，不拖拽时完全不透明
        opacity = detail.temp ? 0.5 : opacity;//temp card 半透明
        if (detail.id == 'space') {
            return (
                <div style={{...cardStyle.space, opacity}} onMouseEnter={() => {this.overLeaveHandler('enter');}}
                     onMouseLeave={() => {this.overLeaveHandler('leave');}}>
                    空行
                    <span style={{
                        color: 'rgba(0, 0, 0, 0.65)',
                        float: 'right',
                        visibility: this.state.showBar ? '' : 'hidden'
                    }}>
                          <span >
                            <Icon type="minus-circle-o" onClick={() => {delCard(detail.uuid, coordinate);}}/>
                          </span>
                        {/*<span >*/}
                        {/*<Icon type="info-circle" onClick={this.showModal}/>*/}
                        {/*</span>*/}
                    </span>
                </div>
            );
        } else {
            return (
                <div style={{...cardStyle.nomarl, opacity}} onMouseEnter={() => {this.overLeaveHandler('enter');}}
                     onMouseLeave={() => {this.overLeaveHandler('leave');}}>
                    {detail.label}<span style={{color: 'red', display: detail.required ? 'initial' : 'none'}}>*</span>
                    <span style={{float: 'right', visibility: this.state.showBar ? '' : 'hidden'}}>
                        <span style={{visibility:
                            detail.name == 'name' || detail.type == 'MainDetail' ?
                                'hidden' : ''}}>
                          <Icon type="minus-circle-o" style={{paddingRight: '10px'}}
                                onClick={() => {delCard(detail.uuid, coordinate);}}/>
                        </span>
                        <span style={{visibility:
                            detail.type == 'MainDetail' || detail.type == 'Aggregation' || detail.isSys == 1 ||
                            detail.name == 'name' ||
                            detail.type == 'Expression' || detail.type == 'Boolean' || detail.type == 'AutoCode'
                            // || detail.name == 'bizType' || detail.name == 'createdBy' || detail.name == 'createdOn' ||
                            // detail.name == 'name' ||
                                ? 'hidden' : ''}}>
                          <Icon type="info-circle" onClick={this.showModal}/>
                        </span>
                    </span>
                    <div style={{marginTop: '5px'}}>
                        <Description type={detail.type} subType={detail.subType} extendInfo={detail.label}/>
                    </div>
                </div>
            );
        }
    }

    render () {
        let {connectDragSource, connectDropTarget, isDragging, detail} = this.props;
        return connectDragSource(connectDropTarget(
            // this.renderCard(detail)
            <div>
                {this.state.modalVisible ? <Modal title={detail.label} visible={this.state.modalVisible}
                                                  onOk={this.handleOk} onCancel={this.handleCancel}>
                    <Row>
                        <Checkbox checked={this.state.required} onChange={this.onChange}>
                            必填
                        </Checkbox>
                    </Row>
                </Modal> : null}
                {this.renderCard()}
            </div>
        ));
    }
}

Card = DropTarget(dropSetting.type, dropSetting.spec, dropSetting.collect)(Card);
export default DragSource(dragSetting.type, dragSetting.spec, dragSetting.collect)(Card);
