import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Container, Typography, Grid, Box, CircularProgress, Alert } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const FormPage = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [htmlMessage, setHtmlMessage] = useState('');
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

// Cargar datos de LocalStorage cuando se monta el componente
  useEffect(() => {
    const storedHtmlMessage = localStorage.getItem('htmlMessage');
    
    if (storedHtmlMessage) {
      setHtmlMessage(storedHtmlMessage);
    }
  }, []);

  // Guardar mensaje y contraseña en LocalStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem('htmlMessage', htmlMessage);
  }, [htmlMessage]);
  return (
    <Container maxWidth="sm" style={{ marginTop: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Enviar Archivos y Mensaje
      </Typography>

      {/* Mensaje de éxito */}
      {successMessage && <Alert severity="success" style={{ marginBottom: '20px' }}>{successMessage}</Alert>}

      {/* Mensaje de error */}
      {errorMessage && <Alert severity="error" style={{ marginBottom: '20px' }}>{errorMessage}</Alert>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Campo para el archivo de Excel */}
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

          {/* Editor HTML */}
          <Grid item xs={12}>
            <Typography variant="h6">Mensaje HTML</Typography>
            <ReactQuill
              theme="snow"
              value={htmlMessage}
              onChange={setHtmlMessage}
              style={{ height: '300px', marginBottom: '30px' }}  // Ajustamos el tamaño del editor
            />
          </Grid>

          {/* Campo para la contraseña */}
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
