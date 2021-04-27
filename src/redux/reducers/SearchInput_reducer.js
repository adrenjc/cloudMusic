const initState = { data: null };

const searchInput = (pre = initState, action) => {
  const { type, data } = action;
  switch (type) {
    case 'setInput':
      return Object.assign({}, pre, { data });

    default:
      return pre;
  }
};

export default searchInput;
