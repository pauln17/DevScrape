
import './index.css'
import { useState, useEffect } from 'react'
import { getAll } from './services/jobs'
import DataTable from './components/DataTable'

function App() {
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    getAll().then(jobs => setJobs(jobs))
  }, [])


  return (
    <div style={{ height: '100vh', background: 'rgb(10, 10, 10)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} >
      <div style={{ textAlign: 'center', margin: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
        <h1 style={{ color: 'white', fontWeight: '1000', margin: 0, fontSize: '36px' }}>Webscraper for Developer Listings</h1>
        <h3 style={{ color: '#c6d0cd', fontWeight: '300', margin: 0, fontSize: '24px' }}>An automated and personalized webscraper that retrieves the latest data on available developer-related job listings daily</h3>
      </div>
      {jobs &&
        <div style={{ boxShadow: '0 0 15px 25px rgba(5, 5, 5, 0.5)', borderRadius: '10px', display: 'flex', marginBottom: '25px', border: '2px solid rgb(200, 200, 200)', justifyContent: 'center', height: '100%', width: '85%', overflowY: 'scroll' }}>
          <DataTable jobs={jobs} />
        </div>
      }
    </div >
  );
}

export default App;
