import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import MusicArchive, { formatTime } from './MusicArchive';
jest.mock('./logbutton', () => ({ LogButton: () => <button>Log in</button> }));
let videoInstance;
beforeEach(() => {
  window.YT = {Player: jest.fn(function(element, options) {
    const iframe = document.createElement('iframe'); element.replaceWith(iframe);
    videoInstance = {setVolume:jest.fn(),unMute:jest.fn(),getIframe:()=>iframe,destroy:jest.fn(()=>iframe.remove()),playVideo:jest.fn(()=>options.events.onStateChange({data:1})),pauseVideo:jest.fn(()=>options.events.onStateChange({data:2}))};
    Promise.resolve().then(()=>options.events.onReady({target:videoInstance}));
    return videoInstance;
  })};
  HTMLMediaElement.prototype.play = jest.fn(function () { fireEvent.play(this); return Promise.resolve(); });
  HTMLMediaElement.prototype.pause = jest.fn(function () { fireEvent.pause(this); });
});
test('formats real durations without leaking invalid metadata', () => {
  expect(formatTime(179.8)).toBe('02:59');
  expect(formatTime(NaN)).toBe('--:--');
});
test('preserves both original groups and their original artwork', () => {
  render(<MusicArchive />);
  fireEvent.click(screen.getByRole('button',{name:'Lo-fi original'}));
  const girl = screen.getByRole('region', { name: 'Silence' });
  const boy = screen.getByRole('region', { name: 'Retour' });
  expect(within(girl).getAllByRole('button')).toHaveLength(6);
  expect(within(boy).getAllByRole('button')).toHaveLength(4);
  expect(within(girl).getByRole('button', { name:'Play Let it Go' }).querySelector('img')).toHaveAttribute('src','/gif/8.gif');
});
test('changing tracks keeps the chosen audio source through search and collection filters', async () => {
  const { container } = render(<MusicArchive />);
  fireEvent.click(screen.getByRole('button',{name:'Lo-fi original'}));
  fireEvent.click(screen.getByRole('button', { name: 'Play Embrace' }));
  await screen.findByRole('button', {name:'Pause Embrace'});
  fireEvent.click(screen.getByRole('button', { name: 'Next track' }));
  const media = container.querySelector('audio');
  await waitFor(()=>expect(media.getAttribute('src')).toBe('/music/boy/good-night-160166.mp3'));
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Paris' } });
  expect(screen.getByRole('button', { name: 'Play Once in Paris' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Play Embrace' })).not.toBeInTheDocument();
  expect(media.getAttribute('src')).toBe('/music/boy/good-night-160166.mp3');
  fireEvent.click(within(screen.getByLabelText('Filter collections')).getByRole('button', {name:'Retour',exact:true}));
  expect(screen.getByRole('status')).toHaveTextContent('No tracks found');
});
test('selected cards play, pause, and continue to the next track on end', async () => {
  const {container}=render(<MusicArchive />);
  fireEvent.click(screen.getByRole('button',{name:'Lo-fi original'}));
  fireEvent.click(screen.getByRole('button', { name:'Play Lofi Study' }));
  await screen.findByRole('button', { name:'Pause Lofi Study' });
  fireEvent.click(screen.getByRole('button', { name:'Pause Lofi Study' }));
  expect(screen.getByRole('button', { name:'Play Lofi Study' })).toBeInTheDocument();
  fireEvent.ended(container.querySelector('audio'));
  await screen.findByRole('button', { name:'Pause Lofi Chill' });
  expect(container.querySelector('audio').getAttribute('src')).toBe('/music/boy/lofi-chill-140858.mp3');
});


test('starts in silence, loads an official player only on selection, and silence removes it', async () => {
  const {container}=render(<MusicArchive />);
  expect(container.querySelector('iframe')).not.toBeInTheDocument();
  expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button',{name:'Écouter Weird Fishes / Arpeggi — Radiohead'}));
  await screen.findByTitle('Weird Fishes / Arpeggi — Radiohead');
  expect(videoInstance.setVolume).toHaveBeenCalledWith(65);
  fireEvent.click(screen.getByRole('button',{name:'Fermer le lecteur et revenir au silence'}));
  expect(container.querySelector('iframe')).not.toBeInTheDocument();
  expect(screen.getByLabelText('Lecteur au repos')).toBeInTheDocument();
});
test('switching between local audio and YouTube never leaves both players active', async () => {
  const {container}=render(<MusicArchive />);
  fireEvent.click(screen.getByRole('button',{name:'Lo-fi original'}));
  fireEvent.click(screen.getByRole('button',{name:'Play Embrace'}));
  await screen.findByRole('button',{name:'Pause Embrace'});
  fireEvent.click(screen.getByRole('button',{name:'Après le service'}));
  fireEvent.click(screen.getByRole('button',{name:'Écouter Weird Fishes / Arpeggi — Radiohead'}));
  await screen.findByTitle('Weird Fishes / Arpeggi — Radiohead');
  expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  expect(screen.queryByLabelText('Persistent player')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Lo-fi original'}));
  fireEvent.click(screen.getByRole('button',{name:'Play Lofi Study'}));
  await screen.findByRole('button',{name:'Pause Lofi Study'});
  expect(container.querySelector('iframe')).not.toBeInTheDocument();
});

test('volume controls the official player and play/pause follows its state', async () => {
  render(<MusicArchive />);
  fireEvent.click(screen.getByRole('button',{name:'Écouter Weird Fishes / Arpeggi — Radiohead'}));
  await screen.findByTitle('Weird Fishes / Arpeggi — Radiohead');
  fireEvent.change(screen.getByRole('slider',{name:'Volume'}),{target:{value:'.25'}});
  expect(videoInstance.setVolume).toHaveBeenLastCalledWith(25);
  fireEvent.click(screen.getByRole('button',{name:'Lecture',exact:true}));
  expect(videoInstance.playVideo).toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button',{name:'Pause',exact:true}));
  expect(videoInstance.pauseVideo).toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button',{name:'Fermer le lecteur et revenir au silence'}));
  expect(videoInstance.destroy).toHaveBeenCalled();
});
