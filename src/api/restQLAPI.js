// This makes requests to restQL manager API
const request = require('superagent');


// Processing URL Query Params (Browser) for dev
export function getRuntimeTarget() {
    const url = require('url');
    const url_parts = url.parse(window.location.href, true);
    const url_query = url_parts.query;

    if(url_query.targetRuntime) {
        const targetRuntime = (
            url_query.targetRuntime.indexOf('http://') === -1 ?
            'http://' + url_query.targetRuntime :
            url_query.targetRuntime
        );

        return targetRuntime;
    }

    return '';
}


// Processing request
export function processResult(response) {
    return JSON.parse(response.body.text);
}


// Tenant operations
export function loadTenants(callback){
    const loadTenantsUrl = getRuntimeTarget() + '/tenants';

    request
        .get(loadTenantsUrl)
        .set('Content-Type', 'text/plain')
        .set('Accept', 'application/json')
        .end((err,body)=>{
            return callback({
                error: err,
                body: body
            });
        });
}

export function loadResourcesFromTenant(tenant, callback){
    const loadTenantResourcesUrl = getRuntimeTarget() + '/resources/' + tenant;

    request
        .get(loadTenantResourcesUrl)
        .set('Content-Type', 'text/plain')
        .set('Accept', 'application/json')
        .end((err,body)=>{
            return callback({
                error: err,
                body: (body.text !== undefined ? JSON.parse(body.text) : body)
            });
        });
}

export function updateResource(authorizationKey, tenant, resource, callback) {
    const updateTenantResourceUrl = getRuntimeTarget()
                                    + '/resources/' + tenant
                                    + '/update';

    const requestBody = {...resource, 'authorization-key': authorizationKey };

    request
        .post(updateTenantResourceUrl)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(requestBody)
        .end((err,body)=>{
            return callback({
                error: err,
                body: body
            })
        });
}


// Running Queries
export function runQuery(queryString, queryParams='', tenant=null, callback) {
    const runQueryUrl = getRuntimeTarget() + '/run-query?'
                        + queryParams
                        + (tenant ? '&tenant='+tenant: '');

    request
        .post(runQueryUrl)
        .set('Content-Type', 'text/plain')
        .set('Accept', 'application/json')
        .send(queryString)
        .end((err, body) => {
            return callback({
                error: err,
                body: body
            });
        });
}

// Saving a query
export function saveQuery(tenant, namespace, queryName, queryString, callback) {
    const saveQueryUrl = getRuntimeTarget()
                         + '/ns/' + namespace
                         + '/query/' + queryName
                         + (tenant ? '?tenant=' + tenant : '');

    request
        .post(saveQueryUrl)
        .set('Content-Type', 'text/plain')
        .set('Accept', 'application/json')
        .send(queryString)
        .end((err, body) => {
            return callback({
                error: err,
                body: body
            });
        });
}

// Loading namespaces
export function loadNamespaces(callback) {
    const loadNamespacesUrl = getRuntimeTarget() + '/namespaces';

    request
        .get(loadNamespacesUrl)
        .set('Content-Type', 'text/plain')
        .set('Accept', 'application/json')
        .send()
        .end((err, body) => {
            return callback({
                error: err,
                body: body
            });
        });
}


// Loading Queries
export function loadQueries(namespace, callback) {
    const loadQueriesUrl = getRuntimeTarget() + '/ns/' + namespace;

    request
        .get(loadQueriesUrl)
        .set('Content-Type', 'text/plain')
        .set('Accept', 'application/json')
        .send()
        .end((err, body) => {
            return callback({
                error: err,
                body: body
            });
        });
}

// Loading all query revisions
export function loadRevisions(namespace, query, callback) {

    const revisionsUrl = getRuntimeTarget() + '/ns/' + namespace + '/query/' + query;

    request
        .get(revisionsUrl)
        .set('Content-Type', 'text/plain')
        .set('Accept', 'application/json')
        .send()
        .end((err, body) => {
            return callback({
                error: err,
                body: body
            });
        });
}


// Loading a query revision
export function loadRevisionByUrl(revisionUrl, callback) {

    request
        .get(getRuntimeTarget()+revisionUrl)
        .set('Content-Type', 'text/plain')
        .set('Accept', 'application/json')
        .send()
        .end((err, body) => {
            return callback({
                error: err,
                body: body
            });
        });
}

// Loading a query revision
export function loadRevision(namespace, queryName, revision, callback) {

    const revisionUrl = getRuntimeTarget()
                        + '/ns/' + namespace
                        + '/query/' + queryName
                        + '/revision/' + revision;

    request
        .get(revisionUrl)
        .set('Content-Type', 'text/plain')
        .set('Accept', 'application/json')
        .send()
        .end((err, body) => {
            return callback({
                error: err,
                body: body
            });
        });
}
