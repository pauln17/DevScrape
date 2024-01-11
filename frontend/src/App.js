import './index.css';
import { useState, useEffect } from 'react';
import { getAll } from './services/jobs';
import DataTable from './components/DataTable';

function App() {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const fetchedJobs = await getAll();
      setJobs(fetchedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div style={{ height: '100vh', background: 'rgb(10, 10, 10)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', margin: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
        <h1 style={{ color: 'white', fontWeight: '1000', margin: 0, fontSize: '36px' }}>Webscraper for Developer Listings</h1>
        <h3 style={{ color: '#c6d0cd', fontWeight: '300', margin: 0, fontSize: '24px' }}>An automated and personalized webscraper that retrieves the latest data on available developer-related job listings daily at 10AM EST</h3>
      </div>
      {jobs.length > 0 ?
        <div style={{ boxShadow: '0 0 15px 25px rgba(5, 5, 5, 0.5)', borderRadius: '10px', display: 'flex', marginBottom: '25px', border: '2px solid rgb(200, 200, 200)', justifyContent: 'center', height: '100%', width: '85%', overflowY: 'scroll' }}>
          <DataTable jobs={jobs} />
        </div>
        :
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', color: 'white', fontWeight: '1000', margin: 0, fontSize: '36px' }}>
          SCRAPING...
        </div>
      }
    </div>
  );
}

export default App;
