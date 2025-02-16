import { useState, useEffect } from 'react';
// import Cookies from 'js-cookie';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

function Rank() {
  const [rank, setRank] = useState(null);
  const [error, setError] = useState('');


  function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === name) {
            return decodeURIComponent(value);
        }
    }
  }

  const getRankings = async () => {
    setError("");
    console.clear();
    try {
        const response = await fetch('http://localhost:8000/canvas/leaderboard/', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${getCookie("auth")}`,
            },
        });

        if (response.ok) {
            const responseData = await response.json();
            setRank(responseData);
            console.log(responseData[0])
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
                      <TableCell>User</TableCell>
                      <TableCell>Score</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rank.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.user__username}</TableCell>
                        <TableCell>{item.elo_rating}</TableCell>
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
