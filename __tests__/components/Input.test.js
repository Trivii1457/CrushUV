/**
 * @format
 * Pruebas unitarias para el componente Input
 */

import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import Input from '../../src/components/Input';

// Mock de las imágenes
jest.mock('../../src/assets/images/ojo.png', () => 'ojo.png');
jest.mock('../../src/assets/images/ojo_cerrado.png', () => 'ojo_cerrado.png');

describe('Input Component', () => {
  it('renderiza correctamente con label', () => {
    const {getByText} = render(
      <Input 
        label="Email" 
        value="" 
        onChangeText={() => {}} 
        placeholder="Ingresa tu email"
      />
    );
    expect(getByText('Email')).toBeTruthy();
  });

  it('muestra el placeholder correctamente', () => {
    const {getByPlaceholderText} = render(
      <Input 
        value="" 
        onChangeText={() => {}} 
        placeholder="Escribe aquí"
      />
    );
    expect(getByPlaceholderText('Escribe aquí')).toBeTruthy();
  });

  it('ejecuta onChangeText cuando el texto cambia', () => {
    const mockOnChangeText = jest.fn();
    const {getByPlaceholderText} = render(
      <Input 
        value="" 
        onChangeText={mockOnChangeText} 
        placeholder="Input"
      />
    );
    
    fireEvent.changeText(getByPlaceholderText('Input'), 'nuevo texto');
    expect(mockOnChangeText).toHaveBeenCalledWith('nuevo texto');
  });

  it('muestra el valor proporcionado', () => {
    const {getByDisplayValue} = render(
      <Input 
        value="valor inicial" 
        onChangeText={() => {}} 
      />
    );
    expect(getByDisplayValue('valor inicial')).toBeTruthy();
  });

  it('muestra emoji de icono cuando se proporciona iconName', () => {
    const {getByText} = render(
      <Input 
        value="" 
        onChangeText={() => {}} 
        iconName="mail-outline"
      />
    );
    expect(getByText('📧')).toBeTruthy();
  });

  it('muestra mensaje de error cuando hay error', () => {
    const {getByText} = render(
      <Input 
        value="" 
        onChangeText={() => {}} 
        error="Campo requerido"
      />
    );
    expect(getByText('Campo requerido')).toBeTruthy();
  });

  it('oculta el texto cuando es secureTextEntry', () => {
    const {getByPlaceholderText} = render(
      <Input 
        value="contraseña123" 
        onChangeText={() => {}} 
        placeholder="Contraseña"
        secureTextEntry={true}
      />
    );
    
    const input = getByPlaceholderText('Contraseña');
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('renderiza input multiline correctamente', () => {
    const {getByPlaceholderText} = render(
      <Input 
        value="" 
        onChangeText={() => {}} 
        placeholder="Biografía"
        multiline={true}
        numberOfLines={4}
      />
    );
    
    const input = getByPlaceholderText('Biografía');
    expect(input.props.multiline).toBe(true);
  });
});
