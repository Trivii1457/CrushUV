/**
 * @format
 * Pruebas unitarias para funciones de validación
 */

describe('Validaciones', () => {
  describe('Email de Universidad del Valle', () => {
    const validateUnivalleEmail = (email) => {
      if (!email || typeof email !== 'string') {
        return {isValid: false, error: 'Email es requerido'};
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return {isValid: false, error: 'Formato de email inválido'};
      }
      
      const isUnivalle = email.toLowerCase().endsWith('@correounivalle.edu.co');
      if (!isUnivalle) {
        return {isValid: false, error: 'Debes usar tu correo institucional de la Universidad del Valle'};
      }
      
      return {isValid: true, error: null};
    };

    it('acepta correos válidos de @correounivalle.edu.co', () => {
      expect(validateUnivalleEmail('estudiante@correounivalle.edu.co').isValid).toBe(true);
      expect(validateUnivalleEmail('profesor.apellido@correounivalle.edu.co').isValid).toBe(true);
      expect(validateUnivalleEmail('usuario123@correounivalle.edu.co').isValid).toBe(true);
    });

    it('rechaza correos de otros dominios', () => {
      expect(validateUnivalleEmail('usuario@gmail.com').isValid).toBe(false);
      expect(validateUnivalleEmail('usuario@hotmail.com').isValid).toBe(false);
      expect(validateUnivalleEmail('usuario@outlook.com').isValid).toBe(false);
      expect(validateUnivalleEmail('usuario@yahoo.com').isValid).toBe(false);
    });

    it('rechaza correos mal formados', () => {
      expect(validateUnivalleEmail('correo-sin-arroba').isValid).toBe(false);
      expect(validateUnivalleEmail('correo@').isValid).toBe(false);
      expect(validateUnivalleEmail('@dominio.com').isValid).toBe(false);
    });

    it('rechaza valores vacíos o inválidos', () => {
      expect(validateUnivalleEmail('').isValid).toBe(false);
      expect(validateUnivalleEmail(null).isValid).toBe(false);
      expect(validateUnivalleEmail(undefined).isValid).toBe(false);
    });
  });

  describe('Contraseña', () => {
    const validatePassword = (password) => {
      if (!password || typeof password !== 'string') {
        return {isValid: false, error: 'Contraseña es requerida'};
      }
      if (password.length < 6) {
        return {isValid: false, error: 'La contraseña debe tener al menos 6 caracteres'};
      }
      return {isValid: true, error: null};
    };

    it('acepta contraseñas válidas (6+ caracteres)', () => {
      expect(validatePassword('123456').isValid).toBe(true);
      expect(validatePassword('contraseña').isValid).toBe(true);
      expect(validatePassword('Password123!').isValid).toBe(true);
    });

    it('rechaza contraseñas cortas', () => {
      expect(validatePassword('12345').isValid).toBe(false);
      expect(validatePassword('abc').isValid).toBe(false);
      expect(validatePassword('1').isValid).toBe(false);
    });

    it('rechaza valores vacíos', () => {
      expect(validatePassword('').isValid).toBe(false);
      expect(validatePassword(null).isValid).toBe(false);
      expect(validatePassword(undefined).isValid).toBe(false);
    });
  });

  describe('Fecha de Nacimiento', () => {
    const validateBirthDate = (dateStr) => {
      if (!dateStr || typeof dateStr !== 'string') {
        return {isValid: false, error: 'Fecha es requerida'};
      }
      
      const parts = dateStr.split('/');
      if (parts.length !== 3) {
        return {isValid: false, error: 'Formato debe ser DD/MM/AAAA'};
      }
      
      const [day, month, year] = parts.map(Number);
      
      if (isNaN(day) || isNaN(month) || isNaN(year)) {
        return {isValid: false, error: 'Fecha inválida'};
      }
      
      if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2010) {
        return {isValid: false, error: 'Fecha fuera de rango'};
      }
      
      return {isValid: true, error: null};
    };

    it('acepta fechas válidas en formato DD/MM/AAAA', () => {
      expect(validateBirthDate('15/06/2000').isValid).toBe(true);
      expect(validateBirthDate('01/01/1995').isValid).toBe(true);
      expect(validateBirthDate('31/12/2005').isValid).toBe(true);
    });

    it('rechaza fechas con formato incorrecto', () => {
      expect(validateBirthDate('2000-06-15').isValid).toBe(false);
      expect(validateBirthDate('15-06-2000').isValid).toBe(false);
      expect(validateBirthDate('06/15/2000').isValid).toBe(false);
    });

    it('rechaza fechas fuera de rango', () => {
      expect(validateBirthDate('15/06/2020').isValid).toBe(false); // Muy reciente
      expect(validateBirthDate('15/06/1800').isValid).toBe(false); // Muy antigua
    });
  });

  describe('Cálculo de Edad', () => {
    const calculateAge = (birthDate) => {
      if (!birthDate) return null;
      const parts = birthDate.split('/');
      if (parts.length !== 3) return null;
      
      const [day, month, year] = parts.map(Number);
      if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
      
      const birth = new Date(year, month - 1, day);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age;
    };

    it('calcula la edad correctamente', () => {
      const today = new Date();
      const year20 = today.getFullYear() - 20;
      expect(calculateAge(`01/01/${year20}`)).toBe(20);
    });

    it('retorna null para fechas inválidas', () => {
      expect(calculateAge('')).toBeNull();
      expect(calculateAge(null)).toBeNull();
      expect(calculateAge('fecha-invalida')).toBeNull();
    });
  });

  describe('Intereses', () => {
    const validateInterest = (interest, existingInterests = []) => {
      if (!interest || typeof interest !== 'string') {
        return {isValid: false, error: 'Interés es requerido'};
      }
      
      const trimmed = interest.trim();
      if (trimmed.length === 0) {
        return {isValid: false, error: 'Interés no puede estar vacío'};
      }
      
      if (trimmed.length > 30) {
        return {isValid: false, error: 'Interés muy largo (máx 30 caracteres)'};
      }
      
      if (existingInterests.includes(trimmed)) {
        return {isValid: false, error: 'Este interés ya existe'};
      }
      
      if (existingInterests.length >= 10) {
        return {isValid: false, error: 'Máximo 10 intereses'};
      }
      
      return {isValid: true, error: null};
    };

    it('acepta intereses válidos', () => {
      expect(validateInterest('Música', []).isValid).toBe(true);
      expect(validateInterest('Deportes', ['Música']).isValid).toBe(true);
    });

    it('rechaza intereses duplicados', () => {
      expect(validateInterest('Música', ['Música', 'Cine']).isValid).toBe(false);
    });

    it('rechaza cuando hay 10 intereses', () => {
      const interests = Array(10).fill('').map((_, i) => `Interés ${i}`);
      expect(validateInterest('Nuevo', interests).isValid).toBe(false);
    });

    it('rechaza intereses muy largos', () => {
      const longInterest = 'A'.repeat(31);
      expect(validateInterest(longInterest, []).isValid).toBe(false);
    });
  });
});
