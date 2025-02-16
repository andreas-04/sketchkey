import {Typography, Box, Dialog } from "@mui/material";

function Timeout({open}) {

  return (
    <Dialog maxWidth="lg" open={open}>
      <Box height="sm" sx={{ p: 3 }}>
        <Typography variant="h2" align="center">You&apos;re Timed Out!</Typography>
        <Typography variant="h5" align="center">Come back tomorrow for a new SketchKey!</Typography>
      </Box>
    </Dialog>
  );
}

export default Timeout;
