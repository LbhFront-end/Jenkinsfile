import React from "react";
import { Upload, Icon, Modal, message } from "antd";
// import { upload } from '@/services/tool';

const imgPrefix = 'http://pimg.21silkroad.com';
const companyToken = localStorage.getItem('companyToken');

class CustomUpload extends React.Component {
  state = {
    previewVisible: false,
    previewImage: "",
    fileList: []
  }

  componentWillReceiveProps(nextProps) {
    const { fileList } = this.props;
    if (fileList !== nextProps.fileList) {
      this.setState({
        fileList: nextProps.fileList
      })
    }
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = (file) => {
    this.setState({ previewImage: file.url || imgPrefix + file.thumbUrl, previewVisible: true });
  }

  handleChange = ({ fileList }) => {
    this.setState({ fileList })
  }

  beforeUpload = (file) => {
    const imgReg = /(.*)\/(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)/;
    const isImage = imgReg.test(file.type)
    if (!isImage) {
      message.error('请上传正确的图片类型');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('图片大小不可以大于5MB!');
    }
    return isImage && isLt5M;
  }

  handleUpload = (props) => {
    const { fileList } = this.state;
    const { handleFormItem, property, type, maxNum, initFileList } = this.props;
    const { file } = props;
    const formData = new FormData();
    formData.append('files', file);
    upload({ companyToken, type, formData, }).then(res => {
      if (res && res && res.code === 0) {
        const original = fileList.length > 0 ? fileList : initFileList || fileList;
        const result = this.formatFileList({ original, files: res.elems, maxNum });
        this.setState({ fileList: result }, () => {
          // eslint-disable-next-line react/destructuring-assignment
          handleFormItem({ fileList, property });
        })
      }
      return null;
    })
  }

  formatFileList = (props) => {
    // const { fileList } = this.state;
    const { files, maxNum, original } = props;
    let result = []
    if (original.length < maxNum) {
      result = original
    }
    if (files.length > 0) {
      files.forEach((item, i) => result.push({
        ...item,
        uid: result.length > 0 ? result[result.length - 1].uid - 1 : -i - 1,
        name: item.fileName,
        url: imgPrefix + item.fileUrl,
        status: 'done',
      }))
    }
    return result;
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const { listType = "picture-card", multiple = false, maxNum = 1, withCredentials = true, disabled, initFileList } = this.props;
    const realFileList = fileList.length > 0 ? fileList : initFileList || fileList;
    return (
      <div className="clearfix">
        <Upload
          // action={action}
          accept="image/*"
          action={(file) => this.handleUpload({ file })}
          beforeUpload={this.beforeUpload}
          multiple={multiple}
          withCredentials={withCredentials}
          listType={listType}
          fileList={realFileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          disabled={disabled}
        >
          {
            realFileList.length < maxNum &&
            <div>
              <Icon type="plus" />
              <div style={{ marginTop: "8px", color: "#666" }}>上传图片</div>
            </div>
          }
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="图片" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default CustomUpload;
