import React, { Component } from 'react';
import { Card } from 'antd';
import CustomEditor from '@/components/CustomEditor';





class Ueditor extends Component {

  state = {
    tempEditorValue: '',
  }

  render() {

    return (
      <Card title="编辑器">
        <CustomEditor onChange={this.onEditorChange} />
      </Card>
    )
  }
}

export default Ueditor;
