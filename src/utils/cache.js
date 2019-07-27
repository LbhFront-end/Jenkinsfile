const url = window.location.href;
const getCacheStatus = () => url.includes('enterprise') ? 'enterprise' : url.includes('admin') ? 'admin' : null;

const getLocalStorage = (name) => JSON.parse(localStorage.getItem(name));

const setLocalStorage = (name, cache) => localStorage.setItem(name, JSON.stringify(cache))

const getCache = () => {
  const status = getCacheStatus();
  if (status) {
    switch (status) {
      case 'enterprise':
        return getLocalStorage('enterpriseCache')
      case 'admin':
        return getLocalStorage('adminCache')
      default:
        return {};
    }
  }
  return {};
}

const setCache = (props) => {
  const status = getCacheStatus();
  const { companyToken, userName, imageUrl, companyName } = props;
  const cache = {
    avatar: imageUrl,
    companyToken,
    userName,
    companyName
  }
  if (status) {
    switch (status) {
      case 'enterprise':
        return setLocalStorage('enterpriseCache', cache)
      case 'admin':
        return setLocalStorage('adminCache', cache)
      default:
        return setLocalStorage('cache', cache);
    }
  }
  return null;
}



export {
  getCache,
  setCache,
  getCacheStatus
};
