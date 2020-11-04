import firebase from 'firebase/app'
import { User } from "../models/User"
import { atom, useRecoilState } from "recoil"
import { useEffect } from 'react'

const userState = atom<User>({
  key: "user",
  default: null
})

export function useAuthentication() {
  const [user, setUser] = useRecoilState(userState)
  useEffect(() => {
    if (user !== null) {
      return
    }

    firebase.auth().signInAnonymously().catch((error) => {
      console.log("error has happened", error)
    })

    firebase.auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        const loginUser: User = {
          uid:firebaseUser.uid,
          isAnonymous: firebaseUser.isAnonymous,
          name: ''
        }
        setUser(loginUser)
        createUserIfNotFound(loginUser)
      }
      else {
        setUser(null)
      }
    })
  }, [])

  return { user }
}

async function createUserIfNotFound(user: User) {
  const userRef = firebase.firestore().collection('users').doc(user.uid)
  const doc = await userRef.get()
  if (doc.exists) {
    return
  }
  await userRef.set({
    name: "taro" + new Date().getTime(),
  })
}
/*
function authenticate() {
  firebase
    .auth()
    .signInAnonymously()
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code
      var errorMessage = error.message
      // ...
    })

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log(user.uid)
      console.log(user.isAnonymous)
    } else {
      // User is signed out.
      // ...
    }
    // ...
  })
}
 */