import './App.css';
import Home from './components/Home';
import EventsListing from './components/EventsListing';
import EventDetails from './components/EventDetails';
import AttractionsListing from './components/AttractionsListing';
import AttractionDetails from './components/AttractionDetails';
import VenuesListing from './components/VenuesListing';
import VenueDetails from './components/VenueDetails';
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className='App'>
        <header className='App-header'>
          <h1 className='App-title'>
            Welcome to the TicketMaster App
          </h1>
          <Link className='showlink' to='/'>
            Home
          </Link>
          <Link className='showlink' to='/events/page/1'>
            Events
          </Link>
          <Link className='showlink' to='/attractions/page/1'>
            Attractions
          </Link>
          <Link className='showlink' to='/venues/page/1'>
            Venues
          </Link>
        </header>
        <br />
        <div className='App-body'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/events/page/:pageNum' element={<EventsListing />} />
            <Route path='/events/:id' element={<EventDetails />} />

            <Route path='/attractions/page/:pageNum' element={<AttractionsListing />} />
            <Route path='/attractions/:id' element={<AttractionDetails />} />

            <Route path='/venues/page/:pageNum' element={<VenuesListing />} />
            <Route path='/venues/:id' element={<VenueDetails />} />


            {/* <Route path='/shows/:id' element={<Show />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
