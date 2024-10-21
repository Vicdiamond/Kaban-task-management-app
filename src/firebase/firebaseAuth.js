import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth'
import { auth } from './firebaseConfig'

async function handleFirebaseCreateAccount (email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )

    return userCredential.user
  } catch (error) {
    throw new Error(error)
  }
}

async function handleFirebaseLogin (email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )

    return userCredential.user
  } catch (error) {
    throw new Error(error)
  }
}

export { handleFirebaseCreateAccount, handleFirebaseLogin }
