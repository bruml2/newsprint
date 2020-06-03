/**
 *  scrapeMembersGovPolitics.js  - ;
 *  May 28;
 *  May 31; works fine on one 15 member "page" from govPolitics;
 */
'use strict'

const fs = require('fs')
const cheerio = require('cheerio')

const scrapeMembersFromHTML = (html, group) => {
  const $ = cheerio.load(html, {
    normalizeWhitespace: false,  // default;
    decodeEntities: true
  })
  let membersArr = []
  $('#content article').each( (idx, el) => {
    let memberObj = {}
    memberObj.name = $(el).find(".node-title a").text()
    memberObj.photoURL = $(el).find("figure img").attr("src")
    memberObj.shortbio = $(el).find(".pic-bio .field-item").text()
    memberObj.address = $(el).find(".field-name-field-address .field-item").text()
    memberObj.email = $(el).find(".field-name-field-email .field-item a").text()
    memberObj.tel = $(el).find(".field-name-field-phone .field-item").text()
    membersArr.push(memberObj)
  })

  return {
    groupName: group,
    count: membersArr.length,
    members: membersArr
  }
}

const scrapeHTMLFileOfMembers = (filename, group) => {
  const html = fs.readFileSync(filename, {encoding:'utf8', flag:'r'}).toString()
  const membersObj = scrapeMembersFromHTML(html, group)
  const jsonFilename = filename.replace('.html', '.json')
  fs.writeFileSync(jsonFilename, JSON.stringify(membersObj, undefined, 2))
}

scrapeHTMLFileOfMembers('./govpolitics.html', 'govpol')
