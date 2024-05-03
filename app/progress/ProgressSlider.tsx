import Slider from "@mui/material/Slider";

type Props = {
  max: any;
  value: any;
  onChange: any;
};
export default function ProgressSlider({ max, value, onChange }: Props) {
  return (
    <Slider
      max={max}
      value={value}
      onChange={(_, value) => onChange(value as number)}
      size="medium"
      sx={{
        color: "#582b76",
        height: 6,
        "& .MuiSlider-thumb": {
          width: 8,
          height: 16,
          borderRadius: "10px",
          background: "white",
          transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
          "&::before": {
            boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
          },
          "&:hover, &.Mui-focusVisible": {
            boxShadow: "0px 0px 0px 8px rgb(255 255 255 / 16%)",
          },
          "&.Mui-active": {
            width: 10,
            height: 20,
          },
        },
        "& .MuiSlider-rail": {
          opacity: 0.28,
        },
      }}
    />
  );
}
