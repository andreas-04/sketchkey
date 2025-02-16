import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

function Rank() {
  const [rank, setRank] = useState(null);
  const [error, setError] = useState('');

  const getRankings = async () => {
    setError("");
    console.clear();
    try {
        const authCookie = Cookies.get('auth');
        const response = await fetch('http://localhost:8000/canvas/leaderboard/', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authCookie}`
            },
        });

        if (response.ok) {
            const responseData = await response.json();
            setRank(responseData.data);
        } else {
            throw new Error('Failed to fetch rankings.');
        }
    } catch (err) {
        setError('Failed to fetch rankings.');
        console.error(err);
    }
  }

  useEffect(() => {
    getRankings();
  }, []);

  return (
    <>
      <div className='top-div flex items-center justify-center'>
          <div className='max-w[1000px] mx-auto'>
            <h1>Ranking</h1>
            {error && <p>{error}</p>}
            {rank ? (
              <ul>
                {rank.map((item, index) => (
                  <li key={index}>{item.name}: {item.score}</li>
                ))}
              </ul>
            ) : (
              <p>Loading...</p>
            )}
          </div>
      </div>
    </>
  )
}

export default Rank;
