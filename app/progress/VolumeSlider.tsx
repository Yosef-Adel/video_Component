import Slider from "@mui/material/Slider";

type Props = {
  value: any;
  onChange: any;
};

export default function VolumeSlider({ value, onChange }: Props) {
  return (
    <Slider
      size="medium"
      sx={{
        color: "#582b76",
        "& .MuiSlider-thumb": {
          width: 15,
          height: 15,
          transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
          "&::before": {
            boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
          },
          "&:hover, &.Mui-focusVisible": {
            boxShadow: "0px 0px 0px 8px rgb(255 255 255 / 16%)",
          },
          "&.Mui-active": {
            width: 20,
            height: 20,
          },
        },
        "& .MuiSlider-rail": {
          opacity: 0.28,
        },
      }}
      orientation="vertical"
      defaultValue={30}
      max={100}
      value={value}
      onChange={(_, value) => onChange(value as number)}
    />
  );
}
