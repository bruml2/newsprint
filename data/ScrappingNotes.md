## Scrapping the HILR courses table

HTML was copied from DevTools Source tab.

Has four tables for Mon Tue Wed Thu; gave them ids;

Tools: cherrio
 basic: <https://blog.bitsrc.io/https-blog-bitsrc-io-how-to-perform-web-scraping-using-node-js-5a96203cb7cb>

$('css selector') methods:
text: gives the text inside the element (text children of the tree).
html: inner HTML of the element.
find: find children of the element using CSS selector.
attribs : gives the attribute of the element.

const $ = cheerio.load(<htmlstring>)

Wrote the JSON to a filename.json;
Can be read by require('filename.json')
