const backendAccess = async (userName, value, endpoint) => {
  try {
    const response = await fetch(`http://localhost:3000/${endpoint}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName,
        value,
      }),
    });
  
    if (!response.ok) {
      const errorRes = await response.json();
      const { message } = errorRes;
      throw new Error(message);
    }

    const res = await response.json();
    const { message, user } = res;

    return { message, user, status: response.status };
  } catch (err) {

    return { message: err.message, status: 500 };
  }
};

export const getUser = async (userName) => {
  try {
    const response = await fetch(
      `http://localhost:3000/?userName=${userName}`
    );

    if (!response.ok) {
      const errorRes = await response.json();
      const { message } = errorRes;
      throw new Error(message);
    }

    const res = await response.json();
    const { message, user } = res;

    return { message, user };
  } catch (err) {
    return { message: err.message, status: 500 };
  }
};

export const postBuyCripto = async (userName, value) => {
  return await backendAccess(userName, value, 'buycripto');
};

export const postSellCripto = async (userName, value) => {
  return await backendAccess(userName, value, 'sellcripto');
};

export const postSendDolar = async (userName, value) => {
  return await backendAccess(userName, value, 'senddolar');
};

export const postWithdrawDolar = async (userName, value) => {
  return await backendAccess(userName, value, 'withdrawdolar');
};
