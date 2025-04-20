"use client"

import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const AuthLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // First try to sign in
      const result = await signIn('credentials', {
        email,
        password,
        mode: 'signin',
        redirect: false,
      });

      if (result?.error) {
        // If error is "No user found" or something similar → Try sign up
        if (result.error.toLowerCase().includes('no user')) {
          console.log('User not found. Creating new account...');

          const signupResult = await signIn('credentials', {
            email,
            password,
            mode: 'signup',
            redirect: false,
          });

          if (signupResult?.error) {
            setError(signupResult.error);
          } else {
            router.push('/');
          }
        } else {
          setError(result.error);
        }
      } else {
        router.push('/');
      }
    } catch (error) {
      setError('Something went wrong 😥');
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="Email" value="Email" />
          </div>
          <TextInput
            id="Email"
            type="email"
            sizing="md"
            className="form-control form-rounded-xl"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="userpwd" value="Password" />
          </div>
          <TextInput
            id="userpwd"
            type="password"
            sizing="md"
            className="form-control form-rounded-xl"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex justify-between my-5">
          <div className="flex items-center gap-2">
            <Checkbox id="accept" className="checkbox" />
            <Label
              htmlFor="accept"
              className="opacity-90 font-normal cursor-pointer"
            >
              Remeber this Device
            </Label>
          </div>
          <Link href={"/"} className="text-primary text-sm font-medium">
            Forgot Password ?
          </Link>
        </div>
        <Button type="submit" color={"primary"} className="w-full bg-primary text-white rounded-xl">
          Sign in
        </Button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </>
  );
};

export default AuthLogin;
