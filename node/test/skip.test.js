/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 * Copyright 2017 MarkLogic Corp.                                             *
 *                                                                            *
 * Licensed under the Apache License, Version 2.0 (the "License");            *
 * you may not use this file except in compliance with the License.           *
 * You may obtain a copy of the License at                                    *
 *                                                                            *
 *     http://www.apache.org/licenses/LICENSE-2.0                             *
 *                                                                            *
 * Unless required by applicable law or agreed to in writing, software        *
 * distributed under the License is distributed on an "AS IS" BASIS,          *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   *
 * See the License for the specific language governing permissions and        *
 * limitations under the License.                                             *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
'use strict';
const path = require('path');
const test = require('tape');
const remote = require('../marklogic-remote')();
const { parseTAP } = require('../lib/tap-helpers');

test('skip', assert => {
  assert.plan(6);
  remote('skip.test.sjs', path.resolve(__dirname, '../../marklogic/test'))
    .then(tap => parseTAP(tap))
    .then(tap => {
      assert.true(tap.ok);
      assert.equal(tap.count, 1);
      assert.equal(tap.pass, 1);
      assert.equal(tap.fail, 0);
      assert.equal(tap.plan.start, 1);
      assert.equal(tap.plan.end, 1);
    })
    .catch(assert.end);
});
