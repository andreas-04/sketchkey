import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

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
            <Typography variant="h4" component="h1" gutterBottom>
              Ranking
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            {rank ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Rank</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Score</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rank.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.score}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>Loading...</Typography>
            )}
          </div>
      </div>
    </>
  )
}

export default Rank;
