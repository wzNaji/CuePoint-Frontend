import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { registerUser } from "../api/auth";
import FormField from "../components/FormField";
import Message from "../components/Message";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [displayNameError, setDisplayNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalMessage, setGeneralMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const resetErrors = () => {
    setEmailError("");
    setDisplayNameError("");
    setPasswordError("");
    setGeneralMessage("");
    setSuccess(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    resetErrors();

    try {
      const data = await registerUser(email, displayName, password);

      setGeneralMessage(`Registered successfully! Welcome, ${data.display_name}`);
      setSuccess(true);

      setTimeout(() => navigate("/login"), 3000);
    } catch (error: unknown) {
      setSuccess(false);

      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;

        if (status === 422) {
          const details = error.response.data?.detail;
          if (Array.isArray(details)) {
            details.forEach((d: any) => {
              const field = d.loc?.[1];
              if (field === "password")
                setPasswordError("Password must be between 8 and 64 characters");
              if (field === "email")
                setEmailError("Invalid email format");
              if (field === "display_name")
                setDisplayNameError("Display name is invalid");
            });
          } else {
            setGeneralMessage("Invalid input");
          }
        } else if (status === 400) {
          setGeneralMessage(error.response.data.detail || "Registration failed");
        } else {
          setGeneralMessage("An unexpected error occurred");
        }
      } else {
        setGeneralMessage("Registration failed. Try again later.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl mb-4">Register</h1>

      <form onSubmit={handleRegister} className="flex flex-col gap-3">
        <FormField type="email" placeholder="Email" value={email} onChange={setEmail} error={emailError} />
        <FormField type="text" placeholder="Display Name" value={displayName} onChange={setDisplayName} error={displayNameError} />
        <FormField type="password" placeholder="Password" value={password} onChange={setPassword} error={passwordError} />

        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Register
        </button>
      </form>

      {generalMessage && <Message text={generalMessage} success={success} />}
    </div>
  );
};

export default RegisterPage;
