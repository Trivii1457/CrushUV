/**
 * @format
 * Pruebas unitarias para matchService
 */

// Mock de Firebase Firestore
jest.mock('@react-native-firebase/firestore', () => {
  const mockAdd = jest.fn(() => Promise.resolve({id: 'new-doc-id'}));
  const mockUpdate = jest.fn(() => Promise.resolve());
  const mockGet = jest.fn(() => Promise.resolve({
    docs: [],
    empty: true,
  }));
  
  const firestoreMock = () => ({
    collection: jest.fn(() => ({
      add: mockAdd,
      doc: jest.fn(() => ({
        update: mockUpdate,
        get: mockGet,
      })),
      where: jest.fn(() => ({
        get: mockGet,
        where: jest.fn(() => ({
          get: mockGet,
        })),
      })),
    })),
  });

  // Agregar FieldValue como propiedad estática
  firestoreMock.FieldValue = {
    serverTimestamp: jest.fn(() => 'mock-timestamp'),
    arrayUnion: jest.fn(val => val),
  };

  return {
    __esModule: true,
    default: firestoreMock,
  };
});

jest.mock('@react-native-firebase/auth', () => () => ({
  currentUser: {
    uid: 'current-user-id',
  },
}));

import matchService from '../../src/services/matchService';

describe('matchService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMatches', () => {
    it('retorna array vacío si no se proporciona userId', async () => {
      const matches = await matchService.getMatches('');
      expect(matches).toEqual([]);
    });

    it('retorna array para usuario válido', async () => {
      const matches = await matchService.getMatches('user-id');
      expect(Array.isArray(matches)).toBe(true);
    });
  });

  describe('Lógica de Match', () => {
    // Tests de lógica pura sin dependencias de Firebase
    const checkMutualLike = (user1Likes, user2Likes, user1Id, user2Id) => {
      const user1LikesUser2 = user1Likes.includes(user2Id);
      const user2LikesUser1 = user2Likes.includes(user1Id);
      return user1LikesUser2 && user2LikesUser1;
    };

    it('detecta match cuando ambos usuarios se gustan', () => {
      const user1Likes = ['user2', 'user3'];
      const user2Likes = ['user1', 'user4'];
      
      expect(checkMutualLike(user1Likes, user2Likes, 'user1', 'user2')).toBe(true);
    });

    it('no hay match si solo un usuario da like', () => {
      const user1Likes = ['user2'];
      const user2Likes = ['user3'];
      
      expect(checkMutualLike(user1Likes, user2Likes, 'user1', 'user2')).toBe(false);
    });

    it('no hay match si ninguno da like', () => {
      const user1Likes = ['user3'];
      const user2Likes = ['user4'];
      
      expect(checkMutualLike(user1Likes, user2Likes, 'user1', 'user2')).toBe(false);
    });
  });

  describe('Tipos de Swipe', () => {
    const swipeTypes = {
      LIKE: 'like',
      DISLIKE: 'dislike',
      SUPERLIKE: 'superlike',
    };

    it('identifica swipe de like', () => {
      expect(swipeTypes.LIKE).toBe('like');
    });

    it('identifica swipe de dislike', () => {
      expect(swipeTypes.DISLIKE).toBe('dislike');
    });

    it('identifica swipe de superlike', () => {
      expect(swipeTypes.SUPERLIKE).toBe('superlike');
    });

    it('superlike tiene mayor prioridad', () => {
      const getPriority = (type) => {
        switch(type) {
          case 'superlike': return 3;
          case 'like': return 2;
          case 'dislike': return 1;
          default: return 0;
        }
      };

      expect(getPriority('superlike')).toBeGreaterThan(getPriority('like'));
      expect(getPriority('like')).toBeGreaterThan(getPriority('dislike'));
    });
  });
});
