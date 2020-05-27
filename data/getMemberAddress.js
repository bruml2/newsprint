/**
 *  getMemberAddress.js - a module for the scraping program
 *  May 26
 */

const getMemberAddress = function (addStr) {
  let log = false
  if (log) console.log('==> addStr: ', addStr)

  delTrailingPeriodCommaAndSpaces = (addStr) => {
    if (matchArr = addStr.match(/\s*(\.|\,)\s*$/)) {
      addStr = addStr.slice(0, matchArr.index)
    }
    return addStr
  }

  let memberAddress = {
    street: "somewhere",
    city: "nowhere",
    state: '',
    zip: "00000"
  }

  // zip;
  let zip = undefined
  // a failed match returns null which is false;
  if (zip = addStr.match(/\d+-?\d\d\d\d$/)) {
    memberAddress.zip = zip[0]
    addStr = addStr.slice(0, zip.index).trim()
  } else {
    memberAddress.zip = ''
    console.log('  ==> zip code is missing from ', addStr)
  }
  addStr = delTrailingPeriodCommaAndSpaces(addStr)
  if (log) console.log('new addStr: ', addStr)

  // state;
  let state = undefined
  if (state = addStr.match(/ +[A-Z][A-Z]$/)) {
    memberAddress.state = addStr.substr(-2)
    addStr = addStr.substring(0, state.index)
  } else {
    memberAddress.state = "unk"
    console.log('bad state parse on ', addStr)
  }
  addStr = delTrailingPeriodCommaAndSpaces(addStr)
  if (log) console.log('new addStr: ', addStr)

  //city
  let city = addStr.split('  ')
  if (city.length < 2) {
    city = addStr.split(' ')
  }
  memberAddress.city = city.pop()
  addStr = city.join(' ')
  addStr = delTrailingPeriodCommaAndSpaces(addStr)
  if (log) console.log('new addStr: ', addStr)

  // restore period to Rd and St;
  if (addStr.substr(-2) == 'Rd' ||
      addStr.substr(-2) == 'St') addStr += "."

  memberAddress.street = addStr

  return memberAddress
}

 module.exports = getMemberAddress
