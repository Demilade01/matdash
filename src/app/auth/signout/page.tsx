'use client'
import { Button } from 'flowbite-react'
import { signOut } from 'next-auth/react'
import React from 'react'

const SignOut = () => {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/signin'})
  }
  return (
    <div>
      <Button onClick={handleSignOut}>Sign Out</Button>
    </div>
  )
}

export default SignOut