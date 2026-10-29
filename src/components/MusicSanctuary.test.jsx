import React from 'react';
import {fireEvent,render,screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import MusicSanctuary from './MusicSanctuary';
jest.mock('./logbutton',()=>({LogButton:()=> <button>Connexion</button>}));
jest.mock('./MusicVideoPlayer',()=>({track,onClose})=><aside aria-label="Vidéo officielle"><span>{track.title}</span><button onClick={onClose}>Fermer</button></aside>);
beforeEach(()=>{
 HTMLMediaElement.prototype.play=jest.fn(function(){fireEvent.play(this);return Promise.resolve();});
 HTMLMediaElement.prototype.pause=jest.fn(function(){fireEvent.pause(this);});
});
test('introduces the sanctuary without autoplay',()=>{
 render(<MusicSanctuary/>);
 expect(screen.getByRole('dialog')).toBeInTheDocument();
 expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
 fireEvent.click(screen.getByRole('button',{name:/ENTRER/}));
 expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
 expect(screen.getByRole('navigation',{name:'Ambiances'})).toBeInTheDocument();
 expect(screen.getByLabelText('Lecteur musical')).toBeInTheDocument();
});
test('stays on the same page and plays an original track in the bottom bar',()=>{
 const {container}=render(<MusicSanctuary/>);
 fireEvent.click(screen.getByRole('button',{name:/ENTRER/}));
 fireEvent.click(screen.getByRole('button',{name:/BEFORE SERVICE/}));
 fireEvent.click(screen.getByRole('button',{name:/Lofi Study/}));
 expect(container.querySelector('audio')).toHaveAttribute('src','/music/girl/lofi-study-112191.mp3');
 expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
 expect(screen.getByLabelText('Lecteur musical')).toHaveTextContent('Lofi Study');
 expect(container.querySelector('.sanctuary-3d-record')).toHaveClass('is-spinning');
 fireEvent.click(screen.getByRole('button',{name:'Pause'}));
 expect(container.querySelector('.sanctuary-3d-record')).not.toHaveClass('is-spinning');
});
test('keeps a single page for all three moods',()=>{
 render(<MusicSanctuary/>);
 fireEvent.click(screen.getByRole('button',{name:/ENTRER/}));
 for(const label of ['BEFORE SERVICE','IN THE WEEDS','AFTER CLOSE']){
  fireEvent.click(screen.getByRole('button',{name:new RegExp(label)}));
  expect(screen.getByRole('button',{name:new RegExp(label)})).toHaveAttribute('aria-pressed','true');
 }
});
