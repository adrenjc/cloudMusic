const initialState = { data: false };

const loginState = (pre = initialState, action) => {
  const { type, data } = action;
  switch (type) {
    case 'setLoginState':
      return Object.assign({}, pre, { data });

    default:
      return pre;
  }
};

export default loginState;
