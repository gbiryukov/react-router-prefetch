# react-router-prefetch

[![Build Status](https://travis-ci.org/LastDreamer/react-router-prefetch.svg?branch=master)](https://travis-ci.org/LastDreamer/react-router-prefetch)
[![dependencies Status](https://david-dm.org/lastdreamer/react-router-prefetch/status.svg)](https://david-dm.org/lastdreamer/react-router-prefetch)
[![Coverage Status](https://coveralls.io/repos/github/LastDreamer/react-router-prefetch/badge.svg?branch=master)](https://coveralls.io/github/LastDreamer/react-router-prefetch?branch=master)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=react-router-prefetch&metric=alert_status)](https://sonarcloud.io/dashboard?id=react-router-prefetch)

Load data for components before router transition. 

## [Live Demo Here](https://lastdreamer.github.io/react-router-prefetch/index.html)

## Installation
```shell
npm i --save react-router-prefetch
```

## Usage

For prefetching enable you need only 2 steps:

1. Add static method prefetch to your component that returns a Promise

```jsx
// component.jsx
import React, ( Component ) from 'react';

let asyncData = {};

class MyComponent extends Component {
  static prefetch(props) {
    return new Promise((resolve) => {
      fetch(`/data/${props.id}`)
        .then(data => {
          asyncData = data;
          resolve();
        });
    });
  }
  
  render() {
    const { foo, bar } = asyncData;
    ...
  }
}
```

2. Wrap Router childs in a component Prefetch from this package

```jsx

export default MyComponent;

// routes.jsx
import { BrowserRouter as Router } from 'react-router';
import Prefetch from 'react-router-prefetch';
import Routes from '...';

const App = (history) => (
  <Router history={history}>
    <Prefetch
      onError={message => window.alert(message)}
    >
      <Routes />
    </Prefetch>
  </Router>
)

export default App;
```

## Handle prefetch in redux saga

1. Same as previous example, but prefetch method should be created by `createSagaPrefetch`

```jsx
// component.jsx
import React, ( Component ) from 'react';
import { createSagaPrefetch } from 'react-router-prefetch';
import { connect } from 'react-redux';

class MyComponent extends Component {
  static prefetch = props => createSagaPrefetch({
    props,
    'ACTION_TYPE',
    // payload
    {
      key: props.id,
    },
  })
  
  render() {
    ...
  }
}

export default connect()(MyComponent);
```

2. Add handler into your saga

```js
// sagas.js
import { call, put } from 'redux-saga/effects';

import api from './api';
import types from './types';

function* fetchData({ payload, resolve, reject }) {
  try {
    const data = yield call(api, payload);

    yield put({
      type: types.DATA_SUCCESS,
      payload: data,
    });

    resolve();
  } catch (e) {
    yield put({
      type: types.DATA_FAILURE,
      payload: e,
    });

    reject(e);
  }
}

```

## createSagaPrefetch Properties

| # | Name    | Description                                                         |
|---|---------|---------------------------------------------------------------------|
| 1 | props   | Properties of Component - it used for get and call dispatch from it |
| 2 | type    | action.type that would be passed to dispatch                        |
| 3 | payload | action.payload that would be passed to dispatch                     |

## Prefetch Properties

| Name           | Type     | Required | Default                    | Description                                                      |
|----------------|----------|----------|----------------------------|------------------------------------------------------------------|
| initialHide    | `bool`   |          | true                       | Hide children on initial transition                              |
| errorMessage   | `string` |          | 'Error while page loading' | Message for Promise rejecting callback                           |
| prefetchMethod | `string` |          | 'prefetch'                 | Name of method that Prefetch will recursively search in children |
| preloader      | `node`   |          | 'Loading...'               | String or Component displays while fetching                      |
| onError        | `func`   | +        |                            | Promise reject callback                                          |
| onFetchStart   | `func`   |          |                            | Callback before prefetch                                         |
| onFetchEnd     | `func`   |          |                            | Callback after prefetch or reject                                |

