import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Container, Typography, Grid, Box, CircularProgress, Alert } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const FormPage = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [htmlMessage, setHtmlMessage] = useState('Buen día a todos. Adjunto la rendición de este mes');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  
  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const formData = new FormData();
    formData.append('excelFile', data.excelFile[0]);
    formData.append('additionalMessage', htmlMessage);
    formData.append('pass', data.password);
    
    try {
        const response = await fetch('https://san-bartolo.vercel.app/api/send-emails', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (response.ok) {
            setSuccessMessage(result.message);
            reset();  // Reseteamos el formulario
        } else {
            setErrorMessage(result.message || 'Error al enviar correos');
        }
    } catch (error) {
        setErrorMessage('Ocurrió un error inesperado. Por favor, inténtalo más tarde.');
    } finally {
        setLoading(false);
    }
};


  return (
    <Container maxWidth="sm" style={{ marginTop: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Rendición San Bartolo
      </Typography>

      {successMessage && <Alert severity="success" style={{ marginBottom: '20px' }}>{successMessage}</Alert>}
      {errorMessage && <Alert severity="error" style={{ marginBottom: '20px' }}>{errorMessage}</Alert>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="file"
              inputProps={{ accept: '.xls,.xlsx' }}
              {...register('excelFile', { required: 'El archivo Excel es requerido' })}
              error={!!errors.excelFile}
              helperText={errors.excelFile ? errors.excelFile.message : ''}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">Mensaje Inicial</Typography>
            <ReactQuill
              theme="snow"
              value={htmlMessage}
              onChange={setHtmlMessage}
              style={{ height: '300px', marginBottom: '30px' }} 
            />
          </Grid>

          <Grid item xs={12} style={{ marginBottom: '20px' }}>
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ''}
              {...register('password', { required: 'La contraseña es requerida' })}
            />
          </Grid>

          {/* Botón de submit */}
          <Grid item xs={12}>
            <Box textAlign="center">
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Enviar'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default FormPage;
