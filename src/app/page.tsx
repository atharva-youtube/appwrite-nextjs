"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { account } from "./appwrite";
import { ID } from "appwrite";

export default function Home() {
  const [signUpEmail, setSignUpEmail] = useState<string>("");
  const [signUpPassword, setSignUpPassword] = useState<string>("");
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");

  async function handleSignup(e: FormEvent) {
    e.preventDefault();

    try {
      const response = await account.create(
        ID.unique(),
        signUpEmail,
        signUpPassword
      );
      console.log(response);

      await account.createEmailSession(signUpEmail, signUpPassword);

      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error(err);
      alert(err.message || "An error occurred");
    }
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();

    try {
      await account.createEmailSession(loginEmail, loginPassword);
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Something went wrong");
    }
  }

  return (
    <main className="flex flex-col items-center justify-between p-24 gap-10">
      <h1>Sign up</h1>
      <form className="flex gap-5" onSubmit={handleSignup}>
        <input
          className="border border-black px-3"
          type="email"
          placeholder="Email"
          value={signUpEmail}
          onChange={(e) => setSignUpEmail(e.target.value)}
        />
        <input
          className="border border-black px-3"
          type="password"
          placeholder="Password"
          value={signUpPassword}
          onChange={(e) => setSignUpPassword(e.target.value)}
        />
        <button
          className="border border-black bg-black text-white px-5"
          type="submit"
        >
          Sign up
        </button>
      </form>

      <h1>Login</h1>
      <form className="flex gap-5" onSubmit={handleLogin}>
        <input
          className="border border-black px-3"
          type="email"
          placeholder="Email"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
        />
        <input
          className="border border-black px-3"
          type="password"
          placeholder="Password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
        />
        <button
          className="border border-black bg-black text-white px-5"
          type="submit"
        >
          Login
        </button>
      </form>
    </main>
  );
}
