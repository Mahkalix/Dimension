import React from 'react';
import {render,screen,fireEvent} from '@testing-library/react';
import MusicStation from './MusicStation';
jest.mock('./MusicVideoPlayer',()=>()=> <div>Lecteur YouTube</div>);
jest.mock('./logbutton',()=>({LogButton:()=> <button>Connexion</button>}));
beforeEach(()=>localStorage.clear());
test('renders the kitchen music library and accessible controls',()=>{
 render(<MusicStation/>);
 expect(screen.getByText('THE KITCHEN')).toBeInTheDocument();
 expect(screen.getByRole('navigation',{name:'Navigation principale'})).toBeInTheDocument();
 expect(screen.getByRole('button',{name:'Lecture'})).toBeInTheDocument();
 expect(screen.getByText('BEFORE SERVICE')).toBeInTheDocument();
});
test('navigates to playlists and offers a track',()=>{
 render(<MusicStation/>);
 fireEvent.click(screen.getByRole('button',{name:/AFTER HOURS/}));
 expect(screen.getByRole('heading',{name:/AFTER HOURS/})).toBeInTheDocument();
 expect(screen.getByText('Weird Fishes / Arpeggi')).toBeInTheDocument();
});
test('favorites can be saved and revisited',()=>{
 render(<MusicStation/>);
 fireEvent.click(screen.getAllByRole('button',{name:'Ajouter aux favoris'})[0]);
 fireEvent.click(screen.getByRole('button',{name:/FAVORITES/}));
 expect(screen.getByRole('heading',{name:'SAVED TRACKS'})).toBeInTheDocument();
 expect(screen.getAllByText('Embrace').length).toBeGreaterThan(0);
});
