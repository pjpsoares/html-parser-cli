const htmlParser = require('../src/html-parser');
const chai = require('chai');
const expect = chai.expect;

describe('html parser', () => {
  describe('when we have an empty html page', () => {
    const html = `
      <html>
        <head></head>
        <body></body>
      </html>
    `;
    let metadata;

    beforeEach(() => {
      metadata = htmlParser.parse(html);
    });

    it('should have depth as 2', () => {
      expect(metadata['max-depth']).to.equal(2);
    });

    it('should have no links', () => {
      expect(metadata.links).to.deep.equal({});
    });

    it('should have count as 1 for html', () => {
      expect(metadata.tags.html.count).to.equal(1);
    });

    it('should have count as 1 for head', () => {
      expect(metadata.tags.head.count).to.equal(1);
    });

    it('should have count as 1 for body', () => {
      expect(metadata.tags.body.count).to.equal(1);
    });

    it('should have 1 tag head and 1 tag body for html', () => {
      expect(metadata.tags.html.childsMeta).to.deep.equal({
        body: 1,
        head: 1,
      });
    });

    it('should have no tags for head', () => {
      expect(metadata.tags.head.childsMeta).to.deep.equal({});
    });

    it('should have no tags for body', () => {
      expect(metadata.tags.body.childsMeta).to.deep.equal({});
    });

    it('should have no attributes for html', () => {
      expect(metadata.tags.html.attribsMeta).to.deep.equal({});
    });

    it('should have no attributes for head', () => {
      expect(metadata.tags.head.attribsMeta).to.deep.equal({});
    });

    it('should have no attributes for body', () => {
      expect(metadata.tags.body.attribsMeta).to.deep.equal({});
    });
  });

  describe('when we have an html page with a long chain of divs', () => {
    const html = `
      <html>
        <head></head>
        <body>
          <h1>title</h1>
          <div>
            <div>
              <div>
                <div>
                  <div>
                    something
                  </div>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
    let metadata;

    beforeEach(() => {
      metadata = htmlParser.parse(html);
    });

    // We have to take into consideration the element of text
    it('should have depth of 8', () => {
      expect(metadata['max-depth']).to.equal(8);
    });

    it('should have no links', () => {
      expect(metadata.links).to.deep.equal({});
    });

    it('should have count as 1 for html', () => {
      expect(metadata.tags.html.count).to.equal(1);
    });

    it('should have count as 1 for head', () => {
      expect(metadata.tags.head.count).to.equal(1);
    });

    it('should have count as 1 for body', () => {
      expect(metadata.tags.body.count).to.equal(1);
    });

    it('should have count as 1 for h1', () => {
      expect(metadata.tags.h1.count).to.equal(1);
    });

    it('should have count as 5 for div', () => {
      expect(metadata.tags.div.count).to.equal(5);
    });

    it('should have 1 tag head and 1 tag body for html', () => {
      expect(metadata.tags.html.childsMeta).to.deep.equal({
        body: 1,
        head: 1,
      });
    });

    it('should have no tags for head', () => {
      expect(metadata.tags.head.childsMeta).to.deep.equal({});
    });

    it('should have 1 tag h1 and 1 tag div for body', () => {
      expect(metadata.tags.body.childsMeta).to.deep.equal({
        div: 1,
        h1: 1,
      });
    });

    it('should have no tags for h1', () => {
      expect(metadata.tags.h1.childsMeta).to.deep.equal({});
    });

    it('should have 4 tags div for div', () => {
      expect(metadata.tags.div.childsMeta).to.deep.equal({
        div: 4,
      });
    });

    it('should have no attributes for html', () => {
      expect(metadata.tags.html.attribsMeta).to.deep.equal({});
    });

    it('should have no attributes for head', () => {
      expect(metadata.tags.head.attribsMeta).to.deep.equal({});
    });

    it('should have no attributes for body', () => {
      expect(metadata.tags.body.attribsMeta).to.deep.equal({});
    });

    it('should have no attributes for h1', () => {
      expect(metadata.tags.body.attribsMeta).to.deep.equal({});
    });

    it('should have no attributes for div', () => {
      expect(metadata.tags.body.attribsMeta).to.deep.equal({});
    });
  });

  describe('when we have an html page with stylesheet link, some anchor elements and some img', () => {
    const html = `
      <html>
        <head>
          <link rel="stylesheet" href="http://domain1.css" />
          <link rel="stylesheet" href="http://domain2.css" />
        </head>
        <body>
          <h1>title</h1>
          <ul>
            <li><a href="http://domain1.com">domain1</a></li>
            <li><a href="http://domain2.com">domain2</a></li>
          </ul>
          <img src="http://domain3.com/img.jpg"/>
        </body>
      </html>
    `;
    let metadata;

    beforeEach(() => {
      metadata = htmlParser.parse(html);
    });

    it('should have 2 rel attributes and 2 href attributes for link', () => {
      expect(metadata.tags.link.attribsMeta).to.deep.equal({
        href: 2,
        rel: 2,
      });
    });

    it('should have 2 href attributes for a', () => {
      expect(metadata.tags.a.attribsMeta).to.deep.equal({
        href: 2,
      });
    });

    it('should have 1 src attributes for img', () => {
      expect(metadata.tags.img.attribsMeta).to.deep.equal({
        src: 1,
      });
    });

    it('should have both links for link elemen', () => {
      expect(metadata.links.link).to.deep.equal([
        'http://domain1.css',
        'http://domain2.css',
      ]);
    });

    it('should have both links for a element', () => {
      expect(metadata.links.a).to.deep.equal([
        'http://domain1.com',
        'http://domain2.com',
      ]);
    });

    it('should have both links for img element', () => {
      expect(metadata.links.img).to.deep.equal([
        'http://domain3.com/img.jpg',
      ]);
    });
  });
});
