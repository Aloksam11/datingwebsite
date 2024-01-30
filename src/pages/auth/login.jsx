import { useCallback, useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signIn, signOut, useSession } from "next-auth/react";
import MaleIcon from '@mui/icons-material/Male';
import dating from "../../../public/assets/dating.png"
import FemaleIcon from '@mui/icons-material/Female';
import {
  Box, Typography, ToggleButtonGroup,
  ToggleButton, Grid, Backdrop, Modal, TextField, Checkbox, FormControlLabel, Button, FormControl, Select, MenuItem,
} from '@mui/material';

import { loginUser } from "src/hooks/apis/onboardingApi";
import { Layout as AuthLayout } from "src/layouts/auth/layout";
import { AuthContext, useAuthContext } from "src/contexts/auth-context";
import { useEffect } from "react";
import { getSession } from "next-auth/react";
import { getServerSideProps } from "src/hooks/getServerProp";
const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalContent, setModalContent] = useState('default');
  const handleSubmit = (event) => {
    console.log(' iam called')
    event.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
    const handleLogin = async () => {
      try {
        const { data } = await loginUser(email.toLowerCase(), password);
        console.log(data, 'form')
        localStorage.setItem('authToken', data.token)
        await auth.signIn(email, password);
        router.push('/');
      } catch (error) {
        console.error(" error:", error);
      }
    }
    handleLogin();
  };
  const auth = useAuthContext();
  const authToken = localStorage.getItem("authToken");
  const [method, setMethod] = useState("email");
  const [isModalOpen, setModalOpen] = useState(true);
  const [gender, setGender] = useState("male");
  const [lookingForGender, setLookingForGender] = useState("female");
  const [startAge, setStartAge] = useState(18);
  const [endAge, setEndAge] = useState(18);

  const ageOptions = Array.from({ length: 100 }, (_, i) => i + 18);
  const switchToSignIn = () => {
    setModalContent('signin');
  };
  const handleOpen = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };
  const menuPaperStyle = {
    maxHeight: "200px",
    overflowY: "auto",
  };

  const handleRegister = () => {
    console.log(' iam called')
    router.push('/auth/sendOtp')
  }
  const { data: session } = useSession();

  useEffect(() => {
    if (session && (session.idToken || session.accessToken)) {
      auth.signIn(session.user.email, session.user.email);
      router.push("/");
    }
  }, [session?.idToken, session?.accessToken, router]);

  const handleSignIn = async (provider) => {
    console.log(provider, 'from provoder')
    const account = await signIn(provider, { callbackUrl: "/" });
  };
  const renderDefaultContent = () => (
    <>

      <form onSubmit={handleSubmit}>
        <Box mt={5} display="flex" flexDirection="row" alignItems="center" >
          <Typography variant="h7" style={{ color: 'white', padding: '8px', lineHeight: 1.25, whiteSpace: 'nowrap' }}>
            I am a:
          </Typography>
          <ToggleButtonGroup
            value={gender}
            exclusive
            onChange={(event, newGender) => setGender(newGender)}
            aria-label="my-gender"
          >
            <ToggleButton value="male" aria-label="male">
              <MaleIcon />
            </ToggleButton>
            <ToggleButton value="female" aria-label="female">
              <FemaleIcon />
            </ToggleButton>
          </ToggleButtonGroup>

          <Typography variant="h7"
            style={{ color: 'white', padding: '8px', lineHeight: 1.25, whiteSpace: 'nowrap' }} >
            Seeking a:
          </Typography>
          <ToggleButtonGroup
            value={lookingForGender}
            exclusive
            onChange={(event, newGender) => setLookingForGender(newGender)}
            aria-label="looking-for-gender"
          >
            <ToggleButton value="male" aria-label="male">
              <MaleIcon />
            </ToggleButton>
            <ToggleButton value="female" aria-label="female">
              <FemaleIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box mt={2} display="flex" flexDirection="row" alignItems="center">
          <Typography variant="h7" style={{ color: 'white', padding: '8px', lineHeight: 1.25, whiteSpace: 'nowrap' }}>Between ages:</Typography>
          <FormControl>
            <Select
              value={startAge}
              onChange={(event) => setStartAge(event.target.value)}
              MenuComponent="div"
              MenuProps={{
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
                getContentAnchorEl: null,
                PaperProps: {
                  style: menuPaperStyle,
                },
              }}
            >
              {ageOptions.map((age) => (
                <MenuItem key={age} value={age}>
                  {age}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="h7" style={{ color: 'white', padding: '8px', lineHeight: 1.25, whiteSpace: 'nowrap' }}>and</Typography>

          <FormControl>
            <Select
              value={endAge}
              onChange={(event) => setEndAge(event.target.value)}
              MenuComponent="div"
              MenuProps={{
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
                getContentAnchorEl: null,
                PaperProps: {
                  style: menuPaperStyle,
                },
              }}
            >
              {ageOptions.map((age) => (
                <MenuItem key={age} value={age}>
                  {age}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box mt={2}>
          <Button
            type="button"
            variant="contained"
            fullWidth
            className="action call-to-action"
            onClick={switchToSignIn}
          >
            Sign In
          </Button>
        </Box>


        <div style={{ marginTop: '5px' }}>
          <p style={{ fontSize: '10px', color: 'white', textAlign: 'center' }}>By clicking “Sign in via Google” you agree with the  Terms & Conditions and Privacy Policy and Refund and Cancellation Policy.</p>
        </div>


      </form>
      <Box mt={2}>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          onClick={() => handleSignIn('google')}
          style={{ backgroundColor: 'white', color: 'black', display: 'flex', alignItems: 'center' }}
        >
          <img src="/assets/googleMain.png" style={{ width: '14px', height: '14px', left: '30px', resize: 'contain' }} />
          Sign in with Google
        </Button>
      </Box>


    </>
  );

  const renderSignInContent = () => (
    <>
      {/* New content for Sign In state */}
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box>
            <Typography variant="h7" style={{ color: 'white', padding: '8px', lineHeight: 1.25, whiteSpace: 'nowrap' }}>
              Email:
            </Typography>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ marginBottom: '8px', padding: '8px' }}
            />
          </Box>
          <Box>
            <Typography variant="h7" style={{ color: 'white', padding: '8px', lineHeight: 1.25, whiteSpace: 'nowrap' }}>
              Password:
            </Typography>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ marginBottom: '8px', padding: '8px' }}
            />
          </Box>
        </Box>

        <Box mt={4}>
          <Button type="submit" variant="contained" fullWidth className="action call-to-action" >
            Sign In
          </Button>
        </Box>
      </form >
      <Box mt={2}>
        <Button
          type="button"
          variant="contained"
          fullWidth
          style={{ backgroundColor: 'white', color: 'black', marginTop: '8px' }}
          onClick={() => setModalContent('default')}
        >
          Go Back
        </Button>
      </Box>
    </>
  );

  return (
    <Box
      component="main"
      sx={{
        width: "100%",
      }}
    >
      <Grid
        item
        xs={12}
        sx={{
          backgroundColor: "background.paper",
          display: "flex",
          flexDirection: "row",
          flex: 1,
          width: "100%",
        }}
      >


        <div
          style={{
            backgroundImage: `url("/assets/dating.png")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            height: '500px',
            resize: 'contain',
            display: 'flex',
            flexDirection: 'row',
          }}
          className="block hero light background-images search-compact"
        >
          <Box
            mb={6}
            sx={{
              position: 'relative',
              clear: 'both',
              boxSizing: 'border-box',
              top: '50%',
              textAlign: 'center',
              left: '30%',
              width: '30%',
              height: '100%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'rgba(0,0,0,.5)',
              boxShadow: 24,
              alignContent: 'center',
              justifyContent: 'center',
              borderRadius: 2,

              '@media (max-width: 600px)': {
                width: '10%',
                height: '50%',
                left: '50%',
              },
              '@media (max-width: 1280px)': {
                width: '410px',
                padding: '35px',
              },
              '@media (min-width: 769px)': {
                borderRadius: '10px',
              },
            }}
          >
            <Typography variant="h5" gutterBottom style={{ color: 'white' }}>
              Let your passion run deep.
            </Typography>
            {modalContent === 'default' ? (
              renderDefaultContent()) : (renderSignInContent())}
          </Box>
        </div>

      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          backgroundColor: "background.paper",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          width: "100%", // Full width
        }}
      >
        <section className="block people-image">
          <div className="limiting-wrapper">
            <div className="wrapper">
              <div className="call"></div>
            </div>
          </div>
        </section>
        <section className="block people-cta">
          <div className="limiting-wrapper">
            <div className="wrapper"><Button className="action call-to-action medium" onClick={() => {
              handleRegister()
            }}>Create an account</Button></div>
          </div>
        </section>
      </Grid>

      <Grid
        item
        xs={12}
        lg={3}
        sx={{
          backgroundColor: "background.paper",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          width: "100%", // Full width
        }}
      >

        <section className="block benefits">
          <div className="limiting-wrapper">
            <co-i18n>
              <div className="benefits-container">
                <div className="wrapper">
                  <section className="benefit">
                    <div className="wrapper">
                      <div className="image-placeholder">
                        <div className="wrapper"><img className="image" src="/terra-assets/images/benefits/1-a8f4b59871-3.png" /></div>
                      </div>
                      <div className="content">
                        <h3>Protection</h3>
                        <p>Your safety is provided by leading anti-scam system in the industry.</p>
                      </div>
                    </div>
                  </section>
                  <section className="benefit">
                    <div className="wrapper">
                      <div className="image-placeholder">
                        <div className="wrapper"><img className="image" src="/terra-assets/images/benefits/2-8ad37d3a73-3.png" /></div>
                      </div>
                      <div className="content">
                        <h3>Verification</h3>
                        <p>All members are personally confirmed by our staff to prove they are real.</p>
                      </div>
                    </div>
                  </section>
                  <section className="benefit">
                    <div className="wrapper">
                      <div className="image-placeholder">
                        <div className="wrapper"><img className="image" src="/terra-assets/images/benefits/3-a982e3cdee-3.png" /></div>
                      </div>
                      <div className="content">
                        <h3>Attention</h3>
                        <p>Receive lots of attention from gorgeous members online.</p>
                      </div>
                    </div>
                  </section>
                  <section className="benefit">
                    <div className="wrapper">
                      <div className="image-placeholder">
                        <div className="wrapper"><img className="image" src="/terra-assets/images/benefits/4-2eaafd1b57-3.png" /></div>
                      </div>
                      <div className="content">
                        <h3>Communication</h3>
                        <p>Chat, send letters,share photos and videos.</p>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </co-i18n>
          </div>
        </section>
      </Grid>

      <Grid
        item
        xs={12}
        lg={3}
        sx={{
          backgroundColor: "background.paper",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <section className="block about">
          <div className="limiting-wrapper">
            <div className="wrapper">
              <co-i18n>
                <div className="call">
                  <h3>Receive Lots of Attention from Attractive Members Online</h3>
                  <p>Join the Secure &amp; Easy Way</p>
                </div><a href="https://www.hotti.com/en/people/#" className="action call-to-action medium">Create an account</a></co-i18n>
            </div>
          </div>
        </section>
      </Grid>

      <Grid
        item
        xs={12}
        lg={3}
        sx={{
          backgroundColor: "background.paper",
          display: "flex",
          flexDirection: "row",
          flex: 1,
          width: "100%",
        }}
      >
        <footer className="block footer">
          <div className="limiting-wrapper clearfix">
            <section className="social-links-container"></section>
            <div className="appendix clearfix">
              <co-i18n>
                <ul className="menu">
                  <li><a href="https://www.hotti.com/en/about/#">About</a></li>
                  <li><a href="https://www.hotti.com/en/terms-and-conditions/#">Terms &amp; conditions</a></li>
                  <li><a href="https://www.hotti.com/en/policy/#">Privacy policy</a></li>
                  <li><a href="https://www.hotti.com/en/safety/#">Dating Securely</a></li>
                  <li><a href="https://www.hotti.com/en/help-center/#" target="_help-center">Help Center</a></li>
                  <li><a href="https://www.hotti.com/en/become-partner/#">Become a Partner</a></li>
                </ul>
              </co-i18n>
              <p className="copyright">
                <co-i18n>Copyright Hotti.com 2024. All rights reserved</co-i18n>
              </p>
            </div>
          </div>
        </footer>
      </Grid>
    </Box>
  );
};


export default Login;
