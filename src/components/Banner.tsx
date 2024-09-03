import React,  { useState, useEffect } from "react";

/*
 * Banner: pulls an image url from api.nasa.gov and displays the site banner
 */
const Banner: React.FC = () => {
    const [imgUrl, setImgUrl] = useState<string | null>(null);
    const [hdImgUrl, setHdImgUrl] = useState<string | null>(null);
    const [currentImgUrl, setCurrentImgUrl] = useState<string | null>(null);
    const [copyright, setCopyright] = useState<string | null>(null);

    useEffect(() => {
        const fetchImg = async () => {
            //const res = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
            const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY; // The API key is accessed via `process.env.NEXT_PUBLIC_NASA_API_KEY`, ensuring it is stored securely and not hard-coded. Added by Sina on branch bugfix-6
            const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`);
            const data = await res.json();

            setImgUrl(data.url);
            setHdImgUrl(data.hdurl);
            setCurrentImgUrl(window.innerWidth > 800 ? data.hdurl : data.url);
            setCopyright(data.copyright);
        };

        fetchImg();

        const handleResize = () => {
            const bannerElement = document.querySelector('.banner');
            bannerElement?.setAttribute('style', `background-image: url(${window.innerWidth > 800? hdImgUrl : imgUrl})`);
        };

        window.addEventListener('resize', handleResize);

        handleResize();
    }, []);

    if (!currentImgUrl)
        return <p>Banner Loading...</p>;

    return (
        <div className="banner" style={{ backgroundImage: `url(${currentImgUrl})` }}>
            <h1>To Do List</h1>
            {copyright && (
                <p className="copyright">{copyright}©</p>
            )}
        </div>
    );
}

export default Banner;