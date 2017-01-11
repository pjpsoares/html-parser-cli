const cheerio = require('cheerio');
const _ = require('lodash');

function parse(body) {
  const $ = cheerio.load(body);
  const allElements = $('*');
  let tagsMetadata = {};

  _(allElements)
    .filter((element) => element.type === 'tag')
    .groupBy('name')
    .forEach((tagElements, tagName) => {
      tagsMetadata[tagName] = generateMetaForTags(tagElements);
    });

  return {
    'tags': tagsMetadata,
    'max-depth': getDepth(allElements[0]),
    'links': getSourcesInfo(allElements),
  };
}

function getSource(element) {
  return element.attribs && (element.attribs.src || element.attribs.href);
}

function extractDomains(elements) {
  return _(elements)
    .map(getSource)
    .value();
}

function getSourcesInfo(elements) {
  let meta = {};

  _(elements)
    .filter(getSource)
    .groupBy('name')
    .forEach((value, key) => {
      meta[key] = extractDomains(value);
    });

  return meta;
}

function getDepth(head) {
  if (!head.children || !head.children.length) {
    return 1;
  }

  return _(head.children)
    .map((element) => getDepth(element))
    .max() + 1;
}

function populateWithTagInfo(children, meta) {
  _(children)
    .filter((element) => element.type === 'tag')
    .groupBy('name')
    .forEach((elements, tagName) => {
      if (!meta[tagName]) {
        meta[tagName] = elements.length;
      } else {
        meta[tagName] += elements.length;
      }
    });
}

function populateWithAttribs(attrs, meta) {
  _.forEach(attrs, (value, key) => {
    if (!meta[key]) {
      meta[key] = 1;
    } else {
      meta[key] ++;
    }
  });
}

function generateMetaForTags(tags) {
  let childsMeta = {};
  let attribsMeta = {};

  tags.forEach((element) => {
    populateWithTagInfo(element.children, childsMeta);
    populateWithAttribs(element.attribs, attribsMeta);
  });

  return {
    count: tags.length,
    childsMeta,
    attribsMeta,
  };
}

module.exports = {
  parse,
};
