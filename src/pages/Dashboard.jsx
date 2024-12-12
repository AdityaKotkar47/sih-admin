import { Box, Grid, Paper, Typography, Button } from '@mui/material';
import { Launch as LaunchIcon } from '@mui/icons-material';

function Dashboard() {
  const tools = [
    {
      title: 'SVG Mapper',
      description: 'Create and manage interactive SVG maps with our mapping tool.',
      url: 'https://svg-mapper.pravaah.xyz',
      isExternal: true
    },
    {
      title: 'SVG Creator',
      description: 'Design and generate custom SVG elements for your projects.',
      url: 'https://svg-creator-pi.vercel.app',
      isExternal: true
    },
    {
      title: '3D Mapper',
      description: 'Create and manipulate 3D maps and models.',
      url: 'https://3d-mapper.pravaah.xyz',
      isExternal: true
    },
    {
      title: 'Database Entry',
      description: 'Manage and edit database records through a user-friendly interface.',
      url: 'https://db.pravaah.xyz',
      isExternal: true
    },
    {
      title: 'API Backend',
      description: 'Monitor and control API services and endpoints.',
      url: 'https://api.pravaah.xyz',
      isExternal: true
    },
    {
      title: 'Amenities Availability',
      description: 'Track and manage amenities availability status.',
      url: '/amenities',
      isExternal: false
    }
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Welcome to SIH Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        {tools.map((tool) => (
          <Grid item xs={12} sm={6} md={4} key={tool.title}>
            <Paper 
              sx={{ 
                p: 3, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => theme.shadows[6],
                }
              }}
            >
              <Typography variant="h5" gutterBottom component="h2">
                {tool.title}
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ flexGrow: 1, mb: 2 }}
              >
                {tool.description}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                endIcon={tool.isExternal ? <LaunchIcon /> : null}
                href={tool.url}
                target={tool.isExternal ? "_blank" : "_self"}
                rel={tool.isExternal ? "noopener noreferrer" : ""}
                component={tool.isExternal ? "a" : "button"}
                fullWidth
              >
                {tool.isExternal ? 'Open Tool' : 'View Details'}
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Dashboard; 