/**
 * 计算两个日期字符串的差值
 * @export
 * @param {string} startDate 形如'2000-10-27'的字符串
 * @param {string} endDate 形如'2000-10-27'的字符串
 */
function calcDateDiff(startDate, endDate) {
  const startTime = new Date(startDate).getTime();
  const endTime = new Date(endDate).getTime();
  const diffTime = endTime - startTime;
  return diffTime / 1000 / 24 / 60 / 60;
}
module.exports = {
  calcDateDiff,
};
