import { useEffect, useState } from "react";
import { Button, Grid, Typography, CircularProgress, Box, Dialog } from "@mui/material";

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key === name) {
          return decodeURIComponent(value);
      }
  }
  return null;
}

function ComparisonView({ open, handleClose }) {
  const [comparisonOptions, setComparisonOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch comparison options
  useEffect(() => {
    const fetchComparisonOptions = async () => {
      try {
        const response = await fetch('http://localhost:8000/canvas/daily-puzzles/comparison_options/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${getCookie("auth")}`,
          },
        });
        const data = await response.json();

        // Ensure the response is an array before setting state
        if (Array.isArray(data)) {
          setComparisonOptions(data);
        } else {
          setError("Unexpected response format.");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching comparison options:", error);
        setError("Failed to load comparison options.");
        setLoading(false);
      }
    };

    fetchComparisonOptions();
  }, []);

  const onClose = () => {
    if (handleClose) {
      handleClose();
    }
  };

  // Handle button click
  const handleSelect = async (selected_puzzle) => {
    const shown_puzzles = comparisonOptions.map(opt => opt.id);
    const data = {
      shown_puzzles,
      selected_puzzle,
    };

    fetch("http://localhost:8000/canvas/comparison/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${getCookie("auth")}`,
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(result => console.log('Success:', result))
      .catch(error => console.error('Error:', error));

    onClose();
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Dialog maxWidth="lg" open={open} onClose={handleClose}>
      <Box height="sm" sx={{ p: 3 }}>
        <Typography variant="h2" align="center">Pick Your Favorite!</Typography>
        <Grid container spacing={2} justifyContent="center" sx={{ p: 2 }}>
          {comparisonOptions.map((puzzle) => (
            <Grid item key={puzzle.id} xs={12} sm={6} md={4}>
              <Button
                variant="contained"
                onClick={() => handleSelect(puzzle.id)}
                style={{
                  backgroundImage: `url(${puzzle.canvas})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  width: "300px",
                  height: "300px",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                  color: "white",
                  textTransform: "none",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="h6"
                  style={{
                    padding: "8px",
                    borderRadius: "4px",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",  // Optional: Add background for better visibility
                  }}
                >
                  {puzzle.prompt}
                </Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Dialog>
  );
}

export default ComparisonView;
