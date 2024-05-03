import IconButton from "@mui/joy/IconButton";

type Props = {
  onClick?: any;
  children: any;
};

export default function CustomIconButton({ onClick, children }: Props) {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        border: "none",
        width: "30px",
        height: "30px",
        borderRadius: "5px",
        color: "white",
        padding: "0.5rem",
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(255, 255, 255, 0.4)",
        transition: "all 0.25s ease-out",
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.6)", // adjust this value to your liking
        },
      }}
    >
      {children}
    </IconButton>
  );
}
