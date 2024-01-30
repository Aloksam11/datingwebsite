import { ApiPath } from '../../utils/helpers/apiPath'
import { doPost } from '../../utils/helpers/axios'
import { CONSTANTS } from '../../utils/helpers/constant'

const userApiBaseUrl = `${CONSTANTS.API_URL.HOST}/${CONSTANTS.API_URL.VERSION}/user`

async function sendVerificationOTP(email) {
  const url = `${userApiBaseUrl}/${ApiPath.onbording.sendVerificationOTP}`
  const params = {
    email: email,
  }
  try {
    const response = await doPost(url, params)
    return { data: response.data }
  } catch (error) {
    throw error
  }
}

async function verifyOtp(otp, authToken) {
  const url = `${userApiBaseUrl}/${ApiPath.onbording.verifyOTP}`
  const params = {
    otp: otp,
  }
  try {
    const response = await doPost(url, params, authToken)
    return { data: response.data }
  } catch (error) {
    throw error
  }
}

async function verifyOTPresetPassWord(otp, authToken) {
  const url = `${userApiBaseUrl}/${ApiPath.onbording.verifyOTPPwd}`
  const params = {
    otp: otp,
  }
  try {
    const response = await doPost(url, params, authToken)
    return { data: response.data }
  } catch (error) {
    throw error
  }
}
async function registerUser(params, authToken) {
  const url = `${userApiBaseUrl}/${ApiPath.onbording.register}`
  try {
    const response = await doPost(url, params, authToken)
    console.log(response, 'from register')
    return { data: response.data }
  } catch (error) {
    throw error
  }
}

async function loginUser(email, password) {
  const url = `${userApiBaseUrl}/${ApiPath.onbording.login}`
  const params = {
    email: email,
    password: password,
  }
  try {
    const response = await doPost(url, params)
    return { data: response.data }
  } catch (error) {
    throw error
  }
}

async function forgotPassword(email) {
  const url = `${userApiBaseUrl}/${ApiPath.onbording.forgotPwd}`
  const params = {
    email: email,
  }
  try {
    const response = await doPost(url, params)
    return { data: response.data }
  } catch (error) {
    throw error
  }
}

async function resetPassword(password, authToken) {
  const url = `${userApiBaseUrl}/${ApiPath.onbording.resetPwd}`
  const params = {
    password: password,
  }
  try {
    const response = await doPost(url, params, authToken)
    return { data: response.data }
  } catch (error) {
    throw error
  }
}

async function ssoLogin(...params) {
  const { id_token, provider, extradata } = params[0]
  const url = `${userApiBaseUrl}/${ApiPath.onbording.sso}`
  const parmas = {
    provider: provider.toUpperCase(),
    idtoken: id_token,
  }
  if (provider === 'APPLE') {
    parmas.extradata =
      extradata.user !== undefined ? extradata : { defaultusername: 'User' }
  }
  try {
    const response = await doPost(url, parmas)
    return { data: response.data }
  } catch (error) {
    throw error
  }
}

export {
  sendVerificationOTP,
  verifyOtp,
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  verifyOTPresetPassWord,
  ssoLogin,
}
