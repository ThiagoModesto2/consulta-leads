import { FC } from "react";
import styles from "./styles.module.css";

interface ButtonProps {
  handleSubmit: () => void;
  title?: string;
  disabled?: boolean;
}

export const Button: FC<ButtonProps> = ({
  title = "Cadastrar",
  handleSubmit,
  disabled,
}) => {
  return (
    <button
      id={styles.prosseguirButton}
      onClick={handleSubmit}
      disabled={disabled}
    >
      {title}
    </button>
  );
};

export default Button;
