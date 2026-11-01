export default function SolarIcon({ name }) {
  return (
    <img
      className="solar-icon"
      src={"/solar-" + name + ".svg"}
      alt=""
      aria-hidden="true"
    />
  );
}
