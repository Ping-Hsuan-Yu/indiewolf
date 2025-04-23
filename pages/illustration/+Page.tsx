import LightGallery from 'lightgallery/react';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';

import Img01 from "../../assets/unsplash-1.jpg";
import Img02 from "../../assets/unsplash-2.jpg";
import Img03 from "../../assets/unsplash-3.jpg";
import Img04 from "../../assets/unsplash-4.jpg";
import Img05 from "../../assets/unsplash-5.jpg";
import Img06 from "../../assets/unsplash-6.jpg";
import Img07 from "../../assets/unsplash-7.jpg";
import Img08 from "../../assets/unsplash-8.jpg";
import Img09 from "../../assets/unsplash-9.jpg";
import Img10 from "../../assets/unsplash-10.jpg";
import Img11 from "../../assets/unsplash-11.jpg";
import Img12 from "../../assets/unsplash-12.jpg";
import Img13 from "../../assets/unsplash-13.jpg";

const images1 = [Img01, Img02, Img03, Img04, Img05, Img06];
const images2 = [Img07, Img08, Img09, Img10, Img11, Img12, Img13];

export default function Page() {

    return (
        <main id="page-content" className="flex flex-col gap-8">
            <LightGallery
                download={false}
                elementClassNames="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
                selector=".gallery-item"
            >
                <p className="text-lg col-span-full -mb-4" data-lg-ignore="true">2025</p>
                {images1.map((item, index) => (
                    <div
                        key={index}
                        className="gallery-item"
                        data-src={item}
                    >
                        <img className="img-responsive" src={item} />
                    </div>
                )
                )}

                <p className="text-lg col-span-full -mb-4" data-lg-ignore="true">2024</p>
                {images2.map((item, index) => (
                    <div
                        key={index}
                        className="gallery-item"
                        data-src={item}
                    >
                        <img className="img-responsive" src={item} />
                    </div>
                )
                )}
            </LightGallery>

        </main>
    )
}