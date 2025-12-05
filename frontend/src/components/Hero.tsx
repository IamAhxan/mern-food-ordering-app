import hero from "./../assets/hero.png";

const Hero = () => {
  return (
    <div>
      <img
        src={hero}
        alt="Hero Banner Image"
        className="w-full max-h-[6000px] object-cover"
      />
    </div>
  );
};

export default Hero;
