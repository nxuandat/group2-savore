import Cookie from 'js-cookie';

const SetCookie = (cookiename, userInfo) => {
  Cookie.set(cookiename, userInfo, {
    expires: 1, //1 day
    secure: true,
    sameSite: 'strict',
    path: '/',
  });
};
export default SetCookie;
