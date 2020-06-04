/**
 *  getSessions.js  -  getSessions(day, duration)
 *    returns: [ "September 14, 2020", ...]
 */

'use strict';
const { sessions } = require ('./sessions.js')

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

module.exports = function getSessions(day, duration) {
  const sessionArr = sessions[day][duration]
  return sessionArr.map( date => {
    const yyyymmddArr = date.split('-')
    // months are zero-indexed;
    yyyymmddArr[1] -= 1
    const month = months[yyyymmddArr[1]]
    return `${month} ${yyyymmddArr[2]}, ${yyyymmddArr[0]}`
    // const dateParts = new Date(...yyyymmddArr).toString().split(' ')
    // return dateParts.slice(1, 4).join(' ')
  })
}
