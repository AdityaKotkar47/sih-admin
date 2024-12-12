import { Box, Button, Paper, Typography } from '@mui/material';
import { Launch as LaunchIcon } from '@mui/icons-material';

function ExternalLink({ title, description, url }) {
  return (
    <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ flexGrow: 1 }}>
        {description}
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          endIcon={<LaunchIcon />}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open Tool
        </Button>
      </Box>
    </Paper>
  );
}

export default ExternalLink; 