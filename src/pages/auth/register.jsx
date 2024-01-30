import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Box, Button, Link, Stack, TextField, Typography } from '@mui/material'
import { useAuth } from 'src/hooks/use-auth'
import { Layout as AuthLayout } from 'src/layouts/auth/layout'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import FormHelperText from '@mui/material/FormHelperText'
import { registerUser } from 'src/hooks/apis/onboardingApi'

const Page = () => {
  const router = useRouter()
  const auth = useAuth()
  const formik = useFormik({
    initialValues: {
      name: '',
      gender: '',
      age: '',
      password: '',
      phone: '1222121212',
      submit: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().max(255).required('Name is required'),
      age: Yup.string().max(3).required('Age is required'),
      password: Yup.string().max(255).required('Password is required'),
      gender: Yup.string().required('Gender is required'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const dataa = {
          name: values.name,
          password: values.password,
          phone: values.phone,
          age: values.age,
          sex: values.gender.toUpperCase(),
        }
        const auths = localStorage.getItem('register')
        const { data } = await registerUser(dataa, auths)
        console.log(data, 'from res register')
        localStorage.setItem('authToken', data.token)
        await auth.signIn(data);
        window.sessionStorage.setItem("authenticated", "true");
        router.push('/')
      } catch (err) {
        helpers.setStatus({ success: false })
        helpers.setErrors({ submit: err.message })
        helpers.setSubmitting(false)
      }
    },
  })

  return (
    <>
      <Head>
        <title>Register | Dating App</title>
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
              <Typography variant="h4">Register</Typography>
              <Typography color="text.secondary" variant="body2">
                Already have an account? &nbsp;
                <Link href="/auth/login" underline="hover" variant="subtitle2">
                  Log in
                </Link>
              </Typography>
            </Stack>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.name && formik.errors.name)}
                  fullWidth
                  helperText={formik.touched.name && formik.errors.name}
                  label="Name"
                  name="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
                <TextField
                  error={!!(formik.touched.phone && formik.errors.phone)}
                  fullWidth
                  helperText={formik.touched.phone && formik.errors.phone}
                  label="Phone"
                  name="phone"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="phone"
                  value={formik.values.phone}
                />
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
                  error={!!(formik.touched.age && formik.errors.age)}
                  fullWidth
                  helperText={formik.touched.age && formik.errors.age}
                  label="Age"
                  name="age"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.age}
                />
                <FormControl
                  component="fieldset"
                  error={!!(formik.touched.gender && formik.errors.gender)}
                >
                  <FormLabel component="legend">Gender</FormLabel>
                  <RadioGroup
                    aria-label="gender"
                    name="gender"
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                  >
                    <FormControlLabel
                      value="male"
                      control={<Radio />}
                      label="Male"
                    />
                    <FormControlLabel
                      value="female"
                      control={<Radio />}
                      label="Female"
                    />
                    <FormControlLabel
                      value="other"
                      control={<Radio />}
                      label="Other"
                    />
                  </RadioGroup>
                  {formik.touched.gender && formik.errors.gender && (
                    <FormHelperText>{formik.errors.gender}</FormHelperText>
                  )}
                </FormControl>
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
    </>
  )
}

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>

export default Page
