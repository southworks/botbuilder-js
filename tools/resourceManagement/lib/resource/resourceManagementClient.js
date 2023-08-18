/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */

/* jshint latedef:false */
/* jshint forin:false */
/* jshint noempty:false */

'use strict';

const msRest = require('ms-rest');
const fs = require('fs');
const path = require('path');
const ServiceClient = msRest.ServiceClient;

const models = require('./models');
const operations = require('./operations');


/** Class representing a ResourceManagementClient. */
class ResourceManagementClient extends ServiceClient {
  /**
   * Create a ResourceManagementClient.
   * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
   * @param {string} subscriptionId - The ID of the target subscription.
   * @param {string} [baseUri] - The base URI of the service.
   * @param {object} [options] - The parameter options
   * @param {Array} [options.filters] - Filters to be added to the request pipeline
   * @param {object} [options.requestOptions] - Options for the underlying request object
   * {@link https://github.com/request/request#requestoptions-callback Options doc}
   * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
   * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
   * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
   * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
   */
  constructor(credentials, subscriptionId, baseUri, options) {
    if (credentials === null || credentials === undefined) {
      throw new Error('\'credentials\' cannot be null.');
    }
    if (subscriptionId === null || subscriptionId === undefined) {
      throw new Error('\'subscriptionId\' cannot be null.');
    }

    if (!options) options = {};

    super(credentials, options);

    this.apiVersion = '2017-05-10';
    this.acceptLanguage = 'en-US';
    this.longRunningOperationRetryTimeout = 30;
    this.generateClientRequestId = true;
    this.baseUri = baseUri;
    if (!this.baseUri) {
      this.baseUri = 'https://management.azure.com';
    }
    this.credentials = credentials;
    this.subscriptionId = subscriptionId;

    //Property to store various pieces of information we would finally concat to produce a user-agent header.
    this.userAgentInfo = { value: [] };

    let packageInfo = this.getPackageJsonInfo(__dirname);
    this.addUserAgentInfo(`${packageInfo.name}/${packageInfo.version}`);
    if (options.acceptLanguage !== null && options.acceptLanguage !== undefined) {
      this.acceptLanguage = options.acceptLanguage;
    }
    if (options.longRunningOperationRetryTimeout !== null && options.longRunningOperationRetryTimeout !== undefined) {
      this.longRunningOperationRetryTimeout = options.longRunningOperationRetryTimeout;
    }
    if (options.generateClientRequestId !== null && options.generateClientRequestId !== undefined) {
      this.generateClientRequestId = options.generateClientRequestId;
    }
    this.deployments = new operations.Deployments(this);
    this.providers = new operations.Providers(this);
    this.resources = new operations.Resources(this);
    this.resourceGroups = new operations.ResourceGroups(this);
    this.tags = new operations.Tags(this);
    this.deploymentOperations = new operations.DeploymentOperations(this);
    this.models = models;
    msRest.addSerializationMixin(this);
  }

  addUserAgentInfo(additionalUserAgentInfo) {
    if (this.userAgentInfo.value.indexOf(additionalUserAgentInfo) === -1) {
      this.userAgentInfo.value.push(additionalUserAgentInfo);
    }
  }

  getPackageJsonInfo(managementClientDir) {

    // algorithm:
    // package.json is placed next to the lib directory. So we try to find the lib directory first.
    // In most packages we generate via autorest, the management client directly lives in the lib directory
    // so, package.json could be found just one level above where management client lives.
    // In some packages (azure-arm-resource), management client lives at one level deeper in the lib directory
    // so, we have to traverse at least two levels higher to locate package.json.
    // The algorithm for locating package.json would then be, start at the current directory where management client lives
    // and keep searching up until the file is located. We also limit the search depth to 2, since we know the structure of 
    // the clients we generate.

    let packageJsonInfo = {
      name: 'NO_NAME',
      version: '0.0.0'
    };

    // private helper
    function _getLibPath(currentDir, searchDepth) {
      if (searchDepth < 1) {
        return;
      }

      // if current directory is lib, return current dir, otherwise search one level up.
      return (currentDir.endsWith('lib') || currentDir.endsWith('lib' + path.sep)) ?
        currentDir :
        _getLibPath(path.join(currentDir, '..'), searchDepth - 1);
    }

    let libPath = _getLibPath(managementClientDir, 2);
    if (libPath) {
      let packageJsonPath = path.join(libPath, '..', 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        let data = require(packageJsonPath);
        packageJsonInfo.name = data.name;
        packageJsonInfo.version = data.version;
      }
    }

    return packageJsonInfo;
  }

}

module.exports = ResourceManagementClient;
