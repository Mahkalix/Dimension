import styles from "./Action.module.scss";

export default function Action({ href, as, variant = "secondary", className = "", children, ...props }) {
  const Tag = as || (href ? "a" : "button");
  return <Tag href={href} type={Tag === "button" ? "button" : undefined}
    className={`${styles.action} ${styles[variant]} ${className}`} {...props}>{children}</Tag>;
}
