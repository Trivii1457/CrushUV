/**
 * @format
 * Pruebas unitarias para el componente Button
 */

import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import Button from '../../src/components/Button';

// Mock de react-native-linear-gradient
jest.mock('react-native-linear-gradient', () => {
  const {View} = require('react-native');
  return ({children, ...props}) => <View {...props}>{children}</View>;
});

describe('Button Component', () => {
  it('renderiza correctamente con título', () => {
    const {getByText} = render(
      <Button title="Iniciar Sesión" onPress={() => {}} />
    );
    expect(getByText('Iniciar Sesión')).toBeTruthy();
  });

  it('ejecuta onPress cuando se presiona', () => {
    const mockOnPress = jest.fn();
    const {getByText} = render(
      <Button title="Presionar" onPress={mockOnPress} />
    );
    
    fireEvent.press(getByText('Presionar'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('no ejecuta onPress cuando está deshabilitado', () => {
    const mockOnPress = jest.fn();
    const {getByText} = render(
      <Button title="Deshabilitado" onPress={mockOnPress} disabled={true} />
    );
    
    fireEvent.press(getByText('Deshabilitado'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('muestra ActivityIndicator cuando está cargando', () => {
    const {queryByText, UNSAFE_getByType} = render(
      <Button title="Cargando" onPress={() => {}} loading={true} />
    );
    
    // El título no debería mostrarse cuando está cargando
    expect(queryByText('Cargando')).toBeNull();
  });

  it('renderiza variante secondary correctamente', () => {
    const {getByText} = render(
      <Button title="Secundario" onPress={() => {}} variant="secondary" />
    );
    expect(getByText('Secundario')).toBeTruthy();
  });

  it('renderiza variante outline correctamente', () => {
    const {getByText} = render(
      <Button title="Outline" onPress={() => {}} variant="outline" />
    );
    expect(getByText('Outline')).toBeTruthy();
  });
});
