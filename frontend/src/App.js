import React from 'react';
import './index.css';
import { useState, useEffect } from 'react';
import { getAll } from './services/jobs';
import DataTable from './components/DataTable';
import moment from 'moment';

function App() {
    const [jobs, setJobs] = useState(false);
    const [time, setTime] = useState(null);

    const fetchJobs = async () => {
        try {
            const fetchedJobs = await getAll();
            setJobs(fetchedJobs);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const updateTimer = () => {
        const currentDate = moment(new Date());
        let nextDate = moment(currentDate).set({
            hour: 10,
            minute: 0,
            second: 0,
            millisecond: 0,
        });

        if (currentDate.isAfter(nextDate)) {
            nextDate.add(1, 'day');
        }

        const differenceInSeconds = (nextDate - currentDate) / 1000;

        const hours = formatTime(Math.floor(differenceInSeconds / 3600) % 24),
            minutes = formatTime(Math.floor(differenceInSeconds / 60) % 60),
            seconds = formatTime(Math.floor(differenceInSeconds % 60));

        setTime({
            hours,
            minutes,
            seconds,
        });
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        const intervalId = setInterval(updateTimer, 1000);
        return () => clearInterval(intervalId);
    });

    const formatTime = (time) => {
        return time < 10 ? `0${time}` : time;
    };

    return (
        <div
            style={{
                height: '100vh',
                background: 'rgb(10, 10, 10)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <div
                style={{
                    textAlign: 'center',
                    margin: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                }}
            >
                <h1
                    style={{
                        color: 'white',
                        fontWeight: '1000',
                        margin: 0,
                        fontSize: '36px',
                    }}
                >
                    Webscraper for Developer Listings
                </h1>
                <h3
                    style={{
                        color: '#c6d0cd',
                        fontWeight: '300',
                        margin: 0,
                        fontSize: '24px',
                    }}
                >
                    An automated and personalized webscraper that retrieves the
                    latest data on available developer-related job listings
                    daily at 10AM EST
                </h3>
                {time && (
                    <h1
                        style={{
                            color: '#c6d0cd',
                            fontWeight: '300',
                            marginTop: '15px',
                            fontSize: '24px',
                        }}
                    >
                        {time.hours}:{time.minutes}:{time.seconds}
                    </h1>
                )}
            </div>
            {jobs.length > 0 ? (
                <div
                    style={{
                        boxShadow: '0 0 15px 25px rgba(5, 5, 5, 0.5)',
                        borderRadius: '10px',
                        display: 'flex',
                        marginBottom: '25px',
                        border: '2px solid rgb(200, 200, 200)',
                        justifyContent: 'center',
                        height: '100%',
                        width: '85%',
                        overflowY: 'scroll',
                    }}
                >
                    <DataTable jobs={jobs} />
                </div>
            ) : (
                <div
                    style={{
                        textAlign: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: '100%',
                        color: 'white',
                        fontWeight: '1000',
                        margin: 0,
                        fontSize: '36px',
                    }}
                >
                    CURRENTLY SCRAPING
                    <br />
                    REFRESH SOON
                </div>
            )}
        </div>
    );
}

export default App;
