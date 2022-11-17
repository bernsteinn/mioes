import {React , useState, useEffect}from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { toast, ToastContainer } from 'react-toastify';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
    overflow: 'hidden'
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiPaper-root' : {
    borderRadius: '15px'
  },
  '& .MuiInputBase-root': {
    borderRadius: '15px',
  },
  '& #outlined-basic' :{
    height: '100% !important'
  },
  '& #outlined-basic2' :{
    height: '100% !important'
  }

}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function CustomizedDialogs() {
  const [open, setOpen] = useState(true);
  const [selectedFile, setSelectedFile] = useState()
  const [preview, setPreview] = useState()
  const [restaurantName, setRestaurantName] = useState()
  const [restaurantAddr, setRestaurantAddr] = useState()
  useEffect(() => {
    if (!selectedFile) {
        setPreview(undefined)
        return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
}, [selectedFile])
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {

    setOpen(false);
  };
  const handleSubmit = () =>{
    if(restaurantName == null || restaurantName.length < 1){
        document.getElementById("outlined-basic").style.background = "red"
        return
    }
    if(restaurantAddr == null || restaurantAddr.length < 1){
        document.getElementById("outlined-basic2").style.background = "red"
        return
    }

    const checkImg = () => {try{if(selectedFile['type'].includes('image')) return true}catch{return false}}
    if(!checkImg() || selectedFile == undefined){
        document.getElementById("img-error").style.color = "red"
        document.getElementById("img-error").innerText = "Porfavor, sube una imagen."
        return
    }
    const formData = new FormData();
    formData.append('name', restaurantName)
    formData.append('address', restaurantAddr)
    formData.append('img', selectedFile)
    fetch("/admin/session/setup", {
        method: 'POST',
        credentials: 'include',
        body: formData
    }).then(response => response.json()).then((data) => {
        if(data.status != true){
            toast.error(data.err)
            return
        }
        localStorage.setItem("hasToCompleteSetUp", false)
        toast.success(data.msg, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined})
            setTimeout(() => {
                setOpen(false)
                window.location.reload()        
            }, 100)
    })
  }
  const onTypeName = (e) => {
    setRestaurantName(e.target.value)
  }
  const onTypeRestaurant = (e) => {
    setRestaurantAddr(e.target.value)
  }

  const onSelectFile = e => {
    if (!e.target.files || e.target.files.length === 0) {
        setSelectedFile(undefined)
        return
    }
    setSelectedFile(e.target.files[0])
}

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          Acaba de configurar tu cuenta
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Para poder usar MIOES es necesario que acabes de configurar tu cuenta.
          </Typography>
          <DialogContent>
          <TextField style={{marginBottom: '15px', borderRadius: '15px'}} id="outlined-basic" label="El nombre de tu restaurante" variant="outlined" fullWidth onChange={onTypeName} value={restaurantName}/>
          <TextField id="outlined-basic2" label="La dirección de tu restaurante" variant="outlined" fullWidth onChange={onTypeRestaurant} value={restaurantAddr}/>
          <div style={{padding: '10px'}}>
          <input type="file" id="actualBtn" onChange={onSelectFile} hidden/>
          <label style={{backgroundColor: "indigo", color: "white", padding: "0.5rem", borderRadius: "0.3rem", cursor: "pointer", marginTop: "1rem"}}for="actualBtn">Sube tu logo</label>
          <img id="file-chosen" src={preview} style={{width: "100px", padding: "10px"}}></img>
          <p id="img-error"></p>
        </div>

          </DialogContent>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit}>
            Confirmar
          </Button>
        </DialogActions>
      </BootstrapDialog>
      <ToastContainer></ToastContainer>
    </div>
  );
}
