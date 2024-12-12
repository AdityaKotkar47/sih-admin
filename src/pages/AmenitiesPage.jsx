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
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

// Base API URL - replace with your actual API base URL
const API_BASE_URL = 'https://api.pravaah.xyz'; // or your actual API URL

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
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Amenities Management
      </Typography>
      
      {/* Search Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="Search Station"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Enter station name"
            error={!!error}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            startIcon={<SearchIcon />}
            disabled={loading || !searchTerm.trim()}
          >
            Search
          </Button>
        </Box>
      </Paper>

      {/* Status Messages */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {updateStatus && (
        <Alert 
          severity={updateStatus.type} 
          sx={{ mb: 3 }}
          onClose={() => setUpdateStatus(null)}
        >
          {updateStatus.message}
        </Alert>
      )}

      {/* Amenities List */}
      {stationData && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Station: {stationData.name}
          </Typography>
          
          <List>
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
          </List>

          {getAmenities().length === 0 && (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
              No amenities found for this station
            </Typography>
          )}
        </Paper>
      )}
    </Box>
  );
}

export default AmenitiesPage; 