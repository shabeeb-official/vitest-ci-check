import avatar from "@/components/assets/avatar.png";

interface LogoSectionProps {
  logoImg?: string;
  titleText?: string;
  titleBold?: string;
  styles?: any;
}

const LogoSection = ({
  logoImg = avatar,
  titleText = "shop with ",
  titleBold = "grace & stella",
  styles,
}: LogoSectionProps) => {
  return (
    <div className={styles?.wrapper}>
      <img src={logoImg} alt="app-logo" className={styles?.image} />
      <h2 className={styles?.title}>
        {titleText} <span className={styles?.titleBold}>{titleBold}</span>
      </h2>
    </div>
  );
};

export default LogoSection;
