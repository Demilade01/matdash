'use client'

import { Button, Label, TextInput } from "flowbite-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const AuthRegister = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, seterror] = useState<string | null>(null);
    const router = useRouter();
    const [name, setName] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      try {
        const result = await signIn('credentials', {
          name,
          email,
          password,
          redirect: false,
          mode: 'signup',
        });

        if (result?.error) {
          seterror(result.error);
        } else {
          router.refresh();
          router.push('/');
        }
      } catch (error) {
        seterror('An unexpected error occurred 😥');
      }
    }
  return (
    <>
      <form onSubmit={handleSubmit}>
      <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="name" value="Name" />
          </div>
          <TextInput
            id="name"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sizing="md"
            className="form-control form-rounded-xl"
          />
        </div>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="emadd" value="Email Address" />
          </div>
          <TextInput
            id="email"
            type="email"
            sizing="md"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control form-rounded-xl"
          />
        </div>
        <div className="mb-6">
          <div className="mb-2 block">
            <Label htmlFor="userpwd" value="Password" />
          </div>
          <TextInput
            id="userpwd"
            type="password"
            sizing="md"
            className="form-control form-rounded-xl"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button color={'primary'} className="w-full" type="submit">Sign Up</Button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </>
  )
}

export default AuthRegister
