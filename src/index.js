const request = require('request');
const htmlParser = require('./html-parser');

function showMetadata(url) {
  if (!url) {
    throw new Error('website url is mandatory');
  }
  const options = {
    url,
    headers: {'User-Agent': 'request'},
  };

  request(options, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      console.error('something wrong', response);
      return;
    }

    console.log(JSON.stringify(htmlParser.parse(body)));
  });
}

module.exports = {
  showMetadata,
};
