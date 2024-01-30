import { getSession } from 'next-auth/react'

export async function getServerSideProps(context) {
  const session = await getSession(context)

  if (session && session.status === 'authenticated') {
    // Access token is available in the session object
    const accessToken = session.accessToken

    // Now you can use the access token as needed
    // For example, fetch additional user data from an API

    // Rest of your server-side code...

    return {
      props: {
        session: {
          authenticated: true,
          accessToken,
        },
      },
    }
  }

  // If not authenticated, you can redirect the user to the login page
  return {
    redirect: {
      destination: '/login',
      permanent: false,
    },
  }
}
