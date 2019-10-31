import {Button, Input} from 'antd';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import react, {Component, ReactNode} from 'react';

import {testEmailApi} from '../../../request';
import {Email} from '../../../types';
import {IChangeEmail} from '../type';

export default class ChangeEmail extends Component {}
