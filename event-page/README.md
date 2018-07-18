# vue-loader-pwa

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


## Config

Include the following config in a file called `auth0.js` in the folder `/src/store/config/auth0.js`:

```js
export default {
  domain: '<AUTH0_DOMAIN>',
  clientID: '<AUTH0_CLIENT_ID>',
  redirectUri: '<AUTH0_CLIENT_ID>',
  audience: '<AUTH0_CLIENT_AUDIENCE>',
  responseType: '<AUTH0_CLIENT_RESPONSE_TYPE>'
}
```

## Best practice

- The state for each page should be handled separately - don't share states between pages


## Changelog

### Version 1.0.3
- add autocomplete feature
- simplify event interface

### Version 1.0.2
- fix relative link issue in admin
- remove link to admin page
- fix spacing issue in home page events link

### Version 1.0.1
- fix photo service delete preview causing all previews to be deleted
- add userinfo for header, display photo and nickname
- add filter and also search feature in admin page

### Version 1.0.0
- Stable release

### Version 0.0.6

- breaking api changes, uses new grpc endpoint
- includes photo-service
- mongodb requires authentication
- using docker multi-stage build with smaller image (compared to )

### Version 0.0.5
- Update favicon
- Update responsive PWA naming

### Version 0.0.4:
- Add tag cloud filters
- Fix responsive mobile
