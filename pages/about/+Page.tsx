import EmailLogo from "../../assets/email.svg";
import IgLogo from "../../assets/ig.svg";
import XLogo from "../../assets/x.svg";
import BlueSkyLogo from "../../assets/bluesky.svg";
import Avatar from "../../assets/about.jpg";
import Main from "../../components/Main";

const contactLinks = [
  { logo: EmailLogo, url: "mailto:hangedindigo@gmail.com" },
  { logo: IgLogo, url: "https://www.instagram.com/lcy_indiewolf" },
  { logo: XLogo, url: "https://x.com/lcy_indf" },
  { logo: BlueSkyLogo, url: "https://bsky.app/profile/indiewolf.bsky.social" },
];

export default function Page() {
  return (
    <Main className="m-auto">
      <div>
        <div className="flex flex-col-reverse md:flex-row items-center gap-4">
          <div>
            <p>
              我叫林朝昱Lin Chao
              Yu，可以叫我LCY，透過自學發現了插畫及漫畫創作的樂趣，自我摸索的15年間，持續以非寫實的題材，來表現生活中各種事件誘發的情感。壓力大時會吸貓跟烤披薩紓壓，喜歡快節奏及懸疑感強烈的音樂，喜歡散步或是待在家，座右銘是「Be
              Kind」，出自於《你他媽的多重宇宙》
            </p>
            <p className="mt-2">
              My name is Lin Chao Yu, but you can call me LCY. I discovered the
              joy of illustration and comic creation through self-learning. Over
              the past 15 years of exploring on my own, I’ve continued to
              express emotions triggered by various life events through
              non-realistic themes. When I’m stressed, I decompress by cuddling
              with cats and baking pizza. I enjoy fast-paced and suspenseful
              music, and I like either going for walks or staying at home. My
              motto is “Be Kind,” a quote from Everything Everywhere All at
              Once.
            </p>
          </div>
          <div>
            <img src={Avatar} className="max-w-64" alt="" />
          </div>
        </div>
        <div className="flex gap-4 items-center mt-8">
          {contactLinks.map((link) => (
            <div key={link.url} className="w-6">
              <a href={link.url} target="_blank">
                <img src={link.logo} alt={link.url} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </Main>
  );
}
