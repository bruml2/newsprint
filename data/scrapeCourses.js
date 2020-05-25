/** node program to scrap HILR courses table
 *  May 24, 2020
 */

const fs = require('fs')
const html = fs.readFileSync('./hilrcourses.html',
                        {encoding:'utf8', flag:'r'}).toString()
// console.log(html)
const cheerio = require('cheerio')

let getTableArr = (html, tableID) => {
  let tableArr = []
  const $ = cheerio.load(html)
  const re4tabs = /\t\t\t\t/g
  const re3tabsnl = /\t\t\t\n/g
  $('table#' + tableID + ' tr').each( (idx, el) => {
    let noQuadTabs = $(el).text().replace(re4tabs, '')
    let noTabs = noQuadTabs.replace(re3tabsnl, '')
    let nonl = noTabs.replace(/\n/g, '","')
    let noStart = nonl.replace(/^",/, '')
    let final = noStart.replace(/,"\t\t$/, '')
    tableArr.push(final)
  })
  return tableArr
}

let tableArr = getTableArr(html, 'monTable').concat(getTableArr(html, 'tuesTable'),
                                                    getTableArr(html, 'wedTable'),
                                                    getTableArr(html, 'thursTable'))
console.log(tableArr.length, ' courses in tableArr')

let coursesArr = []
let id = 1
tableArr.forEach( (course) => {
  const itemArr = course.split('","')
  if (itemArr[1] != "COURSE NAME") {
    coursesArr.push({
      orderid: id++,
      crn: itemArr[0].replace('"', ''),
      title: itemArr[1],
      sgl1: itemArr[2],
      sgl2: itemArr[3],
      day: itemArr[4],
      time: itemArr[5],
      duration: itemArr[6].replace(' Semester', '').replace(/"$/, '')
    })
  }
})
console.log(`${coursesArr.length} courses processed`)
// console.dir(coursesArr)
fs.writeFileSync("coursesArr.json", JSON.stringify(coursesArr, undefined, 2))
