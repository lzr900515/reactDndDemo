import React, { Component, PropTypes } from 'react';
import DragMenu from '../../DragAndDrop/PageLayout/DragMenu';
import { Menu, Input } from 'antd';

const SubMenu = Menu.SubMenu;
class DragSider extends Component {

    constructor (props) {
        super(props);
        this.state={
            filter:'',//搜索栏过滤字段
        },
        this.relativeListRender = this.relativeListRender.bind(this);
        this.componentListRender = this.componentListRender.bind(this);
        this.setFilter = this.setFilter.bind(this);
    }
    componentListRender(){
        let {componentList,changeTemp,delTemp} = this.props;
        let {filter} = this.state;
        let jsxDom = [];
        componentList.forEach(function(item,index){
            if(item.label.indexOf(filter) > -1){
                jsxDom.push(
                    <Menu.Item key={"$componentMenu"+index}>
                        <DragMenu detail={item} key={index} label={item.label}  changeTemp={changeTemp} delTemp={delTemp}/>
                    </Menu.Item>
                );
            }
        });
        return jsxDom;
    }
    relativeListRender(){
        let {relativeList,changeTemp,delTemp} = this.props;
        let {filter} = this.state;
        let jsxDom = [];
        relativeList.forEach(function(item,index){
            if(item.revertRefName && item.revertRefName.indexOf(filter) > -1) {
                jsxDom.push(
                    <Menu.Item key={"$relativeMenu" + index}>
                        <DragMenu detail={{...item, name: 'Relative'}} key={index} label={item.revertRefName}
                                  changeTemp={changeTemp} delTemp={delTemp}/>
                    </Menu.Item>
                );
            }
        });
        return jsxDom;
    }

    setFilter (e) {
        this.setState({
            filter: e.target.value,
        });
    }

    render () {
        let {relativeList} = this.props;
        let {filter} = this.state;
        return (
            <div style={{ width: 170, backgroundColor:'white', float:'left' }}>
                <div style={{padding:'10px',borderBottom: '1px solid rgb(204, 204, 204)'}}>
                    <Input placeholder="搜索" value={filter} onChange={this.setFilter}/>
                </div>
                <Menu defaultOpenKeys={['componentMenu','relativeMenu']} mode="inline" >
                    <SubMenu title="组件" key="componentMenu">
                        {this.componentListRender()}
                    </SubMenu>
                    {relativeList.length>0?<SubMenu title="相关业务" key="relativeMenu">
                        {this.relativeListRender()}
                    </SubMenu>:null}
                </Menu>
            </div>
        );
    }
}

export default DragSider;
