/*
 * @Date: 2021-04-21 12:25:33
 * @Description: 全局共用方法
 */

/**
 * @description: promise all 的补充
 * @param {Array} promiseArr
 * @return {Promise} 全部 resolve 的数据，或者所有 reject 的数据
 */
export const promiseAllStated = promiseArr => {
  if (!Promise) return;
  let resolveArr = [],
    rejectArr = [],
    count = 0;
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promiseArr.length; i++) {
      if (promiseArr[i] instanceof Promise) {
        promiseArr[i].then(res => {
          resolveArr[i] = res;
        }).catch(error => {
          rejectArr.push(error);
        }).finally(() => {
          count++;
          if (count < promiseArr.length) return;
          if (rejectArr.length == 0) {
            resolve(resolveArr);
          } else {
            reject(rejectArr)
          }
        });
      } else {
        reject(`index${i} is not Promise`);
      }
    }
  })
}

export const searchParse = () => {
  const search = location.search.slice(1)?.split('&');
  const searchObj = {};
  search.forEach(item => {
    const param = item.split('=')
    searchObj[param[0]] = param[1]
  })
  return searchObj
}