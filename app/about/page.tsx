import NavbarHoverDropdown from '@/components/Navbar';
import Footer from '@/components/Footer';
import Main from '@/components/Main';

const contactLinks = [
  { logo: '/assets/email.svg', url: 'mailto:hangedindigo@gmail.com' },
  { logo: '/assets/ig.svg', url: 'https://www.instagram.com/lcy_indiewolf' },
  { logo: '/assets/x.svg', url: 'https://x.com/lcy_indf' },
  { logo: '/assets/bluesky.svg', url: 'https://bsky.app/profile/indiewolf.bsky.social' }
];

export default function AboutPage() {
  return (
    <div className="h-dvh flex flex-col">
      <NavbarHoverDropdown />
      <Main className="m-auto">
        <div>
          <div className="flex flex-col-reverse md:flex-row items-center gap-4">
            <div>
              <p>
                我叫林朝昱Lin Chao Yu，可以叫我LCY，透過自學發現了插畫及漫畫創作的樂趣，自我摸索的15年間，持續以非寫實的題材，來表現生活中各種事件誘發的情感。壓力大時會吸貓跟烤披薩紓壓，喜歡快節奏及懸疑感強烈的音樂，喜歡散步或是待在家，座右銘是「Be Kind」，出自於《你他媽的多重宇宙》
              </p>
              <p className="mt-2">
                My name is Lin Chao Yu, but you can call me LCY. I discovered the joy of illustration and comic creation through self-learning. Over the past 15 years of exploring on my own, I’ve continued to express emotions triggered by various life events through non-realistic themes. When I’m stressed, I decompress by cuddling with cats and baking pizza. I enjoy fast-paced and suspenseful music, and I like either going for walks or staying at home. My motto is “Be Kind,” a quote from Everything Everywhere All at Once.
              </p>
            </div>
            <div>
              <img src="/assets/about.jpg" className="max-w-64" alt="Lin Chao Yu" />
            </div>
          </div>
          <div className="flex gap-4 items-center mt-8">
            {contactLinks.map((link) => (
              <div key={link.url} className="w-6">
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <img src={link.logo} alt={link.url} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </Main>
      <Footer />
    </div>
  );
}
