import { getSession } from 'next-auth/react'

export async function getServerSideProps(context) {
  const session = await getSession(context)

  if (session && session.status === 'authenticated') {
    const accessToken = session.accessToken

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
      destination: '/',
      permanent: false,
    },
  }
}
