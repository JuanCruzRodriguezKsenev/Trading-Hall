"use client";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/Button";
import styles from "./Navbar.module.css";

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className={styles.nav}>
      <Link href="/worlds" className={styles.logo}>
        <span>💎</span> Trading Hall
      </Link>

      <div className={styles.userSection}>
        {user && (
          <>
            <span className={styles.username}>{user.username}</span>
            <Button
              variant="secondary"
              onClick={logout}
              style={{ padding: "0.5rem 1rem" }}
            >
              Salir
            </Button>
          </>
        )}
      </div>
    </nav>
  );
};
