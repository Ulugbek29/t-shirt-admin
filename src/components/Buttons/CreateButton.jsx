import LoadingButton from '@mui/lab/LoadingButton';
import AddIcon from "@mui/icons-material/Add"

const CreateButton = ({ children, title = "Добавить", ...props }) => {
  return (
    <LoadingButton
    sx={{
      fontWeight: 600
    }}
      startIcon={<AddIcon />}
      variant="contained"
      loadingPosition="start"
      color='primary'
      {...props}
    >
      {title}
    </LoadingButton>
  )
}

export default CreateButton
