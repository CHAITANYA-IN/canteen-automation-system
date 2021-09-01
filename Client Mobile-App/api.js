import AsyncStorage from '@react-native-async-storage/async-storage';
import CookieManager from 'react-native-cookies';
const setcookie = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log('Storage Error');
  }
};

const componentDidMount = async (username, password) => {
  const e = await fetch('http://10.0.2.2:3000/auth/login', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  }).then(
    (response) => response,
    (err) => {
      return Promise.resolve(err);
    },
  );

  CookieManager.get('http://10.0.2.2:3000/auth/login').then(async (res) => {
    console.log('CookieManager.get =>', res); // => 'user_session=abcdefg; path=/;'
    setcookie('cookie', JSON.stringify(res));
  });
  AsyncStorage.getItem('cookie').then((retrieve) => {
    console.log('Retrieve=', retrieve);
  });

  // .then(
  //   (json) => {
  //     return json;
  //   },
  //   (err) => {
  //     return Promise.resolve(err);
  //   },
  // );

  console.log('Username and Password=', e);
  const body = await e.json().then(
    (jsonbody) => jsonbody,
    (err) => Promise.resolve(err),
  );
  console.log('Body=', body);
  return body;
};
const componentfetch = () => {
  AsyncStorage.getItem('cookie').then((retrieve) => {
    fetch('http://10.0.2.2:3000/menu', {
      method: 'GET',
      headers: {
        Cookie: retrieve,
      },
      // body: JSON.stringify({
      // username:1,
      // password:"ams",
      // })
    })
      .then(
        (items) => {
          return items.json();
        },
        (err) => {
          throw err;
        },
      )
      .then(
        (json) => {
          return json;
        },
        (err) => {
          return Promise.resolve(err);
        },
      );
  });
};
const componentuser = async () => {
  let retrievecookie = await AsyncStorage.getItem('cookie').then(
    (retrieve) => retrieve,
  );
  console.log('Retrievecookie=', retrievecookie);
  let d = await fetch('http://10.0.2.2:3000/users/details', {
    method: 'GET',
    headers: {
      Cookie: retrievecookie,
    },
    // body: JSON.stringify({
    // username:1,
    // password:"ams",
    // })
  })
    .then(
      (items) => {
        return items.json();
      },
      (err) => {
        throw err;
      },
    )
    .then(
      (json) => {
        return json;
      },
      (err) => {
        return Promise.resolve(err);
      },
    );

  console.log('d=', d);
  return d;
};

module.exports = {componentDidMount, componentfetch, componentuser};
