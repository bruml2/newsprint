/** node program to scrap HILR members in Gov & Politics
 *  May 25, 2020
 */

const fs = require('fs')
const cheerio = require('cheerio')
const getMemberAddress = require('./getMemberAddress.js')

const makeMemberObj = barSep => {
  let fields = barSep.split('|')
  console.log(fields.length, "begin: ", fields[0])

  let memberObj = {}
  memberObj.name = fields[0].trim()
  memberObj.shortbio = fields[1].replace(/Read more .+/, '').trim()
  // console.log(memberObj.name)
  // console.log(memberObj.shortbio)

  // two possible extraneous lines as fields[2]:
  if (fields[2].match(/Read more +about/)) {
    console.log(' ==> deleting: ', fields[2])
    fields.splice(2, 1)
  }
  if (fields[2].includes('Member Since') || fields[2].includes('Participant')) {
     matchesArr = fields[2].match(/\d\d\d\d/)
     memberObj.since = matchesArr ? matchesArr[0] : ''
     console.log(' ==> deleting: ', fields[2])
     fields.splice(2, 1)
  }
  // remove parsed lines;
  fields.splice(0, 2)

  // console.log('without beginning lines: ', fields.length, fields)

  // deal with final lines;
  let temp = null
  if (temp = fields.pop() != '') fields.push(temp)
  // console.log("last line: ", fields[fields.length - 1])

  if (fields.length > 0 &&
      fields[fields.length - 1].includes('p: ')) {
    let tel = fields.pop()
    let mobile = undefined
    let extra = "";

    [ tel, mobile, extra ] = tel.split(';')
    tel = tel.replace('p: ', '').trim()
    if (/^\(\d\d\d\) ?\d\d\d-\d\d\d\d$/.test(tel)) {
      let match = tel.match(/\((\d\d\d)\) (\d\d\d-\d\d\d\d)/)
      memberObj.tel = match[1] + '-' + match[2]
    } else {
      memberObj.tel = tel
    }
    memberObj.mobile = mobile ?
      mobile.match(/\(?\d\d\d\)?.\d\d\d-\d\d\d\d/)[0] : ''
  } else {
    // tel is missing; leave line in place;
    console.log('bad tel parse: ', fields[fields.length - 1])
    memberObj.badtelparse = fields[fields.length - 1]
  }

  if (fields.length > 0 && fields[fields.length - 1].includes('@')) {
    memberObj.email = fields.pop()
  } else {
    console.log('bad email parse: ', fields[fields.length - 1])
    memberObj.bademailparse = fields[fields.length - 1]
  }

  if (fields.length > 2) {
    console.log('fields with address: ', fields.length, fields)
  }
  memberObj.address = getMemberAddress(fields.join(',  '))
  console.log(memberObj.address)

  console.log("\n========================")
/*
  const zipre = /\d+-?\d\d\d\d$/
  if (fields[2].match(zipre) == null && fields[3].match(zipre)) {
    // combine with next field
    fields[2] = fields[2] + ", " + fields[3]
    console.log("combined two address lines: ", fields[2])
    fields.splice(3, 1)
  }

  // pass extra line for split address;
  let usedSecondLine = false
  memberObj.address =
             getMemberAdddress(fields[2])
  if (usedSecondLine) {
    fields[2] = fields[2] + "," + fields[3]
    fields.splice(3, 1)
  }

  console.log('coming up: ', fields[3])

  memberObj.address = {}
  let addr = fields[2].trim()
  // console.log(addr)
  let zip = null
  if (zip = addr.match(zipre)) {
    memberObj.address.zip = zip[0]
    addr = addr.slice(0, zip.index).trim()
  } else {
    memberObj.address.zip = ''
    // console.log(barSep)
    // console.log('  ==> zip code is missing')
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
      // console.log('State  ', addr)
      // console.log('  ==> state is missing')
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
  */


  // console.log(fields.length, fields)
  return memberObj
}

const getMembers = (htmlfile, group) => {
  const html = fs.readFileSync('./govpolitics.html',
                         {encoding:'utf8', flag:'r'}).toString()
  const $ = cheerio.load(html)
  let membersArr = []
  $('#content article').each( (idx, el) => {
    let barSep = $(el).text().replace(/ *\n/g, '|').replace(/^\|+\s*/, '').replace(/\|+\s*/g, '|')
    membersArr.push(makeMemberObj(barSep))
  })
  return {
    groupName: group,
    count: membersArr.length,
    members: membersArr
  }
}

const govPoliticsObj = getMembers('./govpolitics.html', "govpolitics")
// fs.writeFileSync("govPoliticsObj.json", JSON.stringify(govPoliticsObj, undefined, 2))

// other groups

// console.dir(JSON.stringify(govPoliticsObj.members, null, 2))
// console.log(`${govPoliticsObj.groupName} has ${govPoliticsObj.members.length} members.`)

// fs.writeFileSync("membersArr.json", JSON.stringify(membersArr, undefined, 2))
