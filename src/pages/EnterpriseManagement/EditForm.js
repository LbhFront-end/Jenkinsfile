import React, { Component } from 'react';
import { Form, Modal, Tabs, Descriptions, Card } from 'antd';

import { renderContent, renderTitle, renderPickEnterpriseLanguage, renderOmitEnterpriseLanguage, formatLanguage, renderCensorButton } from '@/utils/commonFunction'

const { TabPane } = Tabs;

@Form.create()
class EditForm extends Component {


  renderTab = (initialFormData) => {
    const panes = [];
    const { languages = [], ...rest } = initialFormData;
    languages.forEach((item, i) => {
      const { language, token, ...restProps } = item;
      panes.push({ title: language, content: restProps, key: i + 2 })
    })

    panes.unshift({ title: '英文', content: renderPickEnterpriseLanguage(rest), key: 1 })
    return (
      <Card bordered={false}>
        <Tabs onChange={this.onTabchange}>
          {
            panes.map(pane => (
              <TabPane tab={formatLanguage(pane.title)} key={pane.key}>
                <Descriptions title="语言详情" Info>
                  {renderContent(pane.content)}
                </Descriptions>
              </TabPane>
            ))
          }
        </Tabs>
        <Descriptions title="企业详情" Info>
          {renderContent(renderOmitEnterpriseLanguage(rest))}
        </Descriptions>
      </Card>
    )
  }


  render() {
    const {
      form,
      onCancel,
      detailForm,
      visible,
      modalState,
    } = this.props;
    const pickCensor = ['PASS', 'RETURN']
    return (
      <Modal
        {...this.props}
        form={form}
        title={renderTitle(modalState)}
        visible={visible}
        width={900}
        onCancel={onCancel}
        footer={renderCensorButton({ ...this.props, record: detailForm, pickCensor })}
      >
        {this.renderTab(detailForm)}
      </Modal>
    )
  }
}

export default EditForm;
