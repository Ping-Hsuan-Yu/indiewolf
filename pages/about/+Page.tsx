import EmailLogo from "../../assets/email.svg";
import IgLogo from "../../assets/ig.svg";
import XLogo from "../../assets/x.svg";
import BlueSkyLogo from "../../assets/bluesky.svg";

const contactLinks = [
  { logo: EmailLogo, url: "mailto:hangedindigo@gmail.com" },
  { logo: IgLogo, url: "https://www.instagram.com/lcy_indiewolf" },
  { logo: XLogo, url: "https://x.com/lcy_indf" },
  { logo: BlueSkyLogo, url: "https://bsky.app/profile/indiewolf.bsky.social" },
];

export default function Page() {
  return (
    <main id="page-content" className="my-auto">
      <p>
        我是林朝昱Lin Chao
        Yu，可以叫我LCY，從事插畫及漫畫創作已有15年的時間，我喜歡烤披薩，除了畫圖之外，最讓我快樂的就是烤自己做的披薩🍕。
      </p>
      <p>
        I’m Lin Chao Yu (LCY), an illustrator and comic artist with 15 years of
        experience. Besides drawing, what brings me the greatest joy is baking
        pizzas made by my own hands.
      </p>
      <div className="flex gap-4 items-center mt-8">
        {contactLinks.map((link) => (
          <div key={link.url} className="w-6">
            <a href={link.url} target="_blank">
              <img src={link.logo} alt={link.url} />
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
