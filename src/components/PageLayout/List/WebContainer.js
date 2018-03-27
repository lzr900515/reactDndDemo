import React, { Component } from 'react';
import WebDropArea from '../../DragAndDrop/PageLayout/WebDropArea';

class WebContainer extends Component {
    constructor (props) {
        super(props);
        this.renderDropArea = this.renderDropArea.bind(this);
        this.dropArea1 = this.dropArea1.bind(this);
    }

    renderDropArea () {
        let {layoutType} = this.props;
        switch (layoutType) {
            case 0:
                return this.dropArea1();
            default:
                return this.dropArea1();
        }
    }

    dropArea1 () {
        let {
            dataSource, detailLayout, setComponentArea, setLayoutField, delElement, setFieldsConfigList, fieldsConfigList,
            OS_selectedArr, OS_setSelectedArr, TAB_setTabList, TAB_setTabActiveKey
        } = this.props;
        return (
            <div style={{height: '700px', overflow: 'auto'}}>
                <div style={{
                    width: '100%',
                    marginBottom: '10px',
                    backgroundColor: 'white',
                    border: '1px lightgray dotted'
                }}>
                    <WebDropArea dataSource={dataSource}//布局结构
                                 areaIndex={0}
                                 detailLayout={detailLayout}//详细资料布局
                                 setComponentArea={setComponentArea}
                        // addElement={this.addElement}
                                 theme={'default'}
                                 setLayoutField={setLayoutField}
                                 delElement={(index, inTab) => {delElement(0, index, inTab);}}
                                 setFieldsConfigList={setFieldsConfigList}
                                 fieldsConfigList={fieldsConfigList}
                                 OS_selectedArr={OS_selectedArr}
                                 OS_setSelectedArr={OS_setSelectedArr}
                                 TAB_setTabList={(newVal) => {TAB_setTabList(0, newVal);}}
                                 TAB_setTabActiveKey={(newVal) => {TAB_setTabActiveKey(0, newVal);}}
                    />
                </div>
                <div style={{display: 'flex'}}>
                    <div style={{
                        width: '66%',
                        marginRight: '1%',
                        backgroundColor: 'white',
                        border: '1px lightgray dotted',
                        display: 'inline-block',
                        verticalAlign: 'top',
                    }}>
                        <WebDropArea dataSource={dataSource}//布局结构
                                     areaIndex={1}
                                     detailLayout={detailLayout}//详细资料布局
                                     setComponentArea={setComponentArea}
                            // addElement={this.addElement}
                                     theme={'default'}
                                     setLayoutField={setLayoutField}
                                     delElement={(index, inTab) => {delElement(1, index, inTab);}}
                                     setFieldsConfigList={setFieldsConfigList}
                                     fieldsConfigList={fieldsConfigList}
                                     OS_selectedArr={OS_selectedArr}
                                     OS_setSelectedArr={OS_setSelectedArr}
                                     TAB_setTabList={(newVal) => {TAB_setTabList(1, newVal);}}
                                     TAB_setTabActiveKey={(newVal) => {TAB_setTabActiveKey(1, newVal);}}
                        />
                    </div>
                    <div style={{
                        width: '33%',
                        backgroundColor: 'white',
                        border: '1px lightgray dotted',
                        display: 'inline-block',
                        verticalAlign: 'top',
                    }}>
                        <WebDropArea dataSource={dataSource}//布局结构
                                     areaIndex={2}
                                     detailLayout={detailLayout}//详细资料布局
                                     setComponentArea={setComponentArea}
                            // addElement={this.addElement}
                                     theme={'small'}
                                     setLayoutField={setLayoutField}
                                     delElement={(index, inTab) => {delElement(2, index, inTab);}}
                                     setFieldsConfigList={setFieldsConfigList}
                                     fieldsConfigList={fieldsConfigList}
                                     OS_selectedArr={OS_selectedArr}
                                     OS_setSelectedArr={OS_setSelectedArr}
                                     TAB_setTabList={(newVal) => {TAB_setTabList(2, newVal);}}
                                     TAB_setTabActiveKey={(newVal) => {TAB_setTabActiveKey(2, newVal);}}
                        />
                    </div>
                </div>
            </div>
        );
    }

    render () {
        return <div>
            {
                this.renderDropArea()
            }
        </div>;
    }
}
export default WebContainer;
