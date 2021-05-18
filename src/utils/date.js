import dayjs from 'dayjs'

/**
 * 获取几天前的日期
 * @subDate {[number]} 减去的天数
 * @date {[String, Date]} 相对调整的日期
 * @return {[Date]} [2020-07-06]
 */
export function getDateBySub(subDate = 1, date = new Date()) {
  const returnDate = new Date(new Date(date).getTime() - subDate * 24 * 60 * 60 * 1000)
  return dayjs(returnDate).format("YYYY-MM-DD")
}

/**
 * 获取格式化的当前时间
 * @date {[String, Date]} 需要格式化的日期，默认当期那时间
 * @formatString {[String]} 需要格式化的格式，默认 'YYYY-MM-DD HH:mm'
 * @return {[String]} [2020-07-06 17:17, 2020-07-06...]
 */
export function formatDate(date = new Date(), formatString = 'YYYY-MM-DD') {
  return dayjs(date).format(formatString)
}

/**
 * 获取两个时间相差几天
 * @sDate {[String, Date]} 起始时间
 * @eDate {[String, Date]} 结束时间
 * @floor {Boolean} 是否需要取整
 * @return {[Number]}
 */
export function dateDifference(sDate, eDate, floor = true) { 
  sDate = new Date(sDate);
  eDate = new Date(eDate);
  const dateSpan = Math.abs(sDate - eDate);
  return floor ? Math.floor(dateSpan / (24 * 3600 * 1000)) : dateSpan / (24 * 3600 * 1000);
}