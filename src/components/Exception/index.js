import React, { createElement } from 'react';
import classNames from 'classnames';
import { Button } from 'antd';
import config from './typeConfig';
import styles from './index.less';

const url = window.location.href;

let redirect = '/';
let backText = '返回登录页';
let desc = '抱歉，您还没有登录';

if (url.includes('enterprise')) {
  const enterpriseCache = localStorage.getItem('enterpriseCache')
  redirect = enterpriseCache ? '/enterprise/' : '/enterprise/user/login';
} else if (url.includes('admin')) {
  const adminCache = localStorage.getItem('adminCache')
  redirect = adminCache ? '/admin/' : '/admin/user/login';
} else {
  redirect = '/';
  backText = '返回首页';
  desc = '抱歉，您无权访问该页面'
}


class Exception extends React.PureComponent {
  static defaultProps = {
    backText,
    redirect,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      className,
      // backText,
      linkElement = 'a',
      type,
      title,
      // desc,
      img,
      actions,
      ...rest
    } = this.props;
    const pageType = type in config ? type : '404';
    const clsString = classNames(styles.exception, className);
    return (
      <div className={clsString} {...rest}>
        <div className={styles.imgBlock}>
          <div
            className={styles.imgEle}
            style={{ backgroundImage: `url(${img || config[pageType].img})` }}
          />
        </div>
        <div className={styles.content}>
          <h1>{title || config[pageType].title}</h1>
          <div className={styles.desc}>{desc || config[pageType].desc}</div>
          <div className={styles.actions}>
            {actions ||
              createElement(
                linkElement,
                {
                  to: redirect,
                  href: redirect,
                },
                <Button type="primary">{backText}</Button>
              )}
          </div>
        </div>
      </div>
    );
  }
}

export default Exception;
