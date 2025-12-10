/**
 * @format
 * Pruebas unitarias para userService
 */

// Mock de Firebase Firestore
jest.mock('@react-native-firebase/firestore', () => {
  const mockSet = jest.fn(() => Promise.resolve());
  const mockUpdate = jest.fn(() => Promise.resolve());
  const mockGet = jest.fn(() => Promise.resolve({
    exists: true,
    id: 'test-user-id',
    data: () => ({
      uid: 'test-user-id',
      email: 'test@correounivalle.edu.co',
      name: 'Usuario Test',
    }),
  }));
  
  const firestoreMock = () => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        set: mockSet,
        update: mockUpdate,
        get: mockGet,
      })),
      where: jest.fn(() => ({
        get: jest.fn(() => Promise.resolve({
          docs: [],
        })),
      })),
    })),
  });

  // Agregar FieldValue como propiedad estática
  firestoreMock.FieldValue = {
    serverTimestamp: jest.fn(() => 'mock-timestamp'),
  };

  return {
    __esModule: true,
    default: firestoreMock,
  };
});

jest.mock('@react-native-firebase/auth', () => () => ({
  currentUser: {
    uid: 'test-user-id',
    email: 'test@correounivalle.edu.co',
  },
}));

import userService from '../../src/services/userService';

describe('userService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('calculateAge', () => {
    it('calcula la edad correctamente', () => {
      // Para una fecha de nacimiento hace 20 años
      const today = new Date();
      const birthYear = today.getFullYear() - 20;
      const birthDate = `01/01/${birthYear}`;
      
      const age = userService.calculateAge(birthDate);
      expect(age).toBe(20);
    });

    it('retorna null para fecha inválida', () => {
      const age = userService.calculateAge('fecha-invalida');
      expect(age).toBeNull();
    });

    it('retorna null para fecha vacía', () => {
      const age = userService.calculateAge('');
      expect(age).toBeNull();
    });

    it('retorna null para fecha undefined', () => {
      const age = userService.calculateAge(undefined);
      expect(age).toBeNull();
    });
  });

  describe('getUser', () => {
    it('retorna null para uid vacío', async () => {
      const result = await userService.getUser('');
      expect(result).toBeNull();
    });

    it('retorna null para uid undefined', async () => {
      const result = await userService.getUser(undefined);
      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('lanza error si no se proporciona uid', async () => {
      await expect(userService.updateUser('', {name: 'Test'}))
        .rejects.toThrow('User ID is required');
    });
  });

  describe('Validación de email institucional', () => {
    // Test funcional de la lógica de validación
    const validateUnivalleEmail = (email) => {
      if (!email) return {isValid: false};
      return {
        isValid: email.toLowerCase().endsWith('@correounivalle.edu.co')
      };
    };

    it('acepta correos de @correounivalle.edu.co', () => {
      expect(validateUnivalleEmail('usuario@correounivalle.edu.co').isValid).toBe(true);
    });

    it('rechaza correos de otros dominios', () => {
      expect(validateUnivalleEmail('usuario@gmail.com').isValid).toBe(false);
    });

    it('rechaza correos vacíos', () => {
      expect(validateUnivalleEmail('').isValid).toBe(false);
    });
  });
});
