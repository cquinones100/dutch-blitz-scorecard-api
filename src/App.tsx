import React from 'react'
import { Container } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Room from './Room';
import Root from './Root';
import Track from './Track';

export default function App() {
  return(
    <Container style={{ padding: '1rem' }}>
      <Router>
        <Routes>
          <Route path='/' element={<Root />} />
          <Route path='/track' element={<Track />} />
          <Route path='/room/:id' element={<Room />} />
        </Routes>
      </Router>
    </Container>
  );
}