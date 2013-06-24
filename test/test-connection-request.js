/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
'use strict';

const { Ci } = require('chrome');
const tabs = require('sdk/tabs');
const { data } = require('sdk/self');
const { Loader } = require('sdk/test/loader');
const httpd = require('sdk/test/httpd');

const { RequestRule } = require('pathfinder/connections');

exports.testNewHeader = function(assert, done) {
  let rule = RequestRule({
    headers: {
      'X-TEST-HEADER': 'TEST'
    }
  });

  let serverPort = 8058;
  let server = httpd.startServerAsync(serverPort);
  const contents = "testNewHeader";

  server.registerPathHandler("/test.txt", function handle(request, response) {
    try {
      assert.equal(request.getHeader('X-TEST-HEADER'), 'TEST', 'the new test header value is correct');
    }
    catch (e) {
      assert.fail(e);
    }
    rule.destroy();
    response.write(contents);
  });

  tabs.open({
    url: 'http://localhost:' + serverPort + '/test.txt',
    onReady: function() {
      server.stop(function() {
        done();
      });
    }
  })
}

require('sdk/test').run(exports);
