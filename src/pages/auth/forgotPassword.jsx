import Head from 'next/head'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Box, Button, Link, Stack, TextField, Typography } from '@mui/material'
import { useAuth } from 'src/hooks/use-auth'
import { Layout as AuthLayout } from 'src/layouts/auth/layout'
import {
  forgotPassword,
  verifyOTPresetPassWord,
} from 'src/hooks/apis/onboardingApi'
import Modal from '@mui/material/Modal'
import Backdrop from '@mui/material/Backdrop'
import Fade from '@mui/material/Fade'
import React from 'react'
const Page = () => {
  const router = useRouter()
  const auth = useAuth()

  const formik = useFormik({
    initialValues: {
      email: '',
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const response = await forgotPassword(values.email.toLowerCase())
        if (response?.data?.token) {
          localStorage.setItem('forgotToken', response?.data?.token)
        }
        handleOpen()
      } catch (err) {
        helpers.setStatus({ success: false })
        helpers.setErrors({ submit: err.message })
        helpers.setSubmitting(false)
      }
    },
  })

  const [open, setOpen] = React.useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleOtpSubmit = async (event) => {
    event.preventDefault()

    try {
      const authToken = localStorage.getItem('forgotToken')
      const otp =
        formik.values.otp1 +
        formik.values.otp2 +
        formik.values.otp3 +
        formik.values.otp4 +
        formik.values.otp5 +
        formik.values.otp6
      const response = await verifyOTPresetPassWord(otp, authToken)
      localStorage.removeItem('forgotToken')
      if (response?.data?.token) {
        localStorage.setItem('updatePassword', response?.data?.token)
      }
      router.push('/auth/updatePassword')
    } catch (err) {
      console.error(' error:', err)
      helpers.setStatus({ success: false })
      helpers.setErrors({ submit: err.message })
      helpers.setSubmitting(false)
    }
  }
  return (
    <>
      <Head>
        <title>Forgot Password | Dating App</title>
      </Head>
      <Box
        sx={{
          flex: '1 1 auto',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: '100px',
            width: '100%',
          }}
        >
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">Forgot Password</Typography>
            </Stack>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email Address"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
                />
              </Stack>
              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
              >
                Send
              </Button>
            </form>
          </div>
        </Box>
      </Box>
      {/* OTP Verification Modal */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '300px',
              p: 3,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              borderRadius: 5,
            }}
          >
            <Typography variant="h6" id="transition-modal-title">
              Enter OTP
            </Typography>
            <form onSubmit={handleOtpSubmit}>
              <Stack direction="horizontal" spacing={2}>
                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <TextField
                    key={index}
                    error={
                      !!(
                        formik.touched[`otp${index}`] &&
                        formik.errors[`otp${index}`]
                      )
                    }
                    fullWidth
                    helperText={
                      formik.touched[`otp${index}`] &&
                      formik.errors[`otp${index}`]
                    }
                    label={`OTP ${index}`}
                    name={`otp${index}`}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="text"
                    inputProps={{ maxLength: 1 }}
                    value={formik.values[`otp${index}`]}
                  />
                ))}
              </Stack>
              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
              >
                Verify OTP
              </Button>
            </form>
          </Box>
        </Fade>
      </Modal>
    </>
  )
}

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>

export default Page
