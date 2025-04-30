import { usePageContext } from 'vike-react/usePageContext';
import { useMemo } from 'react';
import LightGallery from 'lightgallery/react';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';

import Illustration202501 from "../../../assets/illustration/2025/illustr_2025_1.webp"
import Illustration202502 from "../../../assets/illustration/2025/illustr_2025_2.webp"
import Illustration202503 from "../../../assets/illustration/2025/illustr_2025_3.webp"
import Illustration202504 from "../../../assets/illustration/2025/illustr_2025_4.webp"
import Illustration202505 from "../../../assets/illustration/2025/illustr_2025_5.webp"
import Illustration202506 from "../../../assets/illustration/2025/illustr_2025_6.webp"
import Illustration202507 from "../../../assets/illustration/2025/illustr_2025_7.webp"
import Illustration202508 from "../../../assets/illustration/2025/illustr_2025_8.webp"
import Illustration202509 from "../../../assets/illustration/2025/illustr_2025_9.webp"
import Illustration202510 from "../../../assets/illustration/2025/illustr_2025_10.webp"
import Illustration202511 from "../../../assets/illustration/2025/illustr_2025_11.webp"
import Illustration202512 from "../../../assets/illustration/2025/illustr_2025_12.webp"
import Illustration202513 from "../../../assets/illustration/2025/illustr_2025_13.webp"
import Illustration202514 from "../../../assets/illustration/2025/illustr_2025_14.webp"
import Illustration202515 from "../../../assets/illustration/2025/illustr_2025_15.webp"
import Illustration202516 from "../../../assets/illustration/2025/illustr_2025_16.webp"
import Illustration202517 from "../../../assets/illustration/2025/illustr_2025_17.webp"
import Illustration202518 from "../../../assets/illustration/2025/illustr_2025_18.webp"
import Illustration202501Thumb from "../../../assets/illustration/2025/illustr_2025_1-768.webp"
import Illustration202502Thumb from "../../../assets/illustration/2025/illustr_2025_2-768.webp"
import Illustration202503Thumb from "../../../assets/illustration/2025/illustr_2025_3-768.webp"
import Illustration202504Thumb from "../../../assets/illustration/2025/illustr_2025_4-768.webp"
import Illustration202505Thumb from "../../../assets/illustration/2025/illustr_2025_5-768.webp"
import Illustration202506Thumb from "../../../assets/illustration/2025/illustr_2025_6-768.webp"
import Illustration202507Thumb from "../../../assets/illustration/2025/illustr_2025_7-768.webp"
import Illustration202508Thumb from "../../../assets/illustration/2025/illustr_2025_8-768.webp"
import Illustration202509Thumb from "../../../assets/illustration/2025/illustr_2025_9-768.webp"
import Illustration202510Thumb from "../../../assets/illustration/2025/illustr_2025_10-768.webp"
import Illustration202511Thumb from "../../../assets/illustration/2025/illustr_2025_11-768.webp"
import Illustration202512Thumb from "../../../assets/illustration/2025/illustr_2025_12-768.webp"
import Illustration202513Thumb from "../../../assets/illustration/2025/illustr_2025_13-768.webp"
import Illustration202514Thumb from "../../../assets/illustration/2025/illustr_2025_14-768.webp"
import Illustration202515Thumb from "../../../assets/illustration/2025/illustr_2025_15-768.webp"
import Illustration202516Thumb from "../../../assets/illustration/2025/illustr_2025_16-768.webp"
import Illustration202517Thumb from "../../../assets/illustration/2025/illustr_2025_17-768.webp"
import Illustration202518Thumb from "../../../assets/illustration/2025/illustr_2025_18-768.webp"
import Illustration201901 from "../../../assets/illustration/2019/illustr_2019_01.webp"
import Illustration201901Thumb from "../../../assets/illustration/2019/illustr_2019_01-768.webp"
import Illustration201801 from "../../../assets/illustration/2018/illustr_2018_01.webp"
import Illustration201801Thumb from "../../../assets/illustration/2018/illustr_2018_01-768.webp"

const images2025 = [
    Illustration202501,
    Illustration202502,
    Illustration202503,
    Illustration202504,
    Illustration202505,
    Illustration202506,
    Illustration202507,
    Illustration202508,
    Illustration202509,
    Illustration202510,
    Illustration202511,
    Illustration202512,
    Illustration202513,
    Illustration202514,
    Illustration202515,
    Illustration202516,
    Illustration202517,
    Illustration202518
]
const imagesThumb2025 = [
    Illustration202501Thumb,
    Illustration202502Thumb,
    Illustration202503Thumb,
    Illustration202504Thumb,
    Illustration202505Thumb,
    Illustration202506Thumb,
    Illustration202507Thumb,
    Illustration202508Thumb,
    Illustration202509Thumb,
    Illustration202510Thumb,
    Illustration202511Thumb,
    Illustration202512Thumb,
    Illustration202513Thumb,
    Illustration202514Thumb,
    Illustration202515Thumb,
    Illustration202516Thumb,
    Illustration202517Thumb,
    Illustration202518Thumb
]


const images2019 = [
    Illustration201901
]
const imagesThumb2019 = [
    Illustration201901Thumb
]
const images2018 = [
    Illustration201801
]
const imagesThumb2018 = [
    Illustration201801Thumb
]
const images = [
    {
        year: "2025",
        images: images2025,
        imagesThumb: imagesThumb2025
    },
    {
        year: "2019",
        images: images2019,
        imagesThumb: imagesThumb2019
    },
    {
        year: "2018",
        images: images2018,
        imagesThumb: imagesThumb2018
    }
]

const years = ["2025", "2019", "2018"]

export default function Page() {
    const pageContext = usePageContext();
    const routeParams = pageContext.routeParams.id;
    const currentPage = useMemo(() => images.find((item) => item.year === routeParams), [routeParams]);
    return (
        <main id="page-content" className="flex flex-col gap-4">
            <ul className="text-lg flex gap-4">
                {years.map((year) => (
                    <li key={year} >
                        <a className={`${routeParams === year ? "border-b" : ""}`}
                            href={`${pageContext.urlOriginal.split("/").slice(0, -1).join("/")}/${year}`}>{year}</a>
                    </li>
                ))}
            </ul>
            <LightGallery
                download={false}
                elementClassNames="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
                selector=".gallery-item"
            >
                {currentPage?.imagesThumb.map((item, index) => (
                    <div
                        key={index}
                        className="gallery-item shadow"
                        data-src={currentPage.images[index]}
                    >
                        <img className="img-responsive" src={item} />
                    </div>
                )
                )}
            </LightGallery>
        </main>
    )
}