import React, { Component } from 'react';
import { Row, Col, Dropdown, Menu } from 'antd';
import Description from '../DropArea/Description';
const style = {
    row: {
        height: '68px',
        margin: '10px 0px',
    },
    divContent: {
        fontSize: '12px',
        height: '68px',
        textAlign: 'center',
        backgroundColor: 'white',
    },
    nullSelector: {
        color: 'rgb(0, 153, 255)',
        fontWeight: '200',
        fontStyle: 'normal',
        lineHeight: '68px',
        textAlign: 'center',
    },
};
class DigestSelector extends Component {
    constructor (props) {
        super(props);
        this.state = {
            selectorIndex: 0,
        };
        this.initMenu = this.initMenu.bind(this);
        this.renderDigestSelector = this.renderDigestSelector.bind(this);
        this.setIndex = this.setIndex.bind(this);
        this.menuClick = this.menuClick.bind(this);
    }

    setIndex (index) {
        this.setState({
            selectorIndex: index
        });
    }

    menuClick ({key}) {
        let {selectorIndex} = this.state;
        let {setDigest} = this.props;
        setDigest(selectorIndex, key == 'null' ? '' : key);
    }

    initMenu () {
        let {digestArr, menuData} = this.props;
        let menuItem = [];
        // let _this = this;
        menuItem.push(
            <Menu.Item key={'null'}>
                <span>无</span>
            </Menu.Item>
        );
        menuData.forEach(function (item, i) {
            let id = parseInt(item.id);
            if (digestArr.indexOf(parseInt(id)) != -1 || digestArr.indexOf(id + '') != -1) {
                menuItem.push(
                    <Menu.Item key={id} disabled>
                        <span>{item.label}</span>
                    </Menu.Item>
                );
            } else {
                menuItem.push(
                    <Menu.Item key={id}>
                        <span>{item.label}</span>
                    </Menu.Item>
                );
            }
        });
        return <Menu onClick={this.menuClick}>{menuItem}</Menu>;
    }

    renderDigestSelector () {
        let {digestArr, menuData} = this.props;
        let menu = this.initMenu();
        let _this = this;
        let jsxDomArr = digestArr.map(function (id, index) {
            let jsxDOM = null;
            let detail = {};
            for (let item of menuData) {
                if (item.id == id) {
                    detail = item;
                    break;
                }
            }
            if (id) {
                jsxDOM = (
                    <Col key={index} span={3} style={style.col}>
                        <div style={{...style.divContent, padding: '15px 0px'}}>
                            <Dropdown overlay={menu} trigger={['click']}>
                                <div onClick={() => {_this.setIndex(index);}}>
                                    <span>{detail.label}</span>
                                    <div><Description type={detail.type} subType={detail.subType}
                                                      extendInfo={detail.label}/></div>
                                </div>
                            </Dropdown>
                        </div>
                    </Col>
                );
            } else {
                jsxDOM = (
                    <Col key={index} span={3} style={style.col}>
                        <div style={{...style.nullSelector, ...style.divContent}}>
                            <Dropdown overlay={menu} trigger={['click']}>
                                <a className="ant-dropdown-link" onClick={() => {_this.setIndex(index);}}>
                                    设置重点字段+
                                </a>
                            </Dropdown>
                        </div>
                    </Col>
                );
            }
            return jsxDOM;
        });
        return jsxDomArr;
    }

    render () {
        let {detail} = this.props;
        return (
            <div>
                <Row gutter={8} style={style.row}>
                    {this.renderDigestSelector()}
                </Row>
            </div>
        );
    }
}

export default (DigestSelector);
