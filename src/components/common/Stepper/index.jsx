import React, {useState} from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';


const steps = ['Created', 'Preparing', 'Ready for delivery', 'On the way', 'Delivered'];

  const StepLabelStyled = styled(StepLabel)(({ theme }) => ({
    '& .MuiStepLabel-iconContainer .MuiStepIcon-root': {
      width: 25, 
      height: 25, 
    },
    '& .MuiStepLabel-label': {
      fontSize: '1.2rem', 
    },
  }));


export default function index({orderStatus}) {

  

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper  activeStep={orderStatus()} alternativeLabel>
        {steps.map((label, index) => {
          return (
            <Step key={label} >
              <StepLabelStyled >{label}</StepLabelStyled>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}


