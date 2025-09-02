'use client';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useCanvasSettings } from '@/hooks/useCanvasSettings';
import { TRAILERS } from './trailers';

export default function TrailerSelect() {
  const { trailerType, setTrailerType } = useCanvasSettings();

  return (
    <FormControl
      variant="standard"
      sx={{ width: '100%' }}
    >
      <InputLabel id="trailer-select-label">Naczepa</InputLabel>
      <Select
        labelId="trailer-select-label"
        value={trailerType}
        onChange={e => setTrailerType(e.target.value as keyof typeof TRAILERS)}
      >
        {Object.entries(TRAILERS).map(([key, info]) => (
          <MenuItem key={key} value={key}>
            {info.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
