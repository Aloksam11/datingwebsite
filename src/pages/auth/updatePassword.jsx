import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Box, Button, Link, Stack, TextField, Typography } from '@mui/material'
import { useAuth } from 'src/hooks/use-auth'
import { Layout as AuthLayout } from 'src/layouts/auth/layout'
import { resetPassword } from 'src/hooks/apis/onboardingApi'
import { AuthContext, useAuthContext } from 'src/contexts/auth-context'
const Page = () => {
  const router = useRouter()
  const auth = useAuthContext()
  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
      submit: null,
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters')
        .max(255, 'Password is too long'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const authToken = localStorage.getItem('updatePassword')
        const { response } = await resetPassword(values.password, authToken)
        localStorage.setItem('authToken', response.data.token)
        window.sessionStorage.setItem('authenticated', 'true')
        router.push('/')
      } catch (err) {
        helpers.setStatus({ success: false })
        helpers.setErrors({ submit: err.message })
        helpers.setSubmitting(false)
      }
    },
  })

  return (
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
            <Typography variant="h4">Update Password</Typography>
          </Stack>
          <form noValidate onSubmit={formik.handleSubmit}>
            <Stack spacing={3}>
              <TextField
                error={!!(formik.touched.password && formik.errors.password)}
                fullWidth
                helperText={formik.touched.password && formik.errors.password}
                label="Password"
                name="password"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="password"
                value={formik.values.password}
              />
              <TextField
                error={
                  !!(
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  )
                }
                fullWidth
                helperText={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                }
                label="Confirm Password"
                name="confirmPassword"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="password"
                value={formik.values.confirmPassword}
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
              Continue
            </Button>
          </form>
        </div>
      </Box>
    </Box>
  )
}

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>

export default Page
