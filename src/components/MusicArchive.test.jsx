import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MusicArchive, { formatTime } from './MusicArchive';
jest.mock('./logbutton', () => ({ LogButton: () => <button>Log in</button> }));
beforeAll(() => {
  HTMLMediaElement.prototype.play = jest.fn(function () { fireEvent.play(this); return Promise.resolve(); });
  HTMLMediaElement.prototype.pause = jest.fn(function () { fireEvent.pause(this); });
  HTMLCanvasElement.prototype.getContext = () => ({ clearRect() {}, beginPath() {}, moveTo() {}, lineTo() {}, stroke() {} });
  window.matchMedia = () => ({ matches: true, addEventListener() {}, removeEventListener() {} });
});
test('formats real durations without leaking invalid metadata', () => {
  expect(formatTime(179.8)).toBe('02:59');
  expect(formatTime(NaN)).toBe('--:--');
});
test('changing tracks keeps the chosen audio source through subsequent renders', async () => {
  const { container } = render(<MusicArchive />);
  fireEvent.click(screen.getAllByRole('button', { name: 'Next track' })[0]);
  await screen.findByRole('heading', { name: /Good Night/ });
  const media = container.querySelector('audio');
  expect(media.getAttribute('src')).toBe('/music/boy/good-night-160166.mp3');
  fireEvent.click(screen.getByRole('button', { name: /Archive/i }));
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Paris' } });
  expect(screen.getByRole('button', { name: 'Play Once in Paris' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Play Embrace' })).not.toBeInTheDocument();
  expect(media.getAttribute('src')).toBe('/music/boy/good-night-160166.mp3');
});
test('session navigation follows its curated queue and playback can pause', async () => {
  render(<MusicArchive />);
  fireEvent.click(screen.getByRole('button', { name: /Sessions/i }));
  fireEvent.click(screen.getAllByRole('button', { name: 'PLAY SESSION' })[0]);
  await screen.findByRole('heading', { name: /Embrace/ });
  fireEvent.click(screen.getAllByRole('button', { name: 'Next track' })[0]);
  await screen.findByRole('heading', { name: /Lofi Study/ });
  await waitFor(() => expect(screen.getAllByRole('button', { name: 'Pause playback' })).toHaveLength(2));
  fireEvent.click(screen.getAllByRole('button', { name: 'Pause playback' })[0]);
  expect(screen.getAllByRole('button', { name: 'Play recording' })).toHaveLength(2);
});

