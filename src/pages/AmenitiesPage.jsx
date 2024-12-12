import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

// Base API URL
const API_BASE_URL = 'https://api.pravaah.xyz';

function AmenitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [stationData, setStationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updateStatus, setUpdateStatus] = useState(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a station name');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/stations/search/${encodeURIComponent(searchTerm)}`);
      
      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || 'Failed to fetch station data';
        } catch {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response format from server');
      }

      const data = await response.json();
      setStationData(data);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'An error occurred while searching');
      setStationData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleVisibilityToggle = async (vertexId, currentVisibility) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stations/${encodeURIComponent(searchTerm)}/amenities`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vertexId,
          visible: !currentVisibility,
        }),
      });

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || 'Failed to update amenity visibility';
        } catch {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Update local state to reflect the change
      setStationData(prevData => ({
        ...prevData,
        data: {
          ...prevData.data,
          mapData: {
            ...prevData.data.mapData,
            vertices: prevData.data.mapData.vertices.map(vertex =>
              vertex.id === vertexId
                ? { ...vertex, visible: !vertex.visible }
                : vertex
            ),
          },
        },
      }));

      setUpdateStatus({
        type: 'success',
        message: `Amenity visibility updated successfully`,
      });
    } catch (err) {
      console.error('Update error:', err);
      setUpdateStatus({
        type: 'error',
        message: err.message || 'Failed to update amenity visibility',
      });
    }
  };

  const getAmenities = () => {
    if (!stationData?.data?.mapData?.vertices) return [];
    return stationData.data.mapData.vertices.filter(
      vertex => vertex.objectName && vertex.objectName !== 'entry' && vertex.objectName !== 'exit'
    );
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: 'calc(100vh - 100px)',
      gap: 3,
      p: 3,
    }}>
      {/* Left Side - Search Section */}
      <Paper sx={{ 
        width: '300px',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}>
        <Typography variant="h6" gutterBottom>
          Search Station
        </Typography>
        
        <TextField
          fullWidth
          label="Station Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Enter station name"
          error={!!error}
          size="small"
        />
        
        <Button
          variant="contained"
          onClick={handleSearch}
          startIcon={<SearchIcon />}
          disabled={loading || !searchTerm.trim()}
        >
          Search
        </Button>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {updateStatus && (
          <Alert 
            severity={updateStatus.type}
            onClose={() => setUpdateStatus(null)}
          >
            {updateStatus.message}
          </Alert>
        )}
      </Paper>

      {/* Right Side - Results Section */}
      <Paper sx={{ 
        flex: 1,
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
      }}>
        <Typography variant="h6" gutterBottom>
          {stationData ? `Amenities - ${stationData.name}` : 'No Station Selected'}
        </Typography>

        {stationData ? (
          <>
            <List sx={{ flex: 1 }}>
              {getAmenities().map((amenity) => (
                <ListItem
                  key={amenity.id}
                  divider
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    py: 2,
                  }}
                >
                  <ListItemText
                    primary={amenity.objectName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    secondary={`ID: ${amenity.id}`}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={amenity.visible}
                        onChange={() => handleVisibilityToggle(amenity.id, amenity.visible)}
                        color="primary"
                      />
                    }
                    label={amenity.visible ? 'Visible' : 'Hidden'}
                  />
                </ListItem>
              ))}

              {getAmenities().length === 0 && (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                  No amenities found for this station
                </Typography>
              )}
            </List>
          </>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flex: 1,
          }}>
            <Typography color="text.secondary">
              Search for a station to view and manage its amenities
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default AmenitiesPage; 