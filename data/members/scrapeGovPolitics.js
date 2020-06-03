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

  // console.log(fields.length, fields)
  return memberObj
}

const getMembers = (htmlfile, group) => {
  const html = fs.readFileSync(htmlfile,
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

const govPoliticsMembersObj = getMembers('./newgovpol.html', "govpolitics")
// fs.writeFileSync("govPoliticsMembersObj.json", JSON.stringify(govPoliticsMembersObj, undefined, 2))

// other groups

// console.dir(JSON.stringify(govPoliticsMembersObj.members, null, 2))
// console.log(`${govPoliticsMembersObj.groupName} has ${govPoliticsMembersObj.members.length} members.`)

fs.writeFileSync("membersGPB.json", JSON.stringify(govPoliticsMembersObj, undefined, 2))
