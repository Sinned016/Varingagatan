import { useState } from "react";
import { db, auth } from "../config/firebase";
import { addDoc, collection } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [howDidYouHear, setHowDidYouhear] = useState("");
  const [formError, setFormError] = useState("");
  const [passwordFormError, setPasswordFormError] = useState("");
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();

    if (
      !/\d/.test(password) ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password)
    ) {
      setPasswordFormError(
        "Password must contain at least one digit, one uppercase letter, and one lowercase letter."
      );
      return;
    }

    const formData = {
      username: username,
      email: email,
      phoneNumber: phoneNumber,
      country: country,
      age: age,
      howDidYouHear: howDidYouHear,
    };

    try {
      // Creating the user.
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Creating a collection with the user and more information inside of it.
      const usersCollectionRef = collection(db, "users");
      const docRef = await addDoc(usersCollectionRef, {
        authId: userCredential.user.uid,
        ...formData,
      });

      navigate("/");
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.log(e);
      if (e.code === "auth/email-already-in-use") {
        setFormError("Email is already in use");
      } else {
        setFormError("An error occurred. Please try again later.");
      }
    }
  }

  function formDefaults(name, placeholder, override = {}) {
    return {
      name,
      type: "text",
      placeholder,
      required: true,
      autoComplete: "on",
      ...override,
    };
  }

  return (
    <div className="flex justify-center items-center">
      <div className="border p-6 border-neutral-500 rounded-xl mt-10 w-full bg-card shadow-lg">
        <form onSubmit={handleRegister}>
          <h1 className="text-center text-2xl font-bold mb-4">
            Skapa nytt konto!
          </h1>

          <div className="text-red-500">
            <p>{formError}</p>
          </div>

          <div className="mb-4">
            <p className="font-bold text-sm mb-2 text-secondary-foreground">
              Email
            </p>
            <input
              className="py-2 px-3 w-full rounded-xl bg-card border border-neutral-500"
              {...formDefaults("email", "Email", { type: "email" })}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <p className="font-bold text-sm mb-2 text-secondary-foreground">
              Användarnamn
            </p>
            <input
              className="py-2 px-3 w-full rounded-xl bg-card border border-neutral-500"
              {...formDefaults("användarnamn", "Användarnamn")}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <p className="font-bold text-sm mb-2 text-secondary-foreground">
              Telefonnummer
            </p>
            <input
              className="py-2 px-3 w-full rounded-xl bg-card border border-neutral-500"
              {...formDefaults("telefonnummer", "Telefonnummer", {
                type: "tel",
              })}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <p className="font-bold text-sm mb-2 text-secondary-foreground">
              Land
            </p>
            <input
              className="py-2 px-3 w-full rounded-xl bg-card border border-neutral-500"
              {...formDefaults("land", "Land")}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <p className="font-bold text-sm mb-2 text-secondary-foreground">
              Ålder
            </p>
            <input
              className="py-2 px-3 w-full rounded-xl bg-card border border-neutral-500"
              {...formDefaults("ålder", "Ålder", { type: "number" })}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <p className="text-red-500">{passwordFormError}</p>

          <div className="mb-4">
            <p className="font-bold text-sm mb-2 text-secondary-foreground">
              Lösenord
            </p>
            <input
              className="py-2 px-3 w-full rounded-xl bg-card border border-neutral-500"
              {...formDefaults("lösenord", "Välj ett lösenord", {
                minLength: 8,
                type: "password",
              })}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-8">
            <select
              {...formDefaults("HowDidYouhear", "", { required: false })}
              className="py-2 px-3 w-full rounded-xl bg-card border border-neutral-500"
              onChange={(e) => setHowDidYouhear(e.target.value)}
            >
              <option value=""> Hur hörde du om oss?</option>
              <option>Från en vän</option>
              <option>På sociala media</option>
              <option>Något annat</option>
            </select>
          </div>
        </form>

        <button
          className="px-4 py-2 rounded-full bg-primary w-full text-white hover:bg-red-500 duration-200"
          type="submit"
        >
          Registrera
        </button>

        <p className="text-sm text-center pt-6">
          Har du redan ett konto?{" "}
          <Link
            className="hover:underline underline-offset-2 text-primary font-bold"
            to={"/login"}
          >
            Logga in
          </Link>
        </p>
      </div>
    </div>
  );
}
