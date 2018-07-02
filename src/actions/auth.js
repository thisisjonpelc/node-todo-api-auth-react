//import { firebase, googleAuthProvider } from '../firebase/firebase';

export const login = (token) => ({
  type: 'LOGIN',
  token
});

// export const startLogin = () => {
//   return () => {

//   }

//   return () => {
//     return firebase.auth().signInWithPopup(googleAuthProvider);
//   };
// };

export const logout = () => ({
  type: 'LOGOUT'
});

export const startLogout = () => {
  return () => {
    return firebase.auth().signOut();
  };
};
