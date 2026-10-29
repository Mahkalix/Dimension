import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import MusicSanctuary from './MusicSanctuary';
jest.mock('./logbutton', () => ({ LogButton: () => <button>Connexion</button> }));
jest.mock('./MusicVideoPlayer', () => ({ track, onClose }) => <aside aria-label="Lecteur musical officiel"><span>{track.title}</span><button onClick={onClose}>Fermer</button></aside>);
beforeEach(() => {
  window.localStorage.clear();
  HTMLMediaElement.prototype.play = jest.fn(function () { fireEvent.play(this); return Promise.resolve(); });
  HTMLMediaElement.prototype.pause = jest.fn(function () { fireEvent.pause(this); });
});
test('home offers three states and starts silent', () => {
  render(<MusicSanctuary />);
  expect(screen.getByRole('button',{name:/BEFORE SERVICE/})).toBeInTheDocument();
  expect(screen.getByRole('button',{name:/IN THE WEEDS/})).toBeInTheDocument();
  expect(screen.getByRole('button',{name:/AFTER CLOSE/})).toBeInTheDocument();
  expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
});
test('entering the sanctuary and selecting a local recording plays it; silence stops playback', () => {
  const {container}=render(<MusicSanctuary />);
  fireEvent.click(screen.getByRole('button',{name:/BEFORE SERVICE/}));
  fireEvent.click(screen.getByRole('button',{name:/Lofi Study/}));
  expect(container.querySelector('audio')).toHaveAttribute('src','/music/girl/lofi-study-112191.mp3');
  expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button',{name:/SILENCE/}));
  expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
});
test('Low Light is user controlled and persisted', () => {
  render(<MusicSanctuary />);
  fireEvent.click(screen.getByRole('button',{name:/LOW LIGHT/}));
  expect(window.localStorage.getItem('dimension-low-light')).toBe('true');
  expect(screen.getByRole('button',{name:/LIGHT ON/})).toHaveAttribute('aria-pressed','true');
});
test('archive keeps original catalogue and supports search', () => {
  render(<MusicSanctuary />);
  fireEvent.click(screen.getByRole('button',{name:'THE ARCHIVE'}));
  fireEvent.change(screen.getByRole('searchbox'),{target:{value:'Embrace'}});
  const archive = document.querySelector('.archive-tracks');
  expect(within(archive).getByRole('button',{name:/Embrace/})).toBeInTheDocument();
  expect(within(archive).queryByRole('button',{name:/Chicago/})).not.toBeInTheDocument();
});
