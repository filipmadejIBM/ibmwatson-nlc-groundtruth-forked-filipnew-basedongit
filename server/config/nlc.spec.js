/**
 * Copyright 2015 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

'use strict';
/*eslint func-names: 0, max-nested-callbacks: [2,10], max-statements: [2,15], handle-callback-err: 0 */

// external dependencies
var chai = require('chai');
var proxyquire = require('proxyquire').noPreserveCache();
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

var should = chai.should();
chai.use(sinonChai);

describe('/server/config/nlc', function () {

  beforeEach(function () {

    this.serviceConfig = {
      name : 'test-service',
      credentials : {
        url : 'https://test.com',
        username : 'username',
        password : 'password',
        version : 'v1'
      }
    }

    this.appMock = {
      getService : sinon.stub()
    };
    this.appMock.getService.returns(this.serviceConfig);

    this.cfMock = {
      getAppEnv : sinon.stub()
    };
    this.cfMock.getAppEnv.returns(this.appMock);

    this.overrides = {
        'cfenv' : this.cfMock
    };
  });

  it('should read nlc credentials', function () {

    var nlc = proxyquire('./nlc', this.overrides);
    nlc.id.should.equal(this.serviceConfig.name);
    nlc.url.should.equal(this.serviceConfig.credentials.url);
    nlc.username.should.equal(this.serviceConfig.credentials.username);
    nlc.password.should.equal(this.serviceConfig.credentials.password);
    nlc.version.should.equal(this.serviceConfig.credentials.version);

  });

  it('should return empty object if nlc service not defined', function () {
    this.appMock.getService.returns(undefined);
    var nlc = proxyquire('./nlc', this.overrides);
    nlc.should.deep.equal({});
  });


  it('should default version to v1 if attribute not defined', function () {
    delete this.serviceConfig.credentials.version;
    var nlc = proxyquire('./nlc', this.overrides);
    nlc.id.should.equal(this.serviceConfig.name);
    nlc.url.should.equal(this.serviceConfig.credentials.url);
    nlc.username.should.equal(this.serviceConfig.credentials.username);
    nlc.password.should.equal(this.serviceConfig.credentials.password);
    nlc.version.should.equal('v1');
  });

});