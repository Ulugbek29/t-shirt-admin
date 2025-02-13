

import { Button, CircularProgress } from "@mui/material"
import SaveIcon from '@mui/icons-material/Save';

const SaveButton = ({ children, loading, title = 'Save', ...props }) => {
  return (
    <Button
      disabled={loading}
      style={{ minWidth: 130 }}
      startIcon={loading ? <CircularProgress size={14} style={{ color: '#fff' }} /> : <SaveIcon />}
      variant="contained"
      {...props}
    >
      { title }
    </Button>
  )
}

export default SaveButton
