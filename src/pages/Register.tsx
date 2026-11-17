import { Button, Select } from "flowbite-react";
import { useNavigate } from "react-router";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useAuthActions } from "../hooks/useAuthActions";
import FormField from "../components/ui/FormField";
import PasswordRules from "../components/ui/PasswordRules";
import AuthFormLayout from "../components/auth/AuthFormLayout";
import { registerSchema, type RegisterFormValues } from "../schemas/auth.schema";
import { showThemedAlert } from "../utils/showThemedAlert";

const registerInputClass = "[&_input]:h-[46px] [&_input]:rounded-[14px] [&_input]:border-[#dce4f1] [&_input]:bg-[#f7f9fc] [&_input]:text-gray-900 [&_input]:placeholder:text-gray-400 dark:[&_input]:border-gray-600 dark:[&_input]:bg-gray-700 dark:[&_input]:text-white dark:[&_input]:placeholder:text-gray-400";
const passwordInputClass = "[&_input]:h-[46px] [&_input]:rounded-[14px] [&_input]:border-[#dce4f1] [&_input]:bg-[#eaf1ff] [&_input]:text-gray-900 [&_input]:placeholder:text-gray-400 dark:[&_input]:border-gray-600 dark:[&_input]:bg-gray-700 dark:[&_input]:text-white dark:[&_input]:placeholder:text-gray-400";

function toDateInputValue(date: Date | undefined) {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getLatestBirthDate() {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 13);
  return date;
}

export default function Register() {
  const { signup } = useAuthActions();
  const nav = useNavigate();
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSubmit,
    register,
    setValue,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    mode: "onTouched",
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      rePassword: "",
    },
    resolver: zodResolver(registerSchema),
  });

  const passwordValue = useWatch({ control, name: "password" }) ?? "";
  const dateOfBirth = useWatch({ control, name: "dateOfBirth" });
  const latestBirthDate = getLatestBirthDate();

  async function handleApi(values: RegisterFormValues) {
    setServerError("");
    setIsSubmitting(true);
    await signup(values)
      .then((res) => {
        void showThemedAlert({
          icon: "success",
          title: "success!",
          text: res.data.message,
          confirmButtonText: "cool",
        });
        setTimeout(() => {
          nav("/Login");
        }, 2000);
      })
      .catch((err) => {
        setServerError(err.response?.data?.message || "Registration failed. Please try again.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <AuthFormLayout activeTab="register">
      <form
        onSubmit={handleSubmit(handleApi)}
        onChange={() => {
          if (serverError) setServerError("");
        }}
        className="flex flex-col gap-3"
      >
        <FormField
          {...register("name")}
          placeholder="Full name"
          aria-label="Full name"
          autoComplete="name"
          sizing="lg"
          className={registerInputClass}
          icon={() => <i className="fa-regular fa-user text-slate-400"></i>}
          error={errors.name?.message}
        />

        <FormField
          {...register("username")}
          placeholder="Username"
          aria-label="Username"
          autoComplete="username"
          sizing="lg"
          className={registerInputClass}
          icon={() => <i className="fa-solid fa-at text-slate-400"></i>}
          error={errors.username?.message}
        />

        <FormField
          {...register("email")}
          type="email"
          placeholder="Email address"
          aria-label="Email address"
          autoComplete="email"
          sizing="lg"
          className={registerInputClass}
          icon={() => <i className="fa-solid fa-at text-slate-400"></i>}
          error={errors.email?.message}
        />

        <FormField error={errors.gender?.message}>
          <div className="relative">
            <i className="fa-solid fa-users absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" aria-hidden="true"></i>
            <Select
              {...register("gender")}
              aria-label="Gender"
              className="w-full [&_select]:h-[46px] [&_select]:rounded-[14px] [&_select]:border-[#dce4f1] [&_select]:bg-[#f7f9fc] [&_select]:ps-11 [&_select]:text-gray-900 dark:[&_select]:border-gray-600 dark:[&_select]:bg-gray-700 dark:[&_select]:text-white"
            >
              <option value="" disabled>Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Select>
          </div>
        </FormField>

        <div className="relative">
          <i className="fa-regular fa-calendar absolute top-[22px] left-4 z-10 -translate-y-1/2 text-slate-400" aria-hidden="true"></i>
          <FormField
            variant="native"
            type="date"
            value={toDateInputValue(dateOfBirth)}
            max={toDateInputValue(latestBirthDate)}
            aria-label="Date of birth"
            autoComplete="bday"
            className="h-[46px] w-full rounded-[14px] border border-[#dce4f1] bg-[#f7f9fc] py-2 pe-4 ps-11 text-sm text-gray-900 shadow-sm transition-colors [color-scheme:light] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:[color-scheme:dark]"
            error={errors.dateOfBirth?.message}
            onChange={(event) => {
              if (serverError) setServerError("");
              const value = event.target.value;
              setValue(
                "dateOfBirth",
                value ? new Date(`${value}T00:00:00`) : (undefined as never),
                { shouldValidate: true, shouldTouch: true },
              );
            }}
          />
        </div>

        <div>
          <FormField
            {...register("password")}
            type="password"
            placeholder="Password"
            aria-label="Password"
            autoComplete="new-password"
            showPasswordToggle
            sizing="lg"
            className={passwordInputClass}
            icon={() => <i className="fa-solid fa-key text-slate-400"></i>}
            error={errors.password?.message}
          />
          <PasswordRules value={passwordValue} />
        </div>

        <FormField
          {...register("rePassword")}
          type="password"
          placeholder="Confirm password"
          aria-label="Confirm password"
          autoComplete="new-password"
          showPasswordToggle
          sizing="lg"
          className={registerInputClass}
          icon={() => <i className="fa-solid fa-key text-slate-400"></i>}
          error={errors.rePassword?.message}
        />

        {serverError && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400"
          >
            {serverError}
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="w-full bg-blue-900 hover:bg-blue-800 disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Create account
        </Button>
      </form>
    </AuthFormLayout>
  );
}
