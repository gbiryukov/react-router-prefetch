import React, { Component } from 'react';
import { connect } from 'react-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';

import { createSagaPrefetch } from '../../src';
import types from '../types';

class Page3 extends Component {
  static prefetch() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(1);
      }, 1000);
    });
  }

  static loadingBarPrefetch(props) {
    return new Promise((resolve) => {
      props.dispatch(showLoading());

      setTimeout(() => {
        props.dispatch(hideLoading());

        resolve(props);
      }, 1000);
    });
  }

  static sagaPrefetch = props => createSagaPrefetch(
    props,
    types.DATA_REQUEST,
    'page2',
  )

  render() {
    return (<h2>Component with delay 1s</h2>);
  }
}

export const Page3Connected = connect()(Page3);

export default Page3;
