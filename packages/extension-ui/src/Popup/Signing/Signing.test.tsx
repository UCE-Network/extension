// Copyright 2019-2020 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import '../../../../../__mocks__/chrome';

import type { SigningRequest } from '@polkadot/extension-base/background/types';

import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount, ReactWrapper } from 'enzyme';
import { EventEmitter } from 'events';
import React, { useState } from 'react';
import { act } from 'react-dom/test-utils';
import { ThemeProvider } from 'styled-components';

import { ActionContext, Address, Button, Input, SigningReqContext, themes } from '../../components';
import * as messaging from '../../messaging';
import { flushAllPromises } from '../../testHelpers';
import TransactionIndex from './TransactionIndex';
import Request from './Request';
import Extrinsic from './Extrinsic';
import Qr from './Qr';
import Signing from '.';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
configure({ adapter: new Adapter() });

describe('Signing requests', () => {
  let wrapper: ReactWrapper;
  let onActionStub: jest.Mock;
  let signRequests: SigningRequest[] = [];

  const emitter = new EventEmitter();

  function MockRequestsProvider (): React.ReactElement {
    const [requests, setRequests] = useState(signRequests);

    emitter.on('request', setRequests);

    return (
      <SigningReqContext.Provider value={requests}>
        <Signing />
      </SigningReqContext.Provider>
    );
  }

  const mountComponent = async (): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    wrapper = mount(
      <ActionContext.Provider value={onActionStub}>
        <ThemeProvider theme={themes.dark}>
          <MockRequestsProvider />
        </ThemeProvider>
      </ActionContext.Provider>
    );
    await act(flushAllPromises);
    wrapper.update();
  };

  beforeEach(async () => {
    jest.spyOn(messaging, 'cancelSignRequest').mockResolvedValue(true);
    jest.spyOn(messaging, 'approveSignPassword').mockResolvedValue(true);
    jest.spyOn(messaging, 'isSignLocked').mockResolvedValue({ isLocked: true, remainingTime: 0 });

    signRequests = [
      {
        account: {
          address: '5D4bqjQRPgdMBK8bNvhX4tSuCtSGZS7rZjD5XH5SoKcFeKn5',
          genesisHash: null,
          isHidden: false,
          name: 'Alice derived',
          parentAddress: '5Ggap6soAPaP5UeNaiJsgqQwdVhhNnm6ez7Ba1w9jJ62LM2Q',
          suri: '//0',
          whenCreated: 1602001346486
        },
        id: '1607347015530.2',
        request: {
          payload: {
            address: '5D4bqjQRPgdMBK8bNvhX4tSuCtSGZS7rZjD5XH5SoKcFeKn5',
            blockHash: '0x661f57d206d4fecda0408943427d4d25436518acbff543735e7569da9db6bdd7',
            blockNumber: '0x0033fa6b',
            era: '0xb502',
            genesisHash: '0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e',
            method: '0x0403c6111b239376e5e8b983dc2d2459cbb6caed64cc1d21723973d061ae0861ef690b00b04e2bde6f',
            nonce: '0x00000003',
            signedExtensions: [
              'CheckSpecVersion',
              'CheckTxVersion',
              'CheckGenesis',
              'CheckMortality',
              'CheckNonce',
              'CheckWeight',
              'ChargeTransactionPayment'
            ],
            specVersion: '0x0000002d',
            tip: '0x00000000000000000000000000000000',
            transactionVersion: '0x00000003',
            version: 4
          },
          sign: jest.fn()
        },
        url: 'https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwestend-rpc.polkadot.io#/accounts'
      },
      {
        account: {
          address: '5E9nq1yGJJFiP8C75ryD9J2R62q2cesz6NumLnuXRgmuN5DG',
          genesisHash: null,
          isHidden: false,
          name: 'Alice derived',
          parentAddress: '5Ggap6soAPaP5UeNaiJsgqQwdVhhNnm6ez7Ba1w9jJ62LM2Q',
          suri: '//0',
          whenCreated: 1602001346486
        },
        id: '1607356155395.3',
        request: {
          payload: {
            address: '5E9nq1yGJJFiP8C75ryD9J2R62q2cesz6NumLnuXRgmuN5DG',
            blockHash: '0xa541b33cbe0c1c9a80edf91c3be1c87be14050634e7daff85cb9b8dd29f0a3ec',
            blockNumber: '0x0034005f',
            era: '0xf501',
            genesisHash: '0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e',
            method: '0x0403c6111b239376e5e8b983dc2d2459cbb6caed64cc1d21723973d061ae0861ef690b00b04e2bde6f',
            nonce: '0x00000003',
            signedExtensions: [
              'CheckSpecVersion',
              'CheckTxVersion',
              'CheckGenesis',
              'CheckMortality',
              'CheckNonce',
              'CheckWeight',
              'ChargeTransactionPayment'
            ],
            specVersion: '0x0000002d',
            tip: '0x00000000000000000000000000000000',
            transactionVersion: '0x00000003',
            version: 4
          },
          sign: jest.fn()
        },
        url: 'https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwestend-rpc.polkadot.io#/accounts'
      }
    ];
    onActionStub = jest.fn();
    await mountComponent();
  });

  // beforeEach(async () => {
  //   jest.spyOn(messaging, 'cancelSignRequest').mockResolvedValue(true);
  //   jest.spyOn(messaging, 'approveSignPassword').mockResolvedValue(true);
  //   signRequests = [{ // 0.031415926500000 DOT -> 5D4bqjQRPgdMBK8bNvhX4tSuCtSGZS7rZjD5XH5SoKcFeKn5
  //     account: {
  //       address: '5D4bqjQRPgdMBK8bNvhX4tSuCtSGZS7rZjD5XH5SoKcFeKn5',
  //       genesisHash: null,
  //       isHidden: false,
  //       name: 'acc1',
  //       parentAddress: '5Ggap6soAPaP5UeNaiJsgqQwdVhhNnm6ez7Ba1w9jJ62LM2Q',
  //       suri: '//0',
  //       whenCreated: 1602001346486
  //     },
  //     id: '1574174715509.78',
  //     request: {
  //       payload: {
  //         address: '5D4bqjQRPgdMBK8bNvhX4tSuCtSGZS7rZjD5XH5SoKcFeKn5',
  //         blockHash: '0xc288fbc472dab27d13ce58212eeb1243f460c5b0f9a65e9de97cbbf9bc761cb0',
  //         blockNumber: '0x00000000003d8c4a',
  //         era: '0xa500',
  //         genesisHash: '0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e',
  //         method: '0x0403c6111b239376e5e8b983dc2d2459cbb6caed64cc1d21723973d061ae0861ef690b00b04e2bde6f',
  //         nonce: '0x0000000000000000',
  //         signedExtensions: [],
  //         specVersion: '0x0000002d',
  //         tip: '0x00000000000000000000000000000000',
  //         transactionVersion: '0x00000003',
  //         version: 4
  //       },
  //       sign: jest.fn()
  //     },
  //     url: 'polkadot.js'
  //   }, { // 10000000000 nDOT -> 5D1ss3KFnzNtLzRDfUhqLivzVvt5BDrBnK21dMf1si2twPuj
  //     account: {
  //       address: '5E9nq1yGJJFiP8C75ryD9J2R62q2cesz6NumLnuXRgmuN5DG',
  //       genesisHash: null,
  //       isHidden: false,
  //       name: 'acc2',
  //       whenCreated: 1602001346486
  //     },
  //     id: '1574174306604.76',
  //     request: {
  //       payload: {
  //         address: '5E9nq1yGJJFiP8C75ryD9J2R62q2cesz6NumLnuXRgmuN5DG',
  //         blockHash: '0xf3b92cf71c84762ba1cb59dc4fd192f1824171a96b43bce44ceb0671b378d15a',
  //         blockNumber: '0x00000000003d8e9d',
  //         era: '0xd501',
  //         genesisHash: '0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e',
  //         method: '0x0403c6111b239376e5e8b983dc2d2459cbb6caed64cc1d21723973d061ae0861ef690b00b04e2bde6f',
  //         nonce: '0x0000000000000000',
  //         signedExtensions: [],
  //         specVersion: '0x0000002d',
  //         tip: '0x00000000000000000000000000000000',
  //         transactionVersion: '0x00000003',
  //         version: 4
  //       },
  //       sign: jest.fn()
  //     },
  //     url: 'polkadot.js'
  //   }];
  //   onActionStub = jest.fn();
  //   await mountComponent();
  // });

  describe('Switching between requests', () => {
    it('initially first request should be shown', () => {
      expect(wrapper.find(TransactionIndex).text()).toBe('1/2');
      expect(wrapper.find(Request).prop('signId')).toBe(signRequests[0].id);
    });

    it('only the right arrow should be active on first screen', () => {
      expect(wrapper.find('FontAwesomeIcon.arrowLeft')).toHaveLength(1);
      expect(wrapper.find('FontAwesomeIcon.arrowLeft.active')).toHaveLength(0);
      expect(wrapper.find('FontAwesomeIcon.arrowRight.active')).toHaveLength(1);
      wrapper.find('FontAwesomeIcon.arrowLeft').simulate('click');
      expect(wrapper.find(TransactionIndex).text()).toBe('1/2');
    });

    it('should display second request after clicking right arrow', () => {
      wrapper.find('FontAwesomeIcon.arrowRight').simulate('click');
      expect(wrapper.find(TransactionIndex).text()).toBe('2/2');
      expect(wrapper.find(Request).prop('signId')).toBe(signRequests[1].id);
    });

    it('only the left should be active on second screen', () => {
      wrapper.find('FontAwesomeIcon.arrowRight').simulate('click');
      expect(wrapper.find('FontAwesomeIcon.arrowLeft.active')).toHaveLength(1);
      expect(wrapper.find('FontAwesomeIcon.arrowRight')).toHaveLength(1);
      expect(wrapper.find('FontAwesomeIcon.arrowRight.active')).toHaveLength(0);
      expect(wrapper.find(TransactionIndex).text()).toBe('2/2');
    });

    it('should display previous request after the left arrow has been clicked', () => {
      wrapper.find('FontAwesomeIcon.arrowRight').simulate('click');
      wrapper.find('FontAwesomeIcon.arrowLeft').simulate('click');
      expect(wrapper.find(TransactionIndex).text()).toBe('1/2');
      expect(wrapper.find(Request).prop('signId')).toBe(signRequests[0].id);
    });
  });

  describe('External account', () => {
    it('shows Qr scanner for external accounts', async () => {
      signRequests = [{
        account: {
          address: '5Cf1CGZas62RWwce3d2EPqUvSoi1txaXKd9M5w9bEFSsQtRe',
          isExternal: true,
          name: 'external'
        },
        id: '1574174306604.76',
        request: {
          payload: {
            address: '5Cf1CGZas62RWwce3d2EPqUvSoi1txaXKd9M5w9bEFSsQtRe',
            blockHash: '0xf3b92cf71c84762ba1cb59dc4fd192f1824171a96b43bce44ceb0671b378d15a',
            blockNumber: '0x00000000003d8e9d',
            era: '0xd501',
            genesisHash: '0xdcd1346701ca8396496e52aa2785b1748deb6db09551b72159dcb3e08991025b',
            method: '0x0300ff2a142e8c67a1ddcf6241f4fabf55a0bb0ee41d8a681ab3b3662a75037025967c0700e40b5402',
            nonce: '0x0000000000000000',
            signedExtensions: [],
            specVersion: '0x00000070',
            tip: '0x00000000000000000000000000000000',
            transactionVersion: '0x00000000',
            version: 1
          },
          sign: jest.fn()
        },
        url: 'polkadot.js'
      }];
      await mountComponent();
      expect(wrapper.find(Extrinsic)).toHaveLength(0);
      expect(wrapper.find(Qr)).toHaveLength(1);
    });
  });

  describe('Request rendering', () => {
    it('correctly displays request 1', () => {
      expect(wrapper.find(Address).find('FullAddress').text()).toBe('5D4bqjQRPgdMBK8bNvhX4tSuCtSGZS7rZjD5XH5SoKcFeKn5');
      expect(wrapper.find(Extrinsic).find('td.data').map((el): string => el.text())).toEqual([
        'polkadot.js',
        'Alexander',
        '112',
        '0',
        'balances.transfer',
        `{
  "dest": "5D4bqjQRPgdMBK8bNvhX4tSuCtSGZS7rZjD5XH5SoKcFeKn5",
  "value": 31415926500000
}`,
        ' Transfer some liquid free balance to another account.   `transfer` will set the `FreeBalance` of the sender and receiver.  It will decrease the total issuance of the system by the `TransferFee`.  If the sender\'s account is below the existential deposit as a result  of the transfer, the account will be reaped.   The dispatch origin for this call must be `Signed` by the transactor.',
        'mortal, valid from #4,033,610 to #4,033,674'
      ]);
    });

    it('correctly displays request 2', () => {
      wrapper.find('FontAwesomeIcon.arrowRight').simulate('click');
      expect(wrapper.find(Address).find('FullAddress').text()).toBe('5E9nq1yGJJFiP8C75ryD9J2R62q2cesz6NumLnuXRgmuN5DG');
      expect(wrapper.find(Extrinsic).find('td.data').at(5).text()).toBe(`{
  "dest": "5D1ss3KFnzNtLzRDfUhqLivzVvt5BDrBnK21dMf1si2twPuj",
  "value": 10000000000
}`);
    });
  });

  describe('Submitting', () => {
    it('passes request id to cancel call', () => {
      wrapper.find('CancelButton').find('a').simulate('click');
      expect(messaging.cancelSignRequest).toBeCalledWith(signRequests[0].id);
    });

    it('passes request id and password to approve call', () => {
      wrapper.find(Input).simulate('change', { target: { value: 'hunter1' } });
      wrapper.find(Button).find('button').simulate('click');
      expect(messaging.approveSignPassword).toBeCalledWith(signRequests[0].id, 'hunter1');
    });

    it('shows an error when the password is wrong', () => {
      jest.spyOn(messaging, 'approveSignPassword').mockImplementation(() => {
        throw new Error();
      });
      // await act(flushAllPromises);
      // wrapper.update();
      wrapper.find(Input).simulate('change', { target: { value: 'anything' } });
      wrapper.find(Button).find('button').simulate('click');
      expect(wrapper.find('.warning-message').first().text()).toBe('Unable to decode using the supplied passphrase');
    });

    it('when last request has been removed/cancelled, shows the previous one', () => {
      wrapper.find('ArrowRight').simulate('click');
      act(() => {
        emitter.emit('request', [signRequests[0]]);
      });
      wrapper.update();
      expect(wrapper.find(TransactionIndex)).toHaveLength(0);
      expect(wrapper.find(Request).prop('signId')).toBe(signRequests[0].id);
    });
  });
});
