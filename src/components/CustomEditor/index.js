/* eslint-disable global-require */
import React,{PureComponent} from 'react';
import RcUeditor from 'react-ueditor-wrap';

export default class CustomEditor extends PureComponent{

  render(){
    const {onChange,value}=  this.props;
    const editorConfig  = {
      initialFrameWidth:'100%',
      // serverUrl:`/api/ueditor/jsp/controller.jsp`,
      // serverUrl:`/enterprise/company/companyToken/asks`,
      // ueditorUrl:`http://192.168.1.3:666/lib/ueditor/ueditor.all.js`,
      // ueditorConfigUrl:`http://192.168.1.3:666/lib/ueditor/ueditor.config.js`,

    }
    return(
      <RcUeditor
        onChange={onChange}
        editorConfig={editorConfig}
        value={value}
        ueditorUrl="http://upload.anhuai.com/ueditor.all.js"
        ueditorConfigUrl="http://upload.anhuai.com/ueditor.config.js?site=cGltZy4yMXNpbGtyb2FkLmNvbQ=="
      />
      )
  }

}
