import React, {createContext, useState, useEffect, useContext} from 'react';
import auth from '@react-native-firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(firebaseUser => {
      setUser(firebaseUser);
      setIsAuthenticated(!!firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  /**
   * Sign in with email and password
   */
  const signIn = async (email, password) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      return {success: true, user: userCredential.user};
    } catch (error) {
      let errorMessage = 'Error al iniciar sesión';
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'El correo electrónico no es válido';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Esta cuenta ha sido deshabilitada';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No existe una cuenta con este correo';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Contraseña incorrecta';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Credenciales inválidas';
          break;
        default:
          errorMessage = error.message;
      }
      return {success: false, error: errorMessage};
    }
  };

  /**
   * Register with email and password
   */
  const signUp = async (email, password) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      return {success: true, user: userCredential.user};
    } catch (error) {
      let errorMessage = 'Error al registrarse';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Ya existe una cuenta con este correo';
          break;
        case 'auth/invalid-email':
          errorMessage = 'El correo electrónico no es válido';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'El registro con correo no está habilitado';
          break;
        case 'auth/weak-password':
          errorMessage = 'La contraseña es muy débil (mínimo 6 caracteres)';
          break;
        default:
          errorMessage = error.message;
      }
      return {success: false, error: errorMessage};
    }
  };

  /**
   * Sign out
   */
  const signOut = async () => {
    try {
      await auth().signOut();
      return {success: true};
    } catch (error) {
      return {success: false, error: error.message};
    }
  };

  /**
   * Send password reset email
   */
  const resetPassword = async email => {
    try {
      await auth().sendPasswordResetEmail(email);
      return {success: true};
    } catch (error) {
      let errorMessage = 'Error al enviar el correo';
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'El correo electrónico no es válido';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No existe una cuenta con este correo';
          break;
        default:
          errorMessage = error.message;
      }
      return {success: false, error: errorMessage};
    }
  };

  /**
   * Send email verification
   */
  const sendEmailVerification = async () => {
    try {
      if (user) {
        await user.sendEmailVerification();
        return {success: true};
      }
      return {success: false, error: 'No hay usuario autenticado'};
    } catch (error) {
      return {success: false, error: error.message};
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    resetPassword,
    sendEmailVerification,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
