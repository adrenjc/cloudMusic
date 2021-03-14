import React, { Component } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
// import StorageUtils from '../utils/storageUtils.js';
// import memoryUtils from '../utils/memoryUtils.js';
import '../api/index';

import './index.css';
import { reqLogin } from '../api/index';
// import { Redirect } from 'react-router';

export default class NormalLoginForm extends Component {
  formRef = React.createRef();

  componentDidMount() {
    // if (StorageUtils.getUser()) {
    //   message.success('已经登陆过了！');
    //   this.setState({ redirect: true });
    // }
  }
  state = {
    redirect: false,
  };

  onSubmit = async (values) => {
    const { history } = this.props;

    const { phone, password } = values;
    var getTimestamp = new Date().getTime();
    console.log(getTimestamp);
    const response = await reqLogin(phone, password, getTimestamp);
    const result = response.data;
    if (result.account.status === 0) {
      message.success('登陆成功');
      // console.log(result);
      // this.getUserMemory();

      // StorageUtils.saveUser(result.cookie);

      history.replace('/App');
    } else {
      message.error(result.message);
    }
  };

  // getUserMemory = async () => {
  //   const value = await loginStatus();
  //   // const data = value && value.data.data;
  //   memoryUtils.user = value;
  //   StorageUtils.saveUser(value);
  //   this.setState({ redirect: true });
  // };

  render() {
    // if (this.state.redirect) {
    //   return <Redirect to="/App"></Redirect>;
    // }
    return (
      <div className="login">
        <div className="login-frame">
          <div className="user-name">用户登陆</div>
          <div className="input">
            <Form
              ref={this.formRef}
              name="normal_login"
              className="login-form"
              initialValues={{ remember: true }}
              onFinish={this.onSubmit}
            >
              <Form.Item
                name="phone"
                rules={[{ required: true, message: '请输入你的用户名！' }]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="手机号"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Please input your Password!' },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="密码"
                />
              </Form.Item>
              <Form.Item>
                {/* <Form.Item
                  name="remember"
                  valuePropName="checked"
                  noStyle
                ></Form.Item> */}
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  登陆
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}
