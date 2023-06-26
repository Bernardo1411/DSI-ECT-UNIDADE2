const backendAccess = async (userName, password, endpoint) => {
  try {
    const response = await fetch(`http://localhost:3000/${endpoint}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName,
        password,
      }),
    });
  
    if (!response.ok) {
      const errorRes = await response.json();
      const { message } = errorRes;
      throw new Error(message);
    }

    const res = await response.json();
    const { message, user, login } = res;

    return { message, user, login, status: response.status };
  } catch (err) {

    return { message: err.message, status: 500 };
  }
};

export const postLoginUser = async (userName, password) => {
  return await backendAccess(userName, password, 'login');
}

export const postSignUpUser = async (userName, password) => {
  return await backendAccess(userName, password, 'newAccount');
}

export const postRemoveUser = async (userName) => {
  try {
    const response = await fetch(`http://localhost:3000/removeUser`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName,
      }),
    });
  
    if (!response.ok) {
      const errorRes = await response.json();
      const { message } = errorRes;
      throw new Error(message);
    }

    const res = await response.json();
    const { message, remove } = res;

    return { message, remove, status: response.status };
  } catch (err) {

    return { message: err.message, status: 500 };
  }
}
