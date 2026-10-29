import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import IPodExperience from './IPodExperience';

jest.mock('./logbutton', () => ({ LogButton: () => <button>Connexion</button> }));
jest.mock('./MusicVideoPlayer', () => ({ track, onClose }) => (
  <aside aria-label="Vidéo officielle"><span>{track.artist}</span><button onClick={onClose}>Fermer la vidéo</button></aside>
));

beforeEach(() => {
  HTMLMediaElement.prototype.play = jest.fn(function () { fireEvent.play(this); return Promise.resolve(); });
  HTMLMediaElement.prototype.pause = jest.fn(function () { fireEvent.pause(this); });
});

test('starts silent with the approved bear logo and a usable iPod menu', () => {
  render(<IPodExperience />);
  expect(screen.getByRole('img', { hidden: true }).getAttribute('src')).toBe('/brand/dimension-bear.svg');
  expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  expect(screen.getByTestId('dimension-ipod')).toBeInTheDocument();
  const lcd = within(screen.getByTestId('dimension-ipod'));
  expect(lcd.getByRole('button', { name: 'Après le service' })).toBeInTheDocument();
  expect(lcd.getByRole('button', { name: 'Lo-fi original' })).toBeInTheDocument();
});

test('selecting a curated track opens the official embedded video, and silence closes it', () => {
  render(<IPodExperience />);
  const lcd = within(screen.getByTestId('dimension-ipod'));
  fireEvent.click(lcd.getByRole('button', { name: 'Après le service' }));
  fireEvent.click(lcd.getByRole('button', { name: 'Weird Fishes / Arpeggi' }));
  expect(screen.getByLabelText('Vidéo officielle')).toBeInTheDocument();
  expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Fermer la vidéo' }));
  expect(screen.queryByLabelText('Vidéo officielle')).not.toBeInTheDocument();
});

test('wheel keyboard navigation opens local tracks and clicking a track starts the original audio file', () => {
  const { container } = render(<IPodExperience />);
  const wheel = screen.getByRole('group', { name: /Molette iPod/ });
  wheel.focus();
  fireEvent.keyDown(wheel, { key: 'ArrowDown' });
  fireEvent.keyDown(wheel, { key: 'Enter' });
  const lcd = within(screen.getByTestId('dimension-ipod'));
  expect(lcd.getByText('Lo-fi original')).toBeInTheDocument();
  fireEvent.click(lcd.getByRole('button', { name: 'Embrace' }));
  expect(container.querySelector('audio')).toHaveAttribute('src', '/music/boy/embrace-12278.mp3');
  expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
  fireEvent.click(lcd.getByRole('button', { name: 'MENU' }));
  expect(lcd.getByRole('button', { name: 'Embrace' })).toBeInTheDocument();
});
