import React from 'react';
import Redirect from 'umi/redirect';
import RenderAuthorized from '@/components/Authorized';
import { getAuthority } from '@/utils/authority';
import { getCacheStatus } from '@/utils/cache'

const status = getCacheStatus();
const Authority = getAuthority();
const Authorized = RenderAuthorized(Authority);

export default ({ children }) => (
  <Authorized
    authority={children.props.route.authority}
    noMatch={
      <Redirect to={
        status === 'enterprise' ? `/enterprise/user/login${children.props.location.search}`
          : status === 'admin' ? `/admin/user/login${children.props.location.search}`
            : '/'
      }
      />
    }
  >
    {children}
  </Authorized>
);
