import React, { Fragment } from 'react';
// import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import { Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
// import SelectLang from '@/components/SelectLang';
import styles from './UserLayout.less';
import logo from '../assets/logo_black.svg';

const links = [
  // {
  //   key: 'help',
  //   title: formatMessage({ id: 'layout.user.link.help' }),
  //   href: '',
  // },
  // {
  //   key: 'privacy',
  //   title: formatMessage({ id: 'layout.user.link.privacy' }),
  //   href: '',
  // },
  // {
  //   key: 'terms',
  //   title: formatMessage({ id: 'layout.user.link.terms' }),
  //   href: '',
  // },
];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2019 广东新安怀科技发展有限公司
  </Fragment>
);

class UserLayout extends React.PureComponent {
  // @TODO title
  // getPageTitle() {
  //   const { routerData, location } = this.props;
  //   const { pathname } = location;
  //   let title = '21silkroad';
  //   if (routerData[pathname] && routerData[pathname].name) {
  //     title = `${routerData[pathname].name} - 21silkroad`;
  //   }
  //   return title;
  // }

  render() {
    const { children } = this.props;
    const url = window.location.href
    const appName = url.includes('enterprise') ? '企业端' : url.includes('admin') ? '运营端' : null
    return (
      // @TODO <DocumentTitle title={this.getPageTitle()}>
      <div className={styles.container}>
        {/* <div className={styles.lang}>
          <SelectLang />
        </div> */}
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/enterprise">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>{appName}</span>
              </Link>
            </div>
            {/* <div className={styles.desc}>M2B 企业端 是佛山最具影响力的 xx 规范</div> */}
          </div>
          {children}
        </div>
        <GlobalFooter links={links} copyright={copyright} />
      </div>
    );
  }
}

export default UserLayout;
