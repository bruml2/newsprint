/** node program to scrap HILR members in Gov & Politics
 *  May 25, 2020
 */

const fs = require('fs')
const html = fs.readFileSync('./govpolitics.html',
                        {encoding:'utf8', flag:'r'}).toString()
// console.log(html)
const cheerio = require('cheerio')

const makeMemberObj = barSep => {
  let memberObj = {}
  let since = ''
  let fields = barSep.split('|')
  if (fields[2].match(/Read more +about/)) { fields.splice(2, 1) }
  if (fields[2].includes('Member Since') || fields[2].includes('Participant')) {
     matchesArr = fields[2].match(/\d\d\d\d/)
     if (matchesArr != null) since = matchesArr[0]
     fields.splice(2, 1)
  }
  const zipre = /\d+-?\d\d\d\d$/
  if (fields[2].match(zipre) == null && fields[3].match(zipre)) {
    // combine with next field
    fields[2] = fields[2] + ", " + fields[3]
    fields.splice(3, 1)
  }

  memberObj.name = fields[0].trim()
  memberObj.shortbio = fields[1].trim()
  memberObj.since = since
  memberObj.address = {}
  let addr = fields[2].trim()
  // console.log(addr)
  let zip = null
  if (zip = addr.match(zipre)) {
    memberObj.address.zip = zip[0]
    addr = addr.slice(0, zip.index).trim()
  } else {
    memberObj.address.zip = ''
    console.log(barSep)
    console.log('  ==> zip code is missing')
  }
  let state = null
  if (state = addr.match(/\.$/)) addr = addr.slice(0, state.index).trim()
  if (state = addr.match(/,? [A-Z][A-Z]$/)) {
    memberObj.address.state = state[0].replace(',', '').trim()
    addr = addr.slice(0, state.index).trim()
  } else {
    if (addr.includes('Cambridge')) {
      memberObj.address.state = "MA"
    } else {
      memberObj.address.state = ''
      console.log('State  ', addr)
      console.log('  ==> state is missing')
    }
  }
  let town = addr.split(',')
  if (town.length == 3) {
    memberObj.address.street = town[0] + ", " + town[1]
    memberObj.address.city = town[2]
  } else {
    if (town.length == 2) {
      memberObj.address.street = town[0]
      memberObj.address.city = town[1]
    } else {
        if ((town.length == 1) && (town = addr.split('"  "'))) {
          memberObj.address.street = town[0]
          memberObj.address.city = town[1]
        } else {
          // much harder
          console.log('giving up: ', addr)
        }
    }
  }
  // console.log(addr)
  // console.log(`zip is ${zip[0]} starting at index ${zip.index}`)
  // console.log(fields.length, fields[2], '|', fields[3])
}

const getMembers = (html, group) => {
  const $ = cheerio.load(html)
  let membersArr = []
  $('#content article').each( (idx, el) => {
    let barSep = $(el).text().replace(/ *\n/g, '|').replace(/^\|+\s+/, '').replace(/\|+\s+/g, '|')
    membersArr.push(makeMemberObj(barSep))
  })
  return {
    groupName: group,
    members: membersArr
  }
}

const groupObj = getMembers(html, "govpolitics")
// console.dir(groupObj.members)
console.log(`${groupObj.groupName} has ${groupObj.members.length} members.`)
