import { RegisterForm } from "@/components/features/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <RegisterForm />
    </div>
  );
}
