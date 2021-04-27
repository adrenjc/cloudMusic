import React, { Component } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
// import StorageUtils from '../utils/storageUtils.js';
// import memoryUtils from '../utils/memoryUtils.js';
import '../api/index';
import PubSub from 'pubsub-js';
import './index.css';
import { reqLogin, logOut } from '../api/index';
import memoryUtils from '../utils/memoryUtils';
import storageUtils from '../utils/storageUtils';
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
    // const { history } = this.props;

    const { phone, password } = values;
    // var getTimestamp = new Date().getTime();

    const response = await reqLogin(phone, password);

    const result = response.data;
    console.log(result);
    // if (result.account.status === 0) {
    //   if (result.code === 200) {
    //     message.success('登陆成功');
    //     // // console.log(result);
    //     // // this.getUserMemory();

    //     // // StorageUtils.saveUser(result.cookie);

    //     history.replace('/App');
    //   } else if (result.code === 502) {
    //     message.error('账号或密码错误');
    //   }

    //   console.log(result);
    // } else {
    //   message.error(result.message);
    // }
    if (result.code === 200) {
      message.success('登陆成功');
      memoryUtils.user = result;
      storageUtils.saveUser(result);
      this.log(result);
      //     // // console.log(result);
      //     // // this.getUserMemory();

      // history.replace('/App');
    } else if (result.code === 502) {
      message.error('用户名或密码错误');
      logOut();
    }
  };

  // getUserMemory = async () => {
  //   const value = await loginStatus();
  //   // const data = value && value.data.data;
  //   memoryUtils.user = value;
  //   StorageUtils.saveUser(value);
  //   this.setState({ redirect: true });
  // };
  log = (data) => {
    PubSub.publish('state', false);
    PubSub.publish('userData', data);
  };

  render() {
    // if (this.state.redirect) {
    //   return <Redirect to="/App"></Redirect>;
    // }
    return (
      <div className="login">
        <div className="login-frame">
          <div className="return" onClick={this.log}>
            ✖️
          </div>

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
