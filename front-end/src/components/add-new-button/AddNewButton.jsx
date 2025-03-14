import IconButton from "@mui/material/IconButton";
import { createSvgIcon } from "@mui/material/utils";

const PlusIcon = createSvgIcon(
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>,
  "Plus"
);

const AddNewButton = ({ type }) => (
  <IconButton size="small" type={type ? type : ""}>
    <PlusIcon />
  </IconButton>
  //   <button className={styles["add-new-button"]}>{children}</button>
);

export { AddNewButton };
