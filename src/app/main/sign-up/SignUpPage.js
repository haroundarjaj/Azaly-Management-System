import React, { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import _ from '@lodash';
import AvatarGroup from '@mui/material/AvatarGroup';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import FormHelperText from '@mui/material/FormHelperText';
import jwtService from '../../auth/services/jwtService';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import EncryptingTools from 'src/app/utils/EncryptingTools';
import ProfilePicture from "profile-picture";
import "profile-picture/build/ProfilePicture.css";
import { useTranslation } from 'react-i18next';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  firstName: yup.string().required('You must enter your first name'),
  lastName: yup.string().required('You must enter your last name'),
  address: yup.string(),
  phoneNumber: yup.number().required('You must enter your phone number'),
  email: yup.string().email('You must enter a valid email').required('You must enter an email'),
  password: yup
    .string()
    .required('Please enter your password.')
    .min(8, 'Password is too short - should be 8 chars minimum.'),
  passwordConfirm: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
  acceptTermsConditions: yup.boolean().oneOf([true], 'The terms and conditions must be accepted.'),
});

const defaultValues = {
  firstName: '',
  lastName: '',
  address: '',
  phoneNumber: '',
  email: '',
  password: '',
  passwordConfirm: '',
  acceptTermsConditions: false,
};

const profilePictureRef = React.createRef();

function SignUpPage() {
  const { control, formState, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors, setError } = formState;

  const [isOpenImageUploader, setIsOpenImageUploader] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  const tGeneral = useTranslation('generalTranslations').t;

  function onSubmit({ firstName, lastName, address, phoneNumber, email, password }) {
    const user = {
      firstName,
      lastName,
      address,
      phoneNumber,
      email,
      username: email,
      password: EncryptingTools.encryptString(password),
      isActive: false,
      image: profilePicture
    }
    jwtService
      .createUser(user)
      .then((user) => {
        // No need to do anything, registered user data will be set at app/auth/AuthContext
      })
      .catch((_errors) => {
        console.log(_errors)
        _errors.forEach((error) => {
          setError(error.type, {
            type: 'manual',
            message: error.message,
          });
        });
      });
  }

  const handleSavePicture = () => {
    let pic = null;
    const PP = profilePictureRef.current;
    const imageAsDataURL = PP.getImageAsDataUrl(1);
    if (PP.getData().imageSrc) {
      pic = imageAsDataURL;
    }
    setProfilePicture(pic);
    setIsOpenImageUploader(false);
  }

  const handleError = (status) => {
    if (status === 'INVALID_FILE_TYPE') {

    } else if (status === 'INVALID_IMAGE_SIZE') {

    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-1 min-w-0">
        <Paper className="h-full sm:h-auto md:flex md:items-center md:justify-center w-full sm:w-auto md:h-full md:w-1/2 py-8 px-16 sm:p-48 md:p-64 sm:rounded-2xl md:rounded-none sm:shadow md:shadow-none ltr:border-r-1 rtl:border-l-1">
          <div className="w-full p-48 mx-auto ">
            <div className='w-full flex justify-between align-center'>
              <div>
                <img className="w-48" src={process.env.PUBLIC_URL + "/assets/images/logo/azalyLogoDark.png"} alt="logo" />
                <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
                  Sign up
                </Typography>
                <div className="flex items-baseline mt-2 font-medium">
                  <Typography>Already have an account?</Typography>
                  <Link className="ml-4" to="/sign-in">
                    Sign in
                  </Link>
                </div>
              </div>
              <Avatar
                alt={tGeneral('profile_picture')}
                src={profilePicture || `${process.env.PUBLIC_URL}/assets/images/avatars/general-avatar.svg`}
                style={{ width: 140, height: 140 }}
                onClick={() => setIsOpenImageUploader(true)}
              />
            </div>
            <form
              name="registerForm"
              noValidate
              className="flex flex-col justify-center w-full mt-32"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Grid
                container
                spacing={2}
                justifyContent='center'
                alignItems='flex-start'
              >
                <Grid item xs={12} md={6} >
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mb-24"
                        label="First name"
                        autoFocus
                        type="name"
                        error={!!errors.firstName}
                        helperText={errors?.firstName?.message}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6} >
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mb-24"
                        label="Last name"
                        autoFocus
                        type="name"
                        error={!!errors.lastName}
                        helperText={errors?.lastName?.message}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mb-24"
                        label="Address"
                        autoFocus
                        type="address"
                        error={!!errors.address}
                        helperText={errors?.address?.message}
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6} >
                  <Controller
                    name="phoneNumber"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mb-24"
                        label="Phone number"
                        autoFocus
                        type="number"
                        error={!!errors.phoneNumber}
                        helperText={errors?.phoneNumber?.message}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6} >
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mb-24"
                        label="Email"
                        type="email"
                        error={!!errors.email}
                        helperText={errors?.email?.message}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6} >
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Password"
                        type="password"
                        error={!!errors.password}
                        helperText={errors?.password?.message}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6} >
                  <Controller
                    name="passwordConfirm"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Password (Confirm)"
                        type="password"
                        error={!!errors.passwordConfirm}
                        helperText={errors?.passwordConfirm?.message}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="acceptTermsConditions"
                    control={control}
                    render={({ field }) => (
                      <FormControl className="items-center" error={!!errors.acceptTermsConditions}>
                        <FormControlLabel
                          label="I agree to the Terms of Service and Privacy Policy"
                          control={<Checkbox size="small" {...field} />}
                        />
                        <FormHelperText>{errors?.acceptTermsConditions?.message}</FormHelperText>
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
              <Button
                variant="contained"
                color="secondary"
                className="w-full mt-24"
                aria-label="Register"
                disabled={_.isEmpty(dirtyFields) || !isValid}
                type="submit"
                size="large"
              >
                Create account
              </Button>
            </form>
          </div>
        </Paper>

        <Box
          className="relative hidden md:flex flex-auto items-center justify-center h-full p-64 lg:px-112 overflow-hidden"
          sx={{ backgroundColor: 'primary.main' }}
        >
          <svg
            className="absolute inset-0 pointer-events-none"
            viewBox="0 0 960 540"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMax slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Box
              component="g"
              sx={{ color: 'primary.light' }}
              className="opacity-20"
              fill="none"
              stroke="currentColor"
              strokeWidth="100"
            >
              <circle r="234" cx="196" cy="23" />
              <circle r="234" cx="790" cy="491" />
            </Box>
          </svg>
          <Box
            component="svg"
            className="absolute -top-64 -right-64 opacity-20"
            sx={{ color: 'primary.light' }}
            viewBox="0 0 220 192"
            width="220px"
            height="192px"
            fill="none"
          >
            <defs>
              <pattern
                id="837c3e70-6c3a-44e6-8854-cc48c737b659"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <rect x="0" y="0" width="4" height="4" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="220" height="192" fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)" />
          </Box>

          <div className="z-10 relative w-full max-w-2xl">
            <div className="logo" style={{ display: 'flex', justifyContent: 'center', marginBottom: 50 }}>
              <img width="250" src={process.env.PUBLIC_URL + '/assets/images/logo/azalyLogo.png'} alt="logo" />
            </div>
            <div className="pt-50 text-5xl font-bold leading-none text-gray-100">
              <div>Welcome to</div>
            </div>
            <div className="text-4xl font-bold leading-none text-gray-100">
              <div>Azaly Management App</div>
            </div>
            <div className="mt-8 font-medium tracking-tight text-gray-400">
              {`Developed by: Haroun Darjaj (DarTech)`}
            </div>
          </div>
        </Box>
      </div>
      <Dialog
        open={isOpenImageUploader}
        onClose={() => setIsOpenImageUploader(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          <Typography variant="subtitle1" color="secondary">
            Profile picture
          </Typography>
        </DialogTitle>
        <DialogContent>
          <ProfilePicture
            ref={profilePictureRef}
            image={profilePicture}
            useHelper
            frameFormat='circle'
            frameSize={400}
            cropSize={400}
            onStatusChange={handleError}
            minImageSize={200}
            messages={
              {
                DEFAULT: tGeneral('image_tap'),
                DRAGOVER: tGeneral('image_drop'),
                INVALID_FILE_TYPE: "",
                INVALID_IMAGE_SIZE: ""
              }
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsOpenImageUploader(false)}>Close</Button>
          <Button color="secondary" onClick={handleSavePicture}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SignUpPage;
