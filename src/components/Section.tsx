import { ElementType } from "react";

type SectionProps = {
  as?: ElementType;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

/**
 * Shared section wrapper. Applies the site spacing scale (.section-gap) and
 * content width (.content-w) defined in globals.css so pages stop hardcoding
 * their own padding. Adopt per page as sections are refactored
 * (see WYZDESIGN_CONSOLIDATION_AUDIT.md).
 */
export default function Section({ as: Tag = "section", className = "", children, ...rest }: SectionProps) {
  return (
    <Tag className={`section-gap content-w ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
